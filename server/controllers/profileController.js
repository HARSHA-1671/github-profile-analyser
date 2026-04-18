const mongoose = require("mongoose");
const cache = require("../services/cacheService");
const { fetchGitHubProfileBundle } = require("../services/githubService");
const { calculateScores } = require("../services/scoringService");
const Report = require("../models/Report");

const isDbConnected = () => mongoose.connection.readyState === 1;

async function buildReport(username) {
  const bundle = await fetchGitHubProfileBundle(username);
  const scores = calculateScores(bundle);
  const reportData = {
    username: username.toLowerCase(),
    profile: bundle.profile,
    scores,
    topRepositories: bundle.topRepositories,
    languageDistribution: bundle.languageDistribution,
    heatmap: bundle.heatmap,
    lastAnalyzed: new Date()
  };

  let report = reportData;

  // Save to DB only if connected
  if (isDbConnected()) {
    try {
      report = await Report.findOneAndUpdate(
        { username: username.toLowerCase() },
        reportData,
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("DB Save Error:", err.message);
    }
  }

  // Set memory cache
  cache.set(username.toLowerCase(), report);
  
  return report;
}

async function getProfileReport(request, response, next) {
  try {
    const username = request.params.username.toLowerCase();
    
    // 1. Check Memory Cache
    const cached = cache.get(username);
    if (cached) {
      return response.json(cached);
    }

    // 2. Check MongoDB (if connected)
    if (isDbConnected()) {
      const stored = await Report.findOne({ username });
      if (stored) {
        // Check if older than 24 hours
        const isStale = (new Date() - new Date(stored.lastAnalyzed)) > 24 * 60 * 60 * 1000;
        if (!isStale) {
          cache.set(username, stored);
          return response.json(stored);
        }
      }
    }

    // 3. Fetch Fresh from GitHub
    const report = await buildReport(username);
    return response.json(report);
  } catch (error) {
    return next(error);
  }
}

async function compareProfiles(request, response, next) {
  try {
    const u1 = request.query.u1;
    const u2 = request.query.u2;

    if (!u1 || !u2) {
      return response.status(400).json({
        message: "Compare mode requires u1 and u2 GitHub usernames."
      });
    }

    const usernames = [u1.trim().toLowerCase(), u2.trim().toLowerCase()];

    const reports = await Promise.all(
      usernames.map(async (username) => {
        // Check Memory Cache
        const cached = cache.get(username);
        if (cached) return cached;

        // Check MongoDB (if connected)
        if (isDbConnected()) {
          const stored = await Report.findOne({ username });
          if (stored) {
            const isStale = (new Date() - new Date(stored.lastAnalyzed)) > 24 * 60 * 60 * 1000;
            if (!isStale) {
              cache.set(username, stored);
              return stored;
            }
          }
        }

        // Fetch Fresh
        return buildReport(username);
      })
    );

    const categories = Object.keys(reports[0].scores.breakdown);
    const winners = categories.reduce((accumulator, category) => {
      accumulator[category] = reports.reduce((currentWinner, report) =>
        report.scores.breakdown[category] > currentWinner.scores.breakdown[category]
          ? report
          : currentWinner
      ).username;
      return accumulator;
    }, {});

    return response.json({
      reports,
      winners
    });
  } catch (error) {
    return next(error);
  }
}

function getHealth(request, response) {
  response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    cacheMode: "dual (memory + mongodb)",
    githubTokenConfigured: Boolean(process.env.GITHUB_TOKEN)
  });
}

module.exports = {
  getProfileReport,
  compareProfiles,
  getHealth
};

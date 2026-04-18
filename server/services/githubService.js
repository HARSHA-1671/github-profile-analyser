const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || undefined
});

function normalizeTopRepositories(repositories) {
  return [...repositories]
    .sort((a, b) => {
      const scoreA = (a.stargazers_count || 0) * 4 + (a.forks_count || 0) * 2 + (a.watchers_count || 0);
      const scoreB = (b.stargazers_count || 0) * 4 + (b.forks_count || 0) * 2 + (b.watchers_count || 0);
      return scoreB - scoreA;
    })
    .slice(0, 6)
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      language: repo.language,
      topics: repo.topics || [],
      homepage: repo.homepage,
      hasReadme: !!repo.description,
      hasLicense: !!repo.license?.key,
      url: repo.html_url,
      updatedAt: repo.updated_at
    }));
}

function buildLanguageDistribution(repositories) {
  const totals = repositories.reduce((accumulator, repo) => {
    if (!repo.language) {
      return accumulator;
    }

    accumulator[repo.language] = (accumulator[repo.language] || 0) + Math.max(repo.size || 1, 1);
    return accumulator;
  }, {});

  const totalSize = Object.values(totals).reduce((sum, value) => sum + value, 0) || 1;

  return Object.fromEntries(
    Object.entries(totals)
      .sort(([, left], [, right]) => right - left)
      .map(([language, value]) => [language, Number(((value / totalSize) * 100).toFixed(1))])
  );
}

function buildHeatmap(events) {
  const counts = new Map();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let index = 83; index >= 0; index -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    counts.set(date.toISOString().slice(0, 10), 0);
  }

  events.forEach((event) => {
    const dateKey = event.created_at?.slice(0, 10);
    if (counts.has(dateKey)) {
      counts.set(dateKey, counts.get(dateKey) + 1);
    }
  });

  const max = Math.max(...counts.values(), 1);

  return Array.from(counts.entries()).map(([date, count]) => ({
    date,
    count,
    level: count === 0 ? 0 : Math.min(4, Math.ceil((count / max) * 4))
  }));
}

async function fetchGitHubProfileBundle(username) {
  const normalized = username.toLowerCase();
  
  try {
    const [userResponse, reposResponse, eventsResponse] = await Promise.all([
      octokit.users.getByUsername({ username: normalized }),
      octokit.repos.listForUser({ username: normalized, per_page: 100, sort: "updated" }),
      octokit.activity.listPublicEventsForUser({ username: normalized, per_page: 100 }).catch(() => ({ data: [] }))
    ]);

    const user = userResponse.data;
    const repositories = reposResponse.data;
    const events = eventsResponse.data;

    return {
      profile: {
        username: user.login,
        name: user.name,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        publicRepos: user.public_repos,
        location: user.location,
        company: user.company,
        blog: user.blog,
        email: user.email,
        joinedAt: user.created_at,
        htmlUrl: user.html_url
      },
      repositories,
      topRepositories: normalizeTopRepositories(repositories),
      languageDistribution: buildLanguageDistribution(repositories),
      heatmap: buildHeatmap(events)
    };
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "GitHub API request failed.";
    const githubError = new Error(message);
    githubError.statusCode = status;
    throw githubError;
  }
}

module.exports = {
  fetchGitHubProfileBundle
};

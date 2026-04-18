function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function round(value) {
  return Number(value.toFixed(1));
}

function average(numbers) {
  if (!numbers.length) {
    return 0;
  }

  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

function calculateActivityScore(repositories, heatmap) {
  const pushedRecently = repositories.filter((repo) => {
    const updatedAt = new Date(repo.pushed_at).getTime();
    return Date.now() - updatedAt < 1000 * 60 * 60 * 24 * 90;
  }).length;

  const activeDays = heatmap.filter((cell) => cell.count > 0).length;
  const maxDay = Math.max(...heatmap.map((cell) => cell.count), 0);

  return clamp(pushedRecently * 6 + activeDays * 0.6 + maxDay * 4);
}

function calculateCodeQualityScore(repositories) {
  if (!repositories.length) {
    return 0;
  }

  const scored = repositories.map((repo) => {
    const description = repo.description ? 18 : 0;
    const topics = Math.min((repo.topics || []).length * 4, 16);
    const license = repo.license ? 18 : 0;
    const homepage = repo.homepage ? 10 : 0;
    const docsSignal = repo.has_wiki ? 8 : 0;
    const testsSignal = /test|spec|ci|lint/i.test(
      `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`
    )
      ? 14
      : 0;
    const stars = Math.min(repo.stargazers_count * 2, 16);

    return description + topics + license + homepage + docsSignal + testsSignal + stars;
  });

  return clamp(average(scored));
}

function calculateDiversityScore(repositories, languageDistribution) {
  const languageCount = Object.keys(languageDistribution).length;
  const forkRatio = repositories.length
    ? repositories.filter((repo) => !repo.fork).length / repositories.length
    : 0;
  const topicBreadth = new Set(repositories.flatMap((repo) => repo.topics || [])).size;
  const archivedPenalty = repositories.filter((repo) => repo.archived).length * 2.5;

  return clamp(languageCount * 12 + forkRatio * 35 + topicBreadth * 2 - archivedPenalty);
}

function calculateCommunityScore(profile, repositories) {
  const stars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const forks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
  const watchers = repositories.reduce((sum, repo) => sum + repo.watchers_count, 0);

  return clamp(profile.followers * 2 + stars * 1.2 + forks * 1.3 + watchers * 0.6);
}

function calculateHiringReadinessScore(profile, topRepositories) {
  const bio = profile.bio ? 20 : 0;
  const blog = profile.blog ? 20 : 0;
  const location = profile.location ? 10 : 0;
  const company = profile.company ? 10 : 0;
  const topRepoDocs = topRepositories.filter((repo) => repo.description).length * 6;
  const topRepoSignals = topRepositories.filter((repo) => repo.topics?.length).length * 4;

  return clamp(bio + blog + location + company + topRepoDocs + topRepoSignals);
}

function calculateScores({ profile, repositories, topRepositories, languageDistribution, heatmap }) {
  const breakdown = {
    activity: round(calculateActivityScore(repositories, heatmap)),
    codeQuality: round(calculateCodeQualityScore(repositories)),
    diversity: round(calculateDiversityScore(repositories, languageDistribution)),
    community: round(calculateCommunityScore(profile, repositories)),
    hiringReady: round(calculateHiringReadinessScore(profile, topRepositories))
  };

  const weights = {
    activity: 25,
    codeQuality: 20,
    diversity: 20,
    community: 20,
    hiringReady: 15
  };

  const overall = round(
    Object.entries(breakdown).reduce((sum, [key, value]) => sum + value * (weights[key] / 100), 0)
  );

  return {
    breakdown,
    overall
  };
}

module.exports = {
  calculateScores
};

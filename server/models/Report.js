const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  profile: {
    name: String,
    avatarUrl: String,
    bio: String,
    joinedAt: Date,
    followers: Number,
    publicRepos: Number,
    location: String,
    htmlUrl: String
  },
  scores: {
    overall: Number,
    breakdown: {
      activity: Number,
      quality: Number,
      diversity: Number,
      community: Number,
      readiness: Number
    }
  },
  topRepositories: [{
    name: String,
    url: String,
    description: String,
    stars: Number,
    forks: Number,
    language: String
  }],
  languageDistribution: {
    type: Map,
    of: Number
  },
  heatmap: [{
    date: String,
    count: Number,
    level: Number
  }],
  lastAnalyzed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;

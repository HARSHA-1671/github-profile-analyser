import { useState } from "react";
import { Search, Star, GitFork, Eye, Code, Calendar, MapPin, Link as LinkIcon, TrendingUp, Award } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const mockContributionData = [
  { month: "Jan", commits: 45, prs: 12, issues: 5 },
  { month: "Feb", commits: 62, prs: 18, issues: 8 },
  { month: "Mar", commits: 78, prs: 22, issues: 12 },
  { month: "Apr", commits: 54, prs: 15, issues: 7 },
  { month: "May", commits: 91, prs: 25, issues: 15 },
  { month: "Jun", commits: 68, prs: 20, issues: 10 },
];

const mockLanguageData = [
  { name: "TypeScript", value: 35, color: "#3178c6" },
  { name: "JavaScript", value: 28, color: "#f1e05a" },
  { name: "Python", value: 20, color: "#3572a5" },
  { name: "Go", value: 10, color: "#00add8" },
  { name: "Other", value: 7, color: "#8b949e" },
];

const mockSkillsData = [
  { skill: "Frontend", score: 85 },
  { skill: "Backend", score: 72 },
  { skill: "DevOps", score: 68 },
  { skill: "Mobile", score: 45 },
  { skill: "AI/ML", score: 60 },
  { skill: "Database", score: 75 },
];

export function Analyze() {
  const [username, setUsername] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    if (!username.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#e6edf3] to-[#58a6ff] bg-clip-text text-transparent">
          Analyze GitHub Profile
        </h1>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#7d8590]" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="Enter GitHub username..."
              className="w-full pl-12 pr-4 py-4 bg-[#0d1117] border border-[#30363d] rounded-xl text-[#e6edf3] placeholder-[#7d8590] focus:outline-none focus:border-[#1f6feb] focus:ring-2 focus:ring-[#1f6feb]/50 transition-all"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-8 py-4 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white rounded-xl hover:shadow-lg hover:shadow-[#1f6feb]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Profile Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1f6feb] to-[#58a6ff] flex items-center justify-center text-4xl font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{username || "johndoe"}</h2>
                    <p className="text-[#7d8590] mb-3">Full Stack Developer • Open Source Enthusiast</p>
                    <div className="flex flex-wrap gap-4 text-sm text-[#7d8590]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        San Francisco, CA
                      </div>
                      <div className="flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" />
                        portfolio.dev
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined 2020
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <StatBadge icon={Star} value="1.2K" label="Stars" />
                    <StatBadge icon={GitFork} value="342" label="Forks" />
                    <StatBadge icon={Eye} value="89" label="Watchers" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <MetricCard
              title="Total Repositories"
              value="47"
              trend="+12%"
              trendUp={true}
              icon={Code}
            />
            <MetricCard
              title="Total Commits"
              value="2,847"
              trend="+8%"
              trendUp={true}
              icon={TrendingUp}
            />
            <MetricCard
              title="Pull Requests"
              value="156"
              trend="+15%"
              trendUp={true}
              icon={GitFork}
            />
            <MetricCard
              title="Contribution Score"
              value="A+"
              trend="Top 5%"
              trendUp={true}
              icon={Award}
            />
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contribution Activity */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6">Contribution Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockContributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="month" stroke="#7d8590" />
                  <YAxis stroke="#7d8590" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#161b22",
                      border: "1px solid #30363d",
                      borderRadius: "8px",
                      color: "#e6edf3",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="commits" stroke="#58a6ff" strokeWidth={2} />
                  <Line type="monotone" dataKey="prs" stroke="#3fb950" strokeWidth={2} />
                  <Line type="monotone" dataKey="issues" stroke="#f778ba" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Language Distribution */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6">Language Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockLanguageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockLanguageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#161b22",
                      border: "1px solid #30363d",
                      borderRadius: "8px",
                      color: "#e6edf3",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Skills Radar */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6">Skills Assessment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={mockSkillsData}>
                  <PolarGrid stroke="#30363d" />
                  <PolarAngleAxis dataKey="skill" stroke="#7d8590" />
                  <PolarRadiusAxis stroke="#7d8590" />
                  <Radar name="Skills" dataKey="score" stroke="#58a6ff" fill="#58a6ff" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Activity Breakdown */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6">Monthly Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockContributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="month" stroke="#7d8590" />
                  <YAxis stroke="#7d8590" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#161b22",
                      border: "1px solid #30363d",
                      borderRadius: "8px",
                      color: "#e6edf3",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="commits" fill="#58a6ff" />
                  <Bar dataKey="prs" fill="#3fb950" />
                  <Bar dataKey="issues" fill="#f778ba" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Repositories */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-6">Top Repositories</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <RepoCard
                name="awesome-project"
                description="A comprehensive toolkit for modern web development"
                language="TypeScript"
                stars={842}
                forks={124}
              />
              <RepoCard
                name="api-gateway"
                description="Scalable microservices API gateway built with Node.js"
                language="JavaScript"
                stars={567}
                forks={89}
              />
              <RepoCard
                name="ml-pipeline"
                description="Production-ready machine learning pipeline framework"
                language="Python"
                stars={423}
                forks={67}
              />
              <RepoCard
                name="design-system"
                description="Component library and design tokens for React applications"
                language="TypeScript"
                stars={312}
                forks={45}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBadge({ icon: Icon, value, label }: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg">
      <Icon className="w-4 h-4 text-[#58a6ff]" />
      <div>
        <div className="text-sm font-semibold">{value}</div>
        <div className="text-xs text-[#7d8590]">{label}</div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, trendUp, icon: Icon }: {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#58a6ff]/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <Icon className="w-5 h-5 text-[#58a6ff]" />
        <span className={`text-xs px-2 py-1 rounded ${trendUp ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
          {trend}
        </span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-[#7d8590]">{title}</div>
    </div>
  );
}

function RepoCard({ name, description, language, stars, forks }: {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
}) {
  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 hover:border-[#58a6ff]/50 transition-all">
      <h4 className="text-lg font-semibold text-[#58a6ff] mb-2">{name}</h4>
      <p className="text-sm text-[#7d8590] mb-4">{description}</p>
      <div className="flex items-center gap-4 text-sm text-[#7d8590]">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#3178c6]" />
          {language}
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          {stars}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="w-4 h-4" />
          {forks}
        </span>
      </div>
    </div>
  );
}

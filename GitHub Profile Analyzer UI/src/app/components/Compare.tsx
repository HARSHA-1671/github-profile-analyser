import { useState } from "react";
import { Search, Star, GitFork, Code, TrendingUp, Plus, X } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const mockComparisonData = [
  { category: "Commits", user1: 85, user2: 72 },
  { category: "PRs", user1: 65, user2: 78 },
  { category: "Stars", user1: 90, user2: 85 },
  { category: "Followers", user1: 70, user2: 80 },
  { category: "Repos", user1: 75, user2: 68 },
  { category: "Activity", user1: 88, user2: 75 },
];

const mockLanguageComparison = [
  { language: "TypeScript", user1: 45, user2: 30 },
  { language: "JavaScript", user1: 30, user2: 40 },
  { language: "Python", user1: 15, user2: 20 },
  { language: "Go", user1: 10, user2: 10 },
];

export function Compare() {
  const [users, setUsers] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showComparison, setShowComparison] = useState(false);

  const addUser = () => {
    if (inputValue.trim() && users.length < 2) {
      setUsers([...users, inputValue.trim()]);
      setInputValue("");
      if (users.length === 1) {
        setTimeout(() => setShowComparison(true), 500);
      }
    }
  };

  const removeUser = (index: number) => {
    setUsers(users.filter((_, i) => i !== index));
    if (users.length <= 2) {
      setShowComparison(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#e6edf3] to-[#a371f7] bg-clip-text text-transparent">
          Compare GitHub Profiles
        </h1>
        <p className="text-[#7d8590] mb-6">
          Compare up to 2 developers side-by-side to see their strengths and contributions
        </p>

        {/* User Input */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#7d8590]" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addUser()}
                placeholder={`Enter ${users.length === 0 ? "first" : "second"} GitHub username...`}
                disabled={users.length >= 2}
                className="w-full pl-12 pr-4 py-4 bg-[#0d1117] border border-[#30363d] rounded-xl text-[#e6edf3] placeholder-[#7d8590] focus:outline-none focus:border-[#1f6feb] focus:ring-2 focus:ring-[#1f6feb]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <button
              onClick={addUser}
              disabled={users.length >= 2 || !inputValue.trim()}
              className="px-8 py-4 bg-gradient-to-r from-[#8957e5] to-[#a371f7] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add User
            </button>
          </div>

          {/* Selected Users */}
          {users.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg group"
                >
                  <div className={`w-8 h-8 rounded-full ${index === 0 ? "bg-gradient-to-br from-[#1f6feb] to-[#58a6ff]" : "bg-gradient-to-br from-[#8957e5] to-[#a371f7]"} flex items-center justify-center text-sm font-bold`}>
                    {user.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm">{user}</span>
                  <button
                    onClick={() => removeUser(index)}
                    className="ml-2 p-1 hover:bg-[#30363d] rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Results */}
      {showComparison && users.length === 2 && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Profile Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <ProfileCard username={users[0]} color="blue" />
            <ProfileCard username={users[1]} color="purple" />
          </div>

          {/* Stats Comparison */}
          <div className="grid md:grid-cols-4 gap-4">
            <ComparisonStat
              label="Total Repos"
              user1Value="47"
              user2Value="38"
              icon={Code}
            />
            <ComparisonStat
              label="Total Stars"
              user1Value="1.2K"
              user2Value="1.5K"
              icon={Star}
            />
            <ComparisonStat
              label="Total Forks"
              user1Value="342"
              user2Value="287"
              icon={GitFork}
            />
            <ComparisonStat
              label="Avg. Activity"
              user1Value="92%"
              user2Value="88%"
              icon={TrendingUp}
            />
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Skills Comparison Radar */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6">Skills Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={mockComparisonData}>
                  <PolarGrid stroke="#30363d" />
                  <PolarAngleAxis dataKey="category" stroke="#7d8590" />
                  <PolarRadiusAxis stroke="#7d8590" />
                  <Radar name={users[0]} dataKey="user1" stroke="#58a6ff" fill="#58a6ff" fillOpacity={0.6} />
                  <Radar name={users[1]} dataKey="user2" stroke="#a371f7" fill="#a371f7" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Language Distribution Comparison */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6">Language Usage</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockLanguageComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="language" stroke="#7d8590" />
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
                  <Bar dataKey="user1" fill="#58a6ff" name={users[0]} />
                  <Bar dataKey="user2" fill="#a371f7" name={users[1]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-6">Detailed Metrics</h3>
            <div className="space-y-4">
              <MetricBar label="Total Commits" user1={2847} user2={2156} max={3000} />
              <MetricBar label="Pull Requests" user1={156} user2={189} max={200} />
              <MetricBar label="Issues Created" user1={84} user2={67} max={100} />
              <MetricBar label="Code Reviews" user1={234} user2={198} max={250} />
              <MetricBar label="Contributions" user1={567} user2={623} max={700} />
            </div>
          </div>

          {/* Winner Summary */}
          <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-6 text-center">Overall Summary</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#0d1117] border border-[#58a6ff]/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1f6feb] to-[#58a6ff] flex items-center justify-center text-xl font-bold">
                    {users[0].charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold">{users[0]}</h4>
                    <p className="text-sm text-[#7d8590]">Strong in activity & commits</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7d8590]">Strengths:</span>
                    <span className="text-green-400">Consistency, Code Quality</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1117] border border-[#a371f7]/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8957e5] to-[#a371f7] flex items-center justify-center text-xl font-bold">
                    {users[1].charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold">{users[1]}</h4>
                    <p className="text-sm text-[#7d8590]">Strong in collaboration</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7d8590]">Strengths:</span>
                    <span className="text-green-400">PRs, Community Engagement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileCard({ username, color }: { username: string; color: "blue" | "purple" }) {
  const gradientClass = color === "blue" 
    ? "from-[#1f6feb] to-[#58a6ff]" 
    : "from-[#8957e5] to-[#a371f7]";

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-2xl font-bold`}>
          {username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-xl font-semibold">{username}</h3>
          <p className="text-sm text-[#7d8590]">Full Stack Developer</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#30363d]">
        <div>
          <div className="text-xl font-bold">{color === "blue" ? "47" : "38"}</div>
          <div className="text-xs text-[#7d8590]">Repos</div>
        </div>
        <div>
          <div className="text-xl font-bold">{color === "blue" ? "2.8K" : "2.1K"}</div>
          <div className="text-xs text-[#7d8590]">Commits</div>
        </div>
        <div>
          <div className="text-xl font-bold">{color === "blue" ? "1.2K" : "1.5K"}</div>
          <div className="text-xs text-[#7d8590]">Stars</div>
        </div>
      </div>
    </div>
  );
}

function ComparisonStat({ label, user1Value, user2Value, icon: Icon }: {
  label: string;
  user1Value: string;
  user2Value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-[#7d8590]" />
        <span className="text-sm text-[#7d8590]">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-[#58a6ff]">{user1Value}</div>
        <div className="text-xs text-[#7d8590]">vs</div>
        <div className="text-lg font-bold text-[#a371f7]">{user2Value}</div>
      </div>
    </div>
  );
}

function MetricBar({ label, user1, user2, max }: {
  label: string;
  user1: number;
  user2: number;
  max: number;
}) {
  const user1Percent = (user1 / max) * 100;
  const user2Percent = (user2 / max) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-[#7d8590]">{label}</span>
        <span className="text-[#e6edf3]">
          <span className="text-[#58a6ff]">{user1}</span>
          {" vs "}
          <span className="text-[#a371f7]">{user2}</span>
        </span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-8 bg-[#0d1117] rounded-lg overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] rounded-lg transition-all"
            style={{ width: `${user1Percent}%` }}
          />
        </div>
        <div className="flex-1 h-8 bg-[#0d1117] rounded-lg overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8957e5] to-[#a371f7] rounded-lg transition-all"
            style={{ width: `${user2Percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

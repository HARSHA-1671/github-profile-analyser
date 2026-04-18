import { TrendingUp, Award, Zap, Target, Brain, Sparkles, Code, Users, GitBranch, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockTrendData = [
  { week: "Week 1", activity: 45, growth: 20 },
  { week: "Week 2", activity: 62, growth: 35 },
  { week: "Week 3", activity: 54, growth: 28 },
  { week: "Week 4", activity: 78, growth: 45 },
  { week: "Week 5", activity: 91, growth: 62 },
  { week: "Week 6", activity: 85, growth: 58 },
];

export function Insights() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e6edf3] to-[#3fb950] bg-clip-text text-transparent">
            AI-Powered Insights
          </h1>
        </div>
        <p className="text-[#7d8590]">
          Discover actionable insights and recommendations based on GitHub activity patterns
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <InsightCard
          icon={TrendingUp}
          label="Growth Rate"
          value="+24%"
          sublabel="Last 30 days"
          color="green"
        />
        <InsightCard
          icon={Zap}
          label="Productivity"
          value="High"
          sublabel="Above average"
          color="blue"
        />
        <InsightCard
          icon={Award}
          label="Top Skill"
          value="TypeScript"
          sublabel="35% of code"
          color="purple"
        />
        <InsightCard
          icon={Target}
          label="Goal Progress"
          value="78%"
          sublabel="On track"
          color="yellow"
        />
      </div>

      {/* Growth Trend */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6">Activity & Growth Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockTrendData}>
            <defs>
              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#58a6ff" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3fb950" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3fb950" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            <XAxis dataKey="week" stroke="#7d8590" />
            <YAxis stroke="#7d8590" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "8px",
                color: "#e6edf3",
              }}
            />
            <Area type="monotone" dataKey="activity" stroke="#58a6ff" fillOpacity={1} fill="url(#colorActivity)" />
            <Area type="monotone" dataKey="growth" stroke="#3fb950" fillOpacity={1} fill="url(#colorGrowth)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Recommendations */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="w-6 h-6 text-[#58a6ff]" />
          Personalized Recommendations
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <RecommendationCard
            icon={Code}
            title="Diversify Your Stack"
            description="You're strong in TypeScript. Consider exploring Rust or Go to expand your backend skills."
            priority="medium"
            impact="high"
          />
          <RecommendationCard
            icon={Users}
            title="Increase Collaboration"
            description="Your PR review rate is below average. Aim for 5+ code reviews per week to boost team impact."
            priority="high"
            impact="high"
          />
          <RecommendationCard
            icon={GitBranch}
            title="Open Source Contribution"
            description="You haven't contributed to external projects recently. Find 2-3 repos to contribute to."
            priority="medium"
            impact="medium"
          />
          <RecommendationCard
            icon={Calendar}
            title="Consistency Matters"
            description="Your commit frequency dropped 30% this week. Try to maintain a steady contribution rhythm."
            priority="low"
            impact="medium"
          />
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Recent Achievements
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <AchievementBadge
            icon="🔥"
            title="30 Day Streak"
            description="Committed code for 30 consecutive days"
            unlocked={true}
          />
          <AchievementBadge
            icon="⭐"
            title="Rising Star"
            description="Received 1000+ stars on your repositories"
            unlocked={true}
          />
          <AchievementBadge
            icon="🤝"
            title="Team Player"
            description="Reviewed 100+ pull requests"
            unlocked={false}
            progress={78}
          />
        </div>
      </div>

      {/* Top Contributors in Your Network */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6">Top Contributors in Your Network</h3>
        <div className="space-y-4">
          <ContributorRow rank={1} username="sarah-dev" contributions={1247} trend="+12%" />
          <ContributorRow rank={2} username="john-codes" contributions={1089} trend="+8%" />
          <ContributorRow rank={3} username="alex-tech" contributions={987} trend="+15%" />
          <ContributorRow rank={4} username="you" contributions={847} trend="+6%" highlight={true} />
          <ContributorRow rank={5} username="mike-builds" contributions={734} trend="+3%" />
        </div>
      </div>

      {/* Skills to Learn */}
      <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6">Trending Skills to Learn</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkillCard name="Docker" trend="+45%" demand="High" />
          <SkillCard name="Kubernetes" trend="+38%" demand="High" />
          <SkillCard name="GraphQL" trend="+29%" demand="Medium" />
          <SkillCard name="Rust" trend="+52%" demand="Growing" />
        </div>
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, label, value, sublabel, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sublabel: string;
  color: "green" | "blue" | "purple" | "yellow";
}) {
  const colorMap = {
    green: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400",
    blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
    purple: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
    yellow: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400",
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#58a6ff]/50 transition-all">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorMap[color]} border flex items-center justify-center mb-4`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-[#e6edf3] mb-1">{label}</div>
      <div className="text-xs text-[#7d8590]">{sublabel}</div>
    </div>
  );
}

function RecommendationCard({ icon: Icon, title, description, priority, impact }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  impact: "high" | "medium" | "low";
}) {
  const priorityColors = {
    high: "bg-red-500/10 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    low: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 hover:border-[#58a6ff]/50 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#58a6ff]">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm text-[#7d8590]">{description}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <span className={`text-xs px-2 py-1 rounded border ${priorityColors[priority]}`}>
          {priority.toUpperCase()} Priority
        </span>
        <span className="text-xs px-2 py-1 rounded border border-[#30363d] text-[#7d8590]">
          {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
        </span>
      </div>
    </div>
  );
}

function AchievementBadge({ icon, title, description, unlocked, progress }: {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number;
}) {
  return (
    <div className={`bg-[#0d1117] border rounded-xl p-4 ${unlocked ? "border-yellow-500/50" : "border-[#30363d]"} ${!unlocked && "opacity-60"}`}>
      <div className="text-4xl mb-2">{icon}</div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-xs text-[#7d8590] mb-3">{description}</p>
      {!unlocked && progress !== undefined && (
        <div>
          <div className="flex justify-between text-xs text-[#7d8590] mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-[#161b22] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1f6feb] to-[#58a6ff]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {unlocked && (
        <span className="text-xs text-green-400">✓ Unlocked</span>
      )}
    </div>
  );
}

function ContributorRow({ rank, username, contributions, trend, highlight }: {
  rank: number;
  username: string;
  contributions: number;
  trend: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg ${highlight ? "bg-[#1f6feb]/10 border border-[#1f6feb]/30" : "bg-[#0d1117]"}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
        rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
        rank === 2 ? "bg-gray-500/20 text-gray-400" :
        rank === 3 ? "bg-orange-500/20 text-orange-400" :
        "bg-[#161b22] text-[#7d8590]"
      }`}>
        #{rank}
      </div>
      <div className="flex-1">
        <div className="font-semibold">{username}</div>
        <div className="text-sm text-[#7d8590]">{contributions.toLocaleString()} contributions</div>
      </div>
      <span className="text-sm text-green-400">{trend}</span>
    </div>
  );
}

function SkillCard({ name, trend, demand }: {
  name: string;
  trend: string;
  demand: string;
}) {
  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 hover:border-[#58a6ff]/50 transition-all">
      <h4 className="font-semibold mb-2">{name}</h4>
      <div className="flex justify-between text-sm">
        <span className="text-[#7d8590]">Trend:</span>
        <span className="text-green-400">{trend}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[#7d8590]">Demand:</span>
        <span className="text-[#58a6ff]">{demand}</span>
      </div>
    </div>
  );
}

import { Link } from "react-router";
import { BarChart3, GitCompare, Sparkles, TrendingUp, Users, Star, GitFork } from "lucide-react";

export function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1f6feb]/5 to-transparent rounded-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#58a6ff]" />
            <span className="text-sm text-[#7d8590]">AI-Powered GitHub Analytics</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#e6edf3] via-[#58a6ff] to-[#e6edf3] bg-clip-text text-transparent">
            Analyze GitHub Profiles
            <br />
            Like Never Before
          </h1>
          
          <p className="text-xl text-[#7d8590] max-w-2xl mx-auto mb-10">
            Deep dive into GitHub profiles with advanced analytics, compare developers,
            and discover insights that matter.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/analyze"
              className="px-8 py-4 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white rounded-lg hover:shadow-lg hover:shadow-[#1f6feb]/50 transition-all flex items-center gap-2 group"
            >
              <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Start Analyzing
            </Link>
            <Link
              to="/compare"
              className="px-8 py-4 bg-[#21262d] border border-[#30363d] text-[#e6edf3] rounded-lg hover:bg-[#30363d] hover:border-[#58a6ff]/50 transition-all flex items-center gap-2"
            >
              <GitCompare className="w-5 h-5" />
              Compare Profiles
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon={BarChart3}
          title="Deep Analytics"
          description="Comprehensive analysis of repositories, contributions, and coding patterns"
          gradient="from-blue-500/10 to-cyan-500/10"
          iconColor="text-blue-400"
        />
        <FeatureCard
          icon={GitCompare}
          title="Profile Comparison"
          description="Side-by-side comparison of multiple developers with detailed metrics"
          gradient="from-purple-500/10 to-pink-500/10"
          iconColor="text-purple-400"
        />
        <FeatureCard
          icon={Sparkles}
          title="AI Insights"
          description="Smart recommendations and insights powered by advanced algorithms"
          gradient="from-green-500/10 to-emerald-500/10"
          iconColor="text-green-400"
        />
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Platform Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard icon={Users} value="50K+" label="Profiles Analyzed" />
          <StatCard icon={TrendingUp} value="1M+" label="Data Points" />
          <StatCard icon={Star} value="99.9%" label="Accuracy" />
          <StatCard icon={GitFork} value="24/7" label="Uptime" />
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <StepCard
            number="01"
            title="Enter Username"
            description="Input any GitHub username to start the analysis"
          />
          <StepCard
            number="02"
            title="AI Processing"
            description="Our algorithms analyze repositories, contributions, and activity"
          />
          <StepCard
            number="03"
            title="Get Insights"
            description="Receive detailed reports with actionable insights"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, gradient, iconColor }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}) {
  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl`} />
      <div className="relative bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#58a6ff]/50 transition-all h-full">
        <div className={`w-12 h-12 rounded-lg bg-[#0d1117] border border-[#30363d] flex items-center justify-center mb-4 ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-[#7d8590]">{description}</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-3">
        <Icon className="w-8 h-8 text-[#58a6ff]" />
      </div>
      <div className="text-3xl font-bold text-[#e6edf3] mb-1">{value}</div>
      <div className="text-sm text-[#7d8590]">{label}</div>
    </div>
  );
}

function StepCard({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="text-6xl font-bold text-[#21262d] mb-4">{number}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-[#7d8590]">{description}</p>
    </div>
  );
}

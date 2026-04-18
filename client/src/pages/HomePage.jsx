import { BarChart3, GitCompare, GitFork, Sparkles, Star, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function HomePage() {
  return (
    <Layout>
      <div className="space-y-16">
        <section className="relative py-20 text-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#1f6feb]/5 to-transparent" />
          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-4 py-2">
              <Sparkles className="h-4 w-4 text-[#58a6ff]" />
              <span className="text-sm text-[#7d8590]">AI-style GitHub analytics, powered by public API data</span>
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-[#e6edf3] via-[#58a6ff] to-[#e6edf3] bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
              Analyze GitHub Profiles
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-xl text-[#7d8590]">
              Deep dive into public GitHub profiles, compare developers, and discover
              portfolio signals that matter for hiring readiness.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/analyze"
                className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] px-8 py-4 text-white transition-all hover:shadow-lg hover:shadow-[#1f6feb]/50"
              >
                <BarChart3 className="h-5 w-5 transition-transform group-hover:scale-110" />
                Start Analyzing
              </Link>
              <Link
                to="/compare"
                className="flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#21262d] px-8 py-4 text-[#e6edf3] transition-all hover:border-[#58a6ff]/50 hover:bg-[#30363d]"
              >
                <GitCompare className="h-5 w-5" />
                Compare Profiles
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <FeatureCard icon={BarChart3} title="Deep Analytics" description="Activity, quality, diversity, community, and readiness scoring." gradient="from-blue-500/10 to-cyan-500/10" iconColor="text-blue-400" />
          <FeatureCard icon={GitCompare} title="Profile Comparison" description="Side-by-side reports with stronger categories highlighted." gradient="from-purple-500/10 to-pink-500/10" iconColor="text-purple-400" />
          <FeatureCard icon={Sparkles} title="Smart Insights" description="Repository, language, and portfolio signals presented clearly." gradient="from-green-500/10 to-emerald-500/10" iconColor="text-green-400" />
        </section>

        <section className="rounded-2xl border border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#0d1117] p-8 md:p-12">
          <h2 className="mb-8 text-center text-3xl font-bold">Platform Statistics</h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <StatCard icon={Users} value="Public" label="GitHub Data" />
            <StatCard icon={TrendingUp} value="5" label="Score Signals" />
            <StatCard icon={Star} value="24h" label="In-Memory Cache" />
            <StatCard icon={GitFork} value="2-way" label="Compare Mode" />
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <StepCard number="01" title="Enter Username" description="Input any public GitHub username to start the analysis." />
            <StepCard number="02" title="Process Signals" description="The backend fetches repos, activity, languages, and profile metadata." />
            <StepCard number="03" title="Review Dashboard" description="Analyze charts, scorecards, and local export options." />
          </div>
        </section>
      </div>
    </Layout>
  );
}

function FeatureCard({ icon: Icon, title, description, gradient, iconColor }) {
  return (
    <div className="group relative">
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-0 blur-xl transition-opacity group-hover:opacity-100`} />
      <div className="relative h-full rounded-xl border border-[#30363d] bg-[#161b22] p-6 transition-all hover:border-[#58a6ff]/50">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-[#30363d] bg-[#0d1117] ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-[#7d8590]">{description}</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="text-center">
      <div className="mb-3 flex justify-center">
        <Icon className="h-8 w-8 text-[#58a6ff]" />
      </div>
      <div className="mb-1 text-3xl font-bold text-[#e6edf3]">{value}</div>
      <div className="text-sm text-[#7d8590]">{label}</div>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div>
      <div className="mb-4 text-6xl font-bold text-[#21262d]">{number}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-[#7d8590]">{description}</p>
    </div>
  );
}

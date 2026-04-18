import { Award, BarChart3, Calendar, Download, FileText, GitFork, Image as ImageIcon, MapPin, Search, Star, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import Layout from "../components/Layout";
import { fetchReport } from "../utils/api";
import { formatDate, formatNumber, titleCase } from "../utils/formatters";

const colors = ["#58a6ff", "#3fb950", "#a371f7", "#f778ba", "#f1e05a", "#7d8590"];
const lightTooltip = {
  backgroundColor: "#f6f8fa",
  border: "1px solid #d0d7de",
  borderRadius: 8,
  color: "#24292f"
};

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState(searchParams.get("q") || "");
  const [state, setState] = useState({ loading: false, error: "", report: null });
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      triggerAnalyze(q);
    }
  }, [searchParams]);

  async function triggerAnalyze(targetUser) {
    if (!targetUser.trim()) return;
    navigate(`/report/${targetUser.trim().toLowerCase()}`);
  }

  async function handleAnalyze(event) {
    if (event) event.preventDefault();
    triggerAnalyze(username);
  }

  const chartData = useMemo(() => {
    if (!state.report) return { radar: [], languages: [] };

    return {
      radar: Object.entries(state.report.scores.breakdown).map(([category, score]) => ({
        category: titleCase(category),
        score: Math.round(score)
      })),
      languages: Object.entries(state.report.languageDistribution).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }))
    };
  }, [state.report]);

  function handlePrintPdf() {
    window.print();
  }

  async function handleDownloadImage() {
    if (!reportRef.current || !state.report) return;

    setExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#0d1117",
        scale: 2,
        useCORS: true
      });
      const link = document.createElement("a");
      link.download = `${state.report.profile.username}-github-report.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setExporting(false);
    }
  }

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="rounded-2xl border border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#0d1117] p-8 no-print">
          <h1 className="mb-4 bg-gradient-to-r from-[#e6edf3] to-[#58a6ff] bg-clip-text text-3xl font-bold text-transparent">
            Analyze GitHub Profile
          </h1>
          <p className="mb-6 text-[#7d8590]">
            Enter a public GitHub username to generate a comprehensive developer scorecard and visual report.
          </p>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleAnalyze}>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7d8590]" />
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter GitHub username..."
                className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] py-4 pl-12 pr-4 text-[#e6edf3] placeholder-[#7d8590] transition-all focus:border-[#1f6feb] focus:outline-none focus:ring-2 focus:ring-[#1f6feb]/50"
              />
            </div>
            <button
              type="submit"
              disabled={state.loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] px-8 py-4 text-white transition-all hover:shadow-lg hover:shadow-[#1f6feb]/50 disabled:opacity-50"
            >
              {state.loading ? "Analyzing..." : <><Search className="h-5 w-5" /> Analyze</>}
            </button>
          </form>
        </section>

        {state.error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/5 p-10 text-center">
            <p className="text-red-300">{state.error}</p>
          </div>
        )}

        {state.loading && (
          <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-20 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#30363d] border-t-[#58a6ff]" />
            <p className="text-[#7d8590]">Fetching profile data and computing signals...</p>
          </div>
        )}

        {state.report && (
          <div ref={reportRef} className="space-y-6">
            <section className="no-print flex flex-col gap-3 rounded-2xl border border-[#30363d] bg-[#161b22] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-[#e6edf3]">Export Options</h2>
                <p className="text-sm text-[#7d8590]">Download this report for your personal use.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={handlePrintPdf} className="flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#e6edf3] transition-colors hover:border-[#58a6ff]/50">
                  <FileText className="h-4 w-4" />
                  Print PDF
                </button>
                <button onClick={handleDownloadImage} disabled={exporting} className="flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#e6edf3] transition-colors hover:border-[#58a6ff]/50 disabled:opacity-60">
                  <ImageIcon className="h-4 w-4" />
                  {exporting ? "Exporting..." : "Download Image"}
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-[#30363d] bg-[#161b22] p-8">
              <div className="flex flex-col gap-6 md:flex-row">
                <img src={state.report.profile.avatarUrl} alt={state.report.profile.username} className="h-24 w-24 rounded-full border border-[#30363d]" />
                <div className="flex-1">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="mb-1 text-3xl font-bold text-[#e6edf3]">{state.report.profile.name || state.report.profile.username}</h2>
                      <p className="mb-3 text-[#7d8590]">@{state.report.profile.username} - {state.report.profile.bio || "No bio available."}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-[#7d8590]">
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Joined {formatDate(state.report.profile.joinedAt)}</span>
                        <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {formatNumber(state.report.profile.followers)} followers</span>
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {state.report.profile.location || "Earth"}</span>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-[#1f6feb]/40 bg-[#0d1117] p-5 text-center">
                      <div className="text-5xl font-bold text-[#58a6ff]">{Math.round(state.report.scores.overall)}</div>
                      <div className="text-xs uppercase tracking-wider text-[#7d8590]">overall score</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-4 md:grid-cols-5">
              {Object.entries(state.report.scores.breakdown).map(([key, value]) => (
                <article key={key} className="rounded-xl border border-[#30363d] bg-[#161b22] p-5 transition-all hover:border-[#58a6ff]/50">
                  <Award className="mb-3 h-5 w-5 text-[#58a6ff]" />
                  <div className="mb-1 text-2xl font-bold text-[#e6edf3]">{Math.round(value)}</div>
                  <div className="text-sm text-[#7d8590]">{titleCase(key)}</div>
                </article>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
                <h3 className="mb-6 text-xl font-semibold text-[#e6edf3]">Category Radar</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={chartData.radar}>
                    <PolarGrid stroke="#30363d" />
                    <PolarAngleAxis dataKey="category" stroke="#7d8590" />
                    <PolarRadiusAxis stroke="#7d8590" />
                    <Radar dataKey="score" stroke="#58a6ff" fill="#58a6ff" fillOpacity={0.5} />
                    <Tooltip contentStyle={lightTooltip} itemStyle={{ color: "#24292f" }} labelStyle={{ color: "#24292f" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
                <h3 className="mb-6 text-xl font-semibold text-[#e6edf3]">Language Distribution</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={chartData.languages} cx="50%" cy="50%" outerRadius={92} dataKey="value" label={({ name }) => name}>
                      {chartData.languages.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={lightTooltip} itemStyle={{ color: "#24292f" }} labelStyle={{ color: "#24292f" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
              <h3 className="mb-6 text-xl font-semibold text-[#e6edf3]">Recent Public Activity Scan</h3>
              <div className="grid grid-cols-[repeat(28,minmax(0,1fr))] gap-1.5 overflow-hidden">
                {state.report.heatmap.map((cell) => (
                  <span
                    key={cell.date}
                    title={`${cell.date}: ${cell.count} events`}
                    className={`aspect-square rounded-sm ${
                      cell.level === 0
                        ? "bg-[#21262d]"
                        : cell.level === 1
                          ? "bg-green-900/50"
                          : cell.level === 2
                            ? "bg-green-700/70"
                            : cell.level === 3
                              ? "bg-green-500/80"
                              : "bg-[#3fb950]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
              <h3 className="mb-6 text-xl font-semibold text-[#e6edf3]">Top Repositories</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {state.report.topRepositories.map((repo) => (
                  <article key={repo.name} className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4 transition-all hover:border-[#58a6ff]/50">
                    <a className="mb-2 block text-lg font-semibold text-[#58a6ff] hover:underline" href={repo.url} target="_blank" rel="noreferrer">{repo.name}</a>
                    <p className="mb-4 text-sm text-[#7d8590] line-clamp-2">{repo.description || "No description provided."}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#7d8590]">
                      <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#3178c6]" />{repo.language || "Unknown"}</span>
                      <span className="flex items-center gap-1"><Star className="h-4 w-4" />{formatNumber(repo.stars)}</span>
                      <span className="flex items-center gap-1"><GitFork className="h-4 w-4" />{formatNumber(repo.forks)}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {!state.report && !state.loading && (
          <section className="grid gap-4 md:grid-cols-3 no-print">
            <InfoCard title="Real-time Analytics" text="Octokit-driven data fetching ensures up-to-date profile metrics." />
            <InfoCard title="Weighted Scoring" text="Activity, quality, diversity, community, and hiring readiness algorithms." />
            <InfoCard title="In-Memory Cache" text="Optimized performance with a transient 24-hour cache window." />
          </section>
        )}
      </div>
    </Layout>
  );
}

function InfoCard({ title, text }) {
  return (
    <article className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
      <h3 className="mb-2 text-lg font-semibold text-[#e6edf3]">{title}</h3>
      <p className="text-sm text-[#7d8590]">{text}</p>
    </article>
  );
}

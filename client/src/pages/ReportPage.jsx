import { Award, Calendar, Download, FileText, GitFork, Image as ImageIcon, Link as LinkIcon, MapPin, Share2, Star, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
  Tooltip,
  XAxis,
  YAxis
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

export default function ReportPage() {
  const { username } = useParams();
  const reportRef = useRef(null);
  const [state, setState] = useState({ loading: true, error: "", report: null });
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    document.title = `${username} Report | GitHub Profile Analyzer`;
    setState({ loading: true, error: "", report: null });

    fetchReport(username)
      .then((report) => setState({ loading: false, error: "", report }))
      .catch((error) => {
        setState({
          loading: false,
          error: error.response?.data?.message || "Something went wrong while fetching the report.",
          report: null
        });
      });
  }, [username]);

  const chartData = useMemo(() => {
    if (!state.report) {
      return { radar: [], languages: [] };
    }

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

  async function handleCopyLink() {
    await navigator.clipboard.writeText(window.location.href);
    alert("Report link copied to clipboard!");
  }

  async function handleDownloadImage() {
    if (!reportRef.current || !state.report) {
      return;
    }

    setExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#0d1117",
        scale: 2,
        useCORS: true
      });
      const link = document.createElement("a");
      link.download = `${state.report.username}-github-report.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setExporting(false);
    }
  }

  return (
    <Layout>
      {state.loading ? <StateCard label="Loading persistent report from database..." /> : null}
      {state.error ? <StateCard error label={state.error} /> : null}
      {state.report ? (
        <div ref={reportRef} className="space-y-6 animate-in fade-in duration-500">
          <section className="no-print flex flex-col gap-3 rounded-2xl border border-[#30363d] bg-[#161b22] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-[#e6edf3]">Export and Share</h2>
              <p className="text-sm text-[#7d8590]">This report is saved in our database. Share the URL with anyone.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={handlePrintPdf} className="flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#e6edf3] transition-colors hover:border-[#58a6ff]/50">
                <FileText className="h-4 w-4" />
                PDF
              </button>
              <button onClick={handleDownloadImage} disabled={exporting} className="flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#e6edf3] transition-colors hover:border-[#58a6ff]/50 disabled:opacity-60">
                <ImageIcon className="h-4 w-4" />
                {exporting ? "Exporting..." : "Image"}
              </button>
              <button onClick={handleCopyLink} className="flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#e6edf3] transition-colors hover:border-[#58a6ff]/50">
                <Share2 className="h-4 w-4" />
                Copy Link
              </button>
            </div>
          </section>

          <ProfileCard report={state.report} />

          <div className="grid gap-4 md:grid-cols-5">
            {Object.entries(state.report.scores.breakdown).map(([key, value]) => (
              <MetricCard key={key} title={titleCase(key)} value={Math.round(value)} />
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard title="Category Radar">
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={chartData.radar}>
                  <PolarGrid stroke="#30363d" />
                  <PolarAngleAxis dataKey="category" stroke="#7d8590" />
                  <PolarRadiusAxis stroke="#7d8590" />
                  <Radar dataKey="score" stroke="#58a6ff" fill="#58a6ff" fillOpacity={0.5} />
                  <Tooltip contentStyle={lightTooltip} itemStyle={{ color: "#24292f" }} labelStyle={{ color: "#24292f" }} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Language Distribution">
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
            </ChartCard>
          </div>

          <ChartCard title="Recent Public Activity Scan">
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
          </ChartCard>

          <ChartCard title="Top Repositories">
            <div className="grid gap-4 md:grid-cols-2">
              {state.report.topRepositories.map((repo) => (
                <RepoCard key={repo.name} repo={repo} />
              ))}
            </div>
          </ChartCard>
        </div>
      ) : null}
    </Layout>
  );
}

function ProfileCard({ report }) {
  const profile = report.profile;

  return (
    <section className="rounded-2xl border border-[#30363d] bg-[#161b22] p-8">
      <div className="flex flex-col gap-6 md:flex-row">
        <img src={profile.avatarUrl} alt={report.username} className="h-24 w-24 rounded-full border border-[#30363d]" />
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="mb-1 text-3xl font-bold text-[#e6edf3]">{profile.name || report.username}</h1>
              <p className="mb-3 text-[#7d8590]">@{report.username} - {profile.bio || "No bio available."}</p>
              <div className="flex flex-wrap gap-4 text-sm text-[#7d8590]">
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Joined {formatDate(profile.joinedAt)}</span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {formatNumber(profile.followers)} followers</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {profile.location || "Location not listed"}</span>
                <a className="flex items-center gap-1 text-[#58a6ff] hover:underline" href={profile.htmlUrl} target="_blank" rel="noreferrer"><LinkIcon className="h-4 w-4" /> GitHub</a>
              </div>
            </div>
            <div className="rounded-2xl border border-[#1f6feb]/40 bg-[#0d1117] p-5 text-center">
              <div className="text-5xl font-bold text-[#58a6ff]">{Math.round(report.scores.overall)}</div>
              <div className="text-xs uppercase tracking-wider text-[#7d8590]">overall score</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ title, value }) {
  return (
    <article className="rounded-xl border border-[#30363d] bg-[#161b22] p-5 transition-all hover:border-[#58a6ff]/50">
      <Award className="mb-3 h-5 w-5 text-[#58a6ff]" />
      <div className="mb-1 text-2xl font-bold text-[#e6edf3]">{value}</div>
      <div className="text-sm text-[#7d8590]">{title}</div>
    </article>
  );
}

function ChartCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
      <h2 className="mb-6 text-xl font-semibold text-[#e6edf3]">{title}</h2>
      {children}
    </section>
  );
}

function RepoCard({ repo }) {
  return (
    <article className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4 transition-all hover:border-[#58a6ff]/50">
      <a className="mb-2 block text-lg font-semibold text-[#58a6ff] hover:underline" href={repo.url} target="_blank" rel="noreferrer">{repo.name}</a>
      <p className="mb-4 text-sm text-[#7d8590] line-clamp-2">{repo.description || "No description provided."}</p>
      <div className="flex flex-wrap items-center gap-4 text-sm text-[#7d8590]">
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#3178c6]" />{repo.language || "Unknown"}</span>
        <span className="flex items-center gap-1"><Star className="h-4 w-4" />{formatNumber(repo.stars)}</span>
        <span className="flex items-center gap-1"><GitFork className="h-4 w-4" />{formatNumber(repo.forks)}</span>
      </div>
    </article>
  );
}

function StateCard({ label, error = false }) {
  return (
    <div className={`rounded-2xl border p-10 text-center ${error ? "border-red-500/40 bg-red-500/5" : "border-[#30363d] bg-[#161b22]"}`}>
      <p className={error ? "text-red-300" : "text-[#7d8590]"}>{label}</p>
    </div>
  );
}

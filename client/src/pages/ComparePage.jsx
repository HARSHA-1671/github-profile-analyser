import { Code, GitFork, Search, Star, TrendingUp, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
import { compareProfiles } from "../utils/api";
import { formatNumber, titleCase } from "../utils/formatters";

const seriesColors = ["#58a6ff", "#a371f7", "#3fb950", "#f778ba"];
const lightTooltip = {
  backgroundColor: "#f6f8fa",
  border: "1px solid #d0d7de",
  borderRadius: 8,
  color: "#24292f"
};

export default function ComparePage() {
  const [userSlots, setUserSlots] = useState(["", "", "", ""]);
  const [state, setState] = useState({ loading: false, error: "", comparison: null });

  const users = useMemo(
    () =>
      Array.from(
        new Set(userSlots.map((user) => user.trim()).filter(Boolean).map((user) => user.toLowerCase()))
      ).map((lowerUser) => userSlots.find((user) => user.trim().toLowerCase() === lowerUser).trim()),
    [userSlots]
  );

  function updateSlot(index, value) {
    const nextSlots = [...userSlots];
    nextSlots[index] = value;
    setUserSlots(nextSlots);
    setState({ loading: false, error: "", comparison: null });
  }

  function clearSlot(index) {
    updateSlot(index, "");
  }

  function clearUsers() {
    setUserSlots(["", "", "", ""]);
    setState({ loading: false, error: "", comparison: null });
  }

  function runCompare() {
    if (users.length < 2) {
      setState({
        loading: false,
        error: "Enter at least 2 usernames. You can compare up to 4 together.",
        comparison: null
      });
      return;
    }

    setState({ loading: true, error: "", comparison: null });
    compareProfiles(...users)
      .then((comparison) => setState({ loading: false, error: "", comparison }))
      .catch((error) => {
        setState({
          loading: false,
          error: error.response?.data?.message || "Comparison failed.",
          comparison: null
        });
      });
  }

  const radarData = state.comparison
    ? Object.keys(state.comparison.reports[0].scores.breakdown).map((category) => ({
        category: titleCase(category),
        ...Object.fromEntries(
          state.comparison.reports.map((report, index) => [
            `user${index + 1}`,
            Math.round(report.scores.breakdown[category])
          ])
        )
      }))
    : [];

  const languageData = state.comparison
    ? Array.from(
        new Set([
          ...state.comparison.reports.flatMap((report) => Object.keys(report.languageDistribution))
        ])
      )
        .slice(0, 6)
        .map((language) => ({
          language,
          ...Object.fromEntries(
            state.comparison.reports.map((report, index) => [
              `user${index + 1}`,
              report.languageDistribution[language] || 0
            ])
          )
        }))
    : [];

  const summaryRows = state.comparison
    ? [
        {
          label: "Public Repos",
          icon: Code,
          values: state.comparison.reports.map((report) => report.profile.publicRepos)
        },
        {
          label: "Followers",
          icon: TrendingUp,
          values: state.comparison.reports.map((report) => report.profile.followers)
        },
        {
          label: "Top Stars",
          icon: Star,
          values: state.comparison.reports.map((report) =>
            report.topRepositories.reduce((sum, repo) => sum + repo.stars, 0)
          )
        },
        {
          label: "Top Forks",
          icon: GitFork,
          values: state.comparison.reports.map((report) =>
            report.topRepositories.reduce((sum, repo) => sum + repo.forks, 0)
          )
        }
      ]
    : [];

  return (
    <Layout>
      <div className="space-y-8">
        <section className="rounded-2xl border border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#0d1117] p-8">
          <h1 className="mb-4 bg-gradient-to-r from-[#e6edf3] to-[#a371f7] bg-clip-text text-3xl font-bold text-transparent">
            Compare GitHub Profiles
          </h1>
          <p className="mb-6 text-[#7d8590]">
            Compare 2 to 4 developers side-by-side using live analyzer reports.
          </p>

          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {userSlots.map((value, index) => (
                <div key={index} className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7d8590]" />
                  <input
                    type="text"
                    value={value}
                    onChange={(event) => updateSlot(index, event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && runCompare()}
                    placeholder={`GitHub username ${index + 1}${index > 1 ? " (optional)" : ""}`}
                    className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] py-4 pl-12 pr-12 text-[#e6edf3] placeholder-[#7d8590] transition-all focus:border-[#1f6feb] focus:outline-none focus:ring-2 focus:ring-[#1f6feb]/50"
                  />
                  {value ? (
                    <button
                      type="button"
                      onClick={() => clearSlot(index)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded p-1 text-[#7d8590] transition-colors hover:bg-[#30363d] hover:text-[#e6edf3]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-[#7d8590]">
                {users.length >= 2
                  ? `${users.length} profiles selected for one comparison`
                  : "Enter at least 2 usernames. Slots 3 and 4 are optional."}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={clearUsers}
                  className="rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#f778ba] transition-colors hover:border-[#f778ba]/50"
                >
                  Clear all
                </button>
                <button
                  onClick={runCompare}
                  disabled={users.length < 2 || state.loading}
                  className="rounded-lg bg-gradient-to-r from-[#8957e5] to-[#a371f7] px-5 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {state.loading ? "Comparing..." : `Compare ${Math.max(users.length, 0)} profiles`}
                </button>
              </div>
            </div>
          </div>
        </section>

        {state.loading ? <State label="Comparing profiles..." /> : null}
        {state.error ? <State error label={state.error} /> : null}

        {state.comparison ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid gap-6 md:grid-cols-2">
              {state.comparison.reports.map((report, index) => (
                <ProfileCard key={report.profile.username} report={report} color={seriesColors[index]} />
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {summaryRows.map((row) => (
                <ComparisonStat key={row.label} row={row} />
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <ChartCard title="Skills Comparison">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#30363d" />
                    <PolarAngleAxis dataKey="category" stroke="#7d8590" />
                    <PolarRadiusAxis stroke="#7d8590" />
                    <Tooltip contentStyle={lightTooltip} itemStyle={{ color: "#24292f" }} labelStyle={{ color: "#24292f" }} />
                    {state.comparison.reports.map((report, index) => (
                      <Radar
                        key={report.profile.username}
                        name={report.profile.username}
                        dataKey={`user${index + 1}`}
                        stroke={seriesColors[index]}
                        fill={seriesColors[index]}
                        fillOpacity={0.25}
                      />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Language Usage">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={languageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis dataKey="language" stroke="#7d8590" />
                    <YAxis stroke="#7d8590" />
                    <Tooltip contentStyle={lightTooltip} itemStyle={{ color: "#24292f" }} labelStyle={{ color: "#24292f" }} />
                    <Legend />
                    {state.comparison.reports.map((report, index) => (
                      <Bar
                        key={report.profile.username}
                        dataKey={`user${index + 1}`}
                        fill={seriesColors[index]}
                        name={report.profile.username}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

function ProfileCard({ report, color }) {
  return (
    <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
      <div className="mb-4 flex items-center gap-4">
        <img
          src={report.profile.avatarUrl}
          alt={report.profile.username}
          className="h-16 w-16 rounded-full border-2"
          style={{ borderColor: color }}
        />
        <div>
          <h3 className="text-xl font-semibold">{report.profile.name || report.profile.username}</h3>
          <p className="text-sm text-[#7d8590]">@{report.profile.username}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 border-t border-[#30363d] pt-4">
        <div><div className="text-xl font-bold">{report.profile.publicRepos}</div><div className="text-xs text-[#7d8590]">Repos</div></div>
        <div><div className="text-xl font-bold">{formatNumber(report.profile.followers)}</div><div className="text-xs text-[#7d8590]">Followers</div></div>
        <div><div className="text-xl font-bold">{Math.round(report.scores.overall)}</div><div className="text-xs text-[#7d8590]">Score</div></div>
      </div>
    </div>
  );
}

function ComparisonStat({ row }) {
  const Icon = row.icon;

  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#7d8590]" />
        <span className="text-sm text-[#7d8590]">{row.label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {row.values.map((value, index) => (
          <div key={`${row.label}-${index}`} className="text-lg font-bold" style={{ color: seriesColors[index] }}>
            {formatNumber(value)}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
      <h3 className="mb-6 text-xl font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function State({ label, error = false }) {
  return (
    <div className={`rounded-2xl border p-10 text-center ${error ? "border-red-500/40 bg-red-500/5 text-red-300" : "border-[#30363d] bg-[#161b22] text-[#7d8590]"}`}>
      {label}
    </div>
  );
}

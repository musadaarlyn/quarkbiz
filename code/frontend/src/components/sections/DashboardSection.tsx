import { useEffect, useMemo, useState } from "react";
import { fetchDashboardStats } from "../../services/DashboardService";
import type { DashboardStats } from "../../services/DashboardService";
import { Activity, Layers, Sparkles } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SectionWrapper } from "../layout/SectionWrapper";

type LoadState = "idle" | "loading" | "error" | "ready";

const statusPalette: Record<string, string> = {
  PLANNING: "#38bdf8",
  IN_PROGRESS: "#a855f7",
  COMPLETED: "#34d399",
  ON_HOLD: "#f97316",
  UNKNOWN: "#94a3b8",
};

const formatStatus = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

const DashboardSection = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [state, setState] = useState<LoadState>("idle");

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        setState("loading");
        const payload = await fetchDashboardStats();
        if (!alive) return;
        setStats(payload);
        setState("ready");
      } catch (err) {
        console.error(err);
        if (!alive) return;
        setState("error");
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  const summary = useMemo(() => {
    if (!stats) {
      return { totalProjects: 0, activeCategories: 0, uniqueStacks: 0, avgStacksPerProj: 0 };
    }

    const activeCategories = stats.techStacksPerCategory.filter((c) => c.techStackCount > 0).length;
    const uniqueStacks = stats.techStackUsage.length;
    const totalUsage = stats.techStackUsage.reduce((acc, item) => acc + item.projectCount, 0);
    const avgStacksPerProj = stats.totalProjects
      ? (totalUsage / stats.totalProjects).toFixed(1)
      : "0";

    return {
      totalProjects: stats.totalProjects,
      activeCategories,
      uniqueStacks,
      avgStacksPerProj,
    };
  }, [stats]);

  const statusData = useMemo(
    () =>
      stats?.projectStatuses.map((entry) => ({
        name: formatStatus(entry.status),
        count: entry.count,
        fill: statusPalette[entry.status.toUpperCase()] ?? statusPalette.UNKNOWN,
      })) ?? [],
    [stats]
  );

  const categoryData = useMemo(
    () =>
      stats?.techStacksPerCategory
        .slice()
        .sort((a, b) => b.techStackCount - a.techStackCount)
        .map((entry) => ({
          name: entry.categoryName,
          value: entry.techStackCount,
        })) ?? [],
    [stats]
  );

  const stackUsageData = useMemo(() => {
    if (!stats) return [];
    return stats.techStackUsage
      .filter((entry) => entry.projectCount > 0)
      .sort((a, b) => b.projectCount - a.projectCount)
      .slice(0, 6)
      .map((entry) => ({
        name: entry.techStackName,
        count: entry.projectCount,
      }));
  }, [stats]);

  const summaryCards = [
    {
      label: "Total Projects",
      value: summary.totalProjects,
      hint:
        statusData.find((s) => s.name === "In Progress")?.count && summary.totalProjects
          ? `${Math.round(
              ((statusData.find((s) => s.name === "In Progress")?.count ?? 0) /
                summary.totalProjects) *
                100
            )}% currently active`
          : "Tracking all initiatives",
      icon: Activity,
      gradient: "from-slate-900 via-slate-800 to-slate-900",
    },
    {
      label: "Active Categories",
      value: summary.activeCategories,
      hint: `${summary.uniqueStacks} stacks catalogued`,
      icon: Layers,
      gradient: "from-indigo-600 via-purple-600 to-fuchsia-600",
    },
    {
      label: "Avg Stacks / Project",
      value: summary.avgStacksPerProj,
      hint: "Integration depth snapshot",
      icon: Sparkles,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    },
  ];

  const renderContent = () => {
    if (state === "error") {
      return (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-rose-600">
          Unable to load dashboard metrics. Please refresh.
        </div>
      );
    }

    if (state === "loading" || state === "idle") {
      return (
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 p-6 animate-pulse" />
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-8">
        <div className="grid gap-6 md:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.gradient} p-6 text-white shadow-xl`}
            >
              <card.icon className="absolute right-6 top-6 h-12 w-12 text-white/20" />
              <p className="text-sm uppercase tracking-wide text-white/70">{card.label}</p>
              <p className="mt-3 text-4xl font-semibold">{card.value}</p>
              <p className="mt-2 text-sm text-white/80">{card.hint}</p>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-lg shadow-slate-80">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-500">Project cadence</p>
                <h3 className="text-xl font-semibold text-slate-900">Status distribution</h3>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#475569" }} />
                <YAxis allowDecimals={false} stroke="#94a3b8" tick={{ fill: "#475569" }} />
                <Tooltip cursor={{ fill: "rgba(15,23,42,0.05)" }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-lg shadow-slate-80">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-500">Stack depth</p>
                <h3 className="text-xl font-semibold text-slate-900">Stacks per category</h3>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={categoryData}>
                <defs>
                  <linearGradient id="categoryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#475569" }} />
                <YAxis allowDecimals={false} stroke="#94a3b8" tick={{ fill: "#475569" }} />
                <Tooltip cursor={{ stroke: "#6366f1" }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#categoryGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-lg shadow-slate-80h">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-500">Adoption spotlight</p>
              <h3 className="text-xl font-semibold text-slate-900">Top tech stacks</h3>
              <p className="text-sm text-slate-500">Most frequently referenced stacks across projects</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stackUsageData} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" allowDecimals={false} stroke="#94a3b8" tick={{ fill: "#475569" }} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fill: "#475569" }} width={120} />
              <Tooltip cursor={{ fill: "rgba(56,189,248,0.1)" }} />
              <Bar dataKey="count" radius={[0, 12, 12, 0]} fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <SectionWrapper id="dashboard" title="Insight Center" className="bg-[#606061] text-white">
      {renderContent()}
    </SectionWrapper>
  );
};

export default DashboardSection;
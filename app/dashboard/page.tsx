"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatSparkline } from "@/components/stat-sparkline";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import {
  Users2,
  Clock,
  Flame,
  PhoneCall,
  Award,
  TrendingUp,
  ChevronRight,
  BarChart3,
  PieChart as PieIcon,
  Inbox,
  Activity,
  ArrowUpRight,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { timeAgo } from "@/lib/utils";

const ROYAL_DONUT_COLORS = [
  "#D62828", // Royal Crimson
  "#FFC21A", // Radiant Gold
  "#8F1218", // Deep Crimson
  "#E5A100", // Deep Gold
  "#E63946", // Bright Crimson
  "#64748B", // Slate
];

export default function DashboardPage() {
  const [range, setRange] = useState<"today" | "7d" | "30d" | "all">("30d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("Counselor");

  // Load user name
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.name) {
            setUserName(json.data.name.split(" ")[0]);
          }
        }
      } catch {
        // Fallback to Counselor
      }
    }
    loadUser();
  }, []);

  // Load dashboard stats
  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const res = await fetch(`/api/dashboard?range=${range}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setData(json.data);
          }
        }
      } catch (e) {
        console.error("Dashboard stats fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [range]);

  const kpis = data?.kpis;

  // Formatted greeting and current date
  const now = new Date();
  const hours = now.getHours();
  const greeting = hours < 12 ? "Good morning" : hours < 17 ? "Good afternoon" : "Good evening";
  const dateFormatted = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-16">
        {/* Editorial Greeting & Range Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#D62828] dark:text-[#FF5A5F]" />
              <span>{dateFormatted}</span>
              <span className="text-[#FFC21A] font-bold">✦</span>
              <span className="text-[#D62828] dark:text-[#FF5A5F] font-bold">Academic Cycle 2026/27</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl text-foreground font-extrabold tracking-tight title-gold-accent pb-2">
              {greeting}, <span className="text-[#D62828] dark:text-[#FF5A5F]">{userName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed pt-1">
              Real-time admissions intelligence: inquiry volume, counselor responsiveness, and confirmed enrollments.
            </p>
          </div>

          {/* Date range filter - styled as clean Royal tabs */}
          <div className="inline-flex items-center p-1 rounded-[10px] bg-card border border-border shadow-xs self-start md:self-auto">
            {(["today", "7d", "30d", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-[8px] text-xs font-bold capitalize transition-all cursor-pointer ${
                  range === r
                    ? "bg-[#D62828] text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : r === "all" ? "All Time" : "Today"}
              </button>
            ))}
          </div>
        </div>

        {/* Onboarding Setup Wizard */}
        {data?.onboarding && <OnboardingWizard onboarding={data.onboarding} />}

        {/* Hero Card + Three KPI Cards */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Hero Card: Confirmed Admissions (Crimson-Gold Gradient with Gold Trendline) */}
            <div className="lg:col-span-4 p-6 sm:p-7 rounded-[14px] bg-gradient-to-br from-[#E63946] via-[#D62828] to-[#8F1218] text-white border border-[#FFC21A]/35 shadow-crimson-glow flex flex-col justify-between relative overflow-hidden group">
              {/* Subtle ambient gold radial glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#FFC21A]/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/20 text-[#FFE08A] border border-[#FFC21A]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFC21A] animate-pulse" />
                    Admissions Milestone
                  </span>
                  <h3 className="font-heading text-xl font-extrabold text-white mt-1.5 tracking-tight">
                    Confirmed Admissions
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-[12px] bg-white/15 backdrop-blur-md text-[#FFC21A] flex items-center justify-center border border-white/20 shadow-xs">
                  <Award className="w-5 h-5 stroke-[2]" />
                </div>
              </div>

              <div className="my-6 relative z-10">
                <div className="flex items-baseline gap-3">
                  <p className="font-heading text-5xl sm:text-6xl font-extrabold tracking-tight text-white tabular-nums">
                    {loading ? "..." : kpis?.admissionsConfirmed?.value ?? 0}
                  </p>
                  <span className="inline-flex items-center text-xs font-bold text-[#17141A] bg-[#FFC21A] px-2.5 py-1 rounded-full shadow-xs">
                    {kpis?.admissionsConfirmed?.trend || "+12% vs last cycle"}
                  </span>
                </div>
                <p className="text-xs text-white/80 mt-2.5 leading-relaxed font-sans max-w-sm">
                  Scholars enrolled with verified fee deposit in active admissions cycle 2026/27.
                </p>
              </div>

              <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs relative z-10">
                <span className="text-white/80 font-medium">Trajectory &amp; Velocity</span>
                <div className="w-32">
                  <StatSparkline
                    data={kpis?.admissionsConfirmed?.sparkline || [0, 0, 0, 0, 0, 0, 0]}
                    color="#FFC21A"
                  />
                </div>
              </div>
            </div>

            {/* Three White KPI Cards with Sparklines */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* KPI 1: Total Inquiries */}
              <div className="p-6 rounded-[14px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] royal-card shadow-card flex flex-col justify-between hover:border-[#D62828]/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-heading">
                    Total Inquiries
                  </span>
                  <div className="w-8 h-8 rounded-[10px] bg-[#D62828]/10 text-[#D62828] dark:text-[#FF5A5F] flex items-center justify-center border border-[#D62828]/20">
                    <Users2 className="w-4 h-4 stroke-[1.75]" />
                  </div>
                </div>

                <div className="my-4">
                  <p className="font-heading text-3xl font-extrabold text-foreground tabular-nums">
                    {loading ? "..." : kpis?.totalLeads?.value ?? 0}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-bold text-[#D62828] dark:text-[#FF5A5F]">
                      {kpis?.totalLeads?.trend}
                    </span>
                    <span className="text-[10px] text-muted-foreground">vs last cycle</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/70 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Enquiry velocity</span>
                  <div className="w-24">
                    <StatSparkline data={kpis?.totalLeads?.sparkline || [0, 0, 0, 0, 0, 0, 0]} color="#D62828" />
                  </div>
                </div>
              </div>

              {/* KPI 2: High-Intent Hot Leads */}
              <div className="p-6 rounded-[14px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] royal-card shadow-card flex flex-col justify-between hover:border-[#FFC21A]/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-heading">
                    Hot Leads (≥75)
                  </span>
                  <div className="w-8 h-8 rounded-[10px] bg-[#FFC21A]/20 text-[#8A5A00] dark:text-[#FFD25A] flex items-center justify-center border border-[#FFC21A]/35">
                    <Flame className="w-4 h-4 stroke-[1.75]" />
                  </div>
                </div>

                <div className="my-4">
                  <p className="font-heading text-3xl font-extrabold text-[#D62828] dark:text-[#FF5A5F] tabular-nums">
                    {loading ? "..." : kpis?.hotLeads?.value ?? 0}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-bold text-[#8A5A00] dark:text-[#FFD25A]">
                      AI Score 75–100
                    </span>
                    <span className="text-[10px] text-muted-foreground">priority queue</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/70 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Daily trend</span>
                  <div className="w-24">
                    <StatSparkline data={kpis?.hotLeads?.sparkline || [0, 0, 0, 0, 0, 0, 0]} color="#FFC21A" />
                  </div>
                </div>
              </div>

              {/* KPI 3: Conversion Rate */}
              <div className="p-6 rounded-[14px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] royal-card shadow-card flex flex-col justify-between hover:border-[#16A34A]/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-heading">
                    Conversion Rate
                  </span>
                  <div className="w-8 h-8 rounded-[10px] bg-[#16A34A]/10 text-[#16A34A] dark:text-[#4ADE80] flex items-center justify-center border border-[#16A34A]/25">
                    <TrendingUp className="w-4 h-4 stroke-[1.75]" />
                  </div>
                </div>

                <div className="my-4">
                  <p className="font-heading text-3xl font-extrabold text-foreground tabular-nums">
                    {loading ? "..." : kpis?.conversionRate?.value ?? "0%"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-bold text-[#16A34A] dark:text-[#4ADE80]">
                      {kpis?.conversionRate?.trend}
                    </span>
                    <span className="text-[10px] text-muted-foreground">inquiry-to-admit</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/70 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Conversion trend</span>
                  <div className="w-24">
                    <StatSparkline data={kpis?.conversionRate?.sparkline || [0, 0, 0, 0, 0, 0, 0]} color="#16A34A" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1: Leads Over Time & Lead Source Volume */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads Over Time (Area Chart in Crimson & Gold) */}
          <div className="lg:col-span-2 p-6 rounded-[14px] bg-card border border-border royal-card shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Historical Trajectory
                </span>
                <h3 className="font-heading text-base font-bold text-foreground">
                  Enquiry Influx &amp; Confirmed Enrollments
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-[4px] bg-[#D62828]" />
                  Enquiries
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-[4px] bg-[#FFC21A]" />
                  Admitted
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground">Loading chart...</div>
              ) : !data?.leadsOverTime || data.leadsOverTime.length === 0 || data.leadsOverTime.every((d: any) => d.leads === 0 && d.admitted === 0) ? (
                <div className="h-full flex flex-col items-center justify-center text-xs text-muted-foreground space-y-1.5 border border-dashed border-border rounded-[14px]">
                  <BarChart3 className="w-8 h-8 text-muted-foreground/40" />
                  <span className="font-bold text-foreground">No enquiry trends yet</span>
                  <span className="text-[11px] text-muted-foreground">Student submissions will plot here automatically</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.leadsOverTime || []}>
                    <defs>
                      <linearGradient id="royalColorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D62828" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#D62828" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="royalColorAdmitted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFC21A" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FFC21A" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 3" stroke="currentColor" className="text-border" opacity={0.5} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "currentColor" }}
                      className="text-muted-foreground"
                      tickLine={false}
                      axisLine={{ stroke: "currentColor", className: "text-border" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "currentColor" }}
                      className="text-muted-foreground"
                      tickLine={false}
                      axisLine={{ stroke: "currentColor", className: "text-border" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        fontSize: "12px",
                        color: "var(--foreground)",
                        boxShadow: "0 8px 24px rgba(214, 40, 40, 0.08)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="leads"
                      stroke="#D62828"
                      strokeWidth={2.5}
                      fill="url(#royalColorLeads)"
                    />
                    <Area
                      type="monotone"
                      dataKey="admitted"
                      stroke="#FFC21A"
                      strokeWidth={2.5}
                      fill="url(#royalColorAdmitted)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Lead Source Horizontal Bar Chart */}
          <div className="p-6 rounded-[14px] bg-card border border-border royal-card shadow-card space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Acquisition Channels
              </span>
              <h3 className="font-heading text-base font-bold text-foreground">
                Inquiry Volume by Source
              </h3>
            </div>

            <div className="h-64 w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground">Loading chart...</div>
              ) : !data?.sourcePerformance || data.sourcePerformance.length === 0 || data.sourcePerformance.every((s: any) => s.total === 0) ? (
                <div className="h-full flex flex-col items-center justify-center text-xs text-muted-foreground space-y-1.5 border border-dashed border-border rounded-[14px]">
                  <Inbox className="w-8 h-8 text-muted-foreground/40" />
                  <span className="font-bold text-foreground">No source data recorded</span>
                  <span className="text-[11px] text-muted-foreground">Inbound channel breakdown will appear here</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.sourcePerformance || []} layout="vertical">
                    <CartesianGrid strokeDasharray="2 3" stroke="currentColor" className="text-border" opacity={0.5} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" tickLine={false} axisLine={false} />
                    <YAxis dataKey="source" type="category" width={85} tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        fontSize: "12px",
                        color: "var(--foreground)",
                        boxShadow: "0 8px 24px rgba(214, 40, 40, 0.08)",
                      }}
                    />
                    <Bar dataKey="total" fill="#D62828" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row 2: Conversion Funnel & Program Preference */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline Funnel */}
          <div className="lg:col-span-2 p-6 rounded-[14px] bg-card border border-border royal-card shadow-card space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Enrollment Journey
              </span>
              <h3 className="font-heading text-base font-bold text-foreground">
                Admissions Pipeline Funnel
              </h3>
            </div>

            {!data?.funnelData || data.funnelData.every((f: any) => f.count === 0) ? (
              <div className="py-12 text-center text-xs text-muted-foreground border border-dashed border-border rounded-[14px] space-y-1">
                <p className="font-bold text-foreground">No pipeline leads yet</p>
                <p className="text-[11px] text-muted-foreground">Prospective scholars moving through stages will populate the funnel</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(data?.funnelData || []).map((item: any, idx: number) => {
                  const gradientStyles = [
                    "from-[#E63946] to-[#D62828]",
                    "from-[#D62828] to-[#8F1218]",
                    "from-[#8F1218] to-[#E5A100]",
                    "from-[#FFC21A] to-[#E5A100]",
                    "from-[#16A34A] to-[#22C55E]",
                  ];
                  const barGradient = gradientStyles[idx % gradientStyles.length];

                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground font-heading">{item.stage}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground tabular-nums">
                            {item.count} leads
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] bg-[#FFF9EE] dark:bg-[#1B1114] border border-border text-muted-foreground font-mono">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[#FFF9EE] dark:bg-[#1B1114] p-0.5 border border-border/80 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-700 shadow-xs`}
                          style={{
                            width: `${Math.max(5, item.percentage)}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Program Preference Donut */}
          <div className="p-6 rounded-[14px] bg-card border border-border royal-card shadow-card space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Curricular Demand
              </span>
              <h3 className="font-heading text-base font-bold text-foreground">
                Program Distribution
              </h3>
            </div>

            <div className="h-52 w-full flex items-center justify-center">
              {loading ? (
                <div className="text-xs text-muted-foreground">Loading chart...</div>
              ) : !data?.courseInterest || data.courseInterest.length === 0 || data.courseInterest.every((c: any) => c.count === 0) ? (
                <div className="h-full w-full flex flex-col items-center justify-center text-xs text-muted-foreground space-y-1.5 border border-dashed border-border rounded-[14px]">
                  <PieIcon className="w-8 h-8 text-muted-foreground/40" />
                  <span className="font-bold text-foreground">No course inquiries yet</span>
                  <span className="text-[11px] text-muted-foreground">Program preferences will display here</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.courseInterest || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {(data?.courseInterest || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={ROYAL_DONUT_COLORS[index % ROYAL_DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        fontSize: "12px",
                        color: "var(--foreground)",
                        boxShadow: "0 8px 24px rgba(214, 40, 40, 0.08)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Donut Legend */}
            {data?.courseInterest && data.courseInterest.length > 0 && !data.courseInterest.every((c: any) => c.count === 0) && (
              <div className="space-y-1.5 pt-2 border-t border-border">
                {data.courseInterest.slice(0, 4).map((c: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 truncate max-w-[170px] text-muted-foreground font-medium">
                      <span
                        className="w-2.5 h-2.5 rounded-[3px] shrink-0"
                        style={{ backgroundColor: ROYAL_DONUT_COLORS[i % ROYAL_DONUT_COLORS.length] }}
                      />
                      <span className="truncate">{c.name}</span>
                    </span>
                    <span className="font-mono text-xs tabular-nums font-bold text-foreground">{c.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Widgets Row 3: Follow-ups Due, Hot Leads & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Follow-up Tasks */}
          <div className="p-6 rounded-[14px] bg-card border border-border royal-card shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[#D62828] dark:text-[#FF5A5F]" />
                  <h3 className="font-heading font-bold text-sm text-foreground">Counselor Follow-ups</h3>
                </div>
                <Link
                  href="/follow-ups"
                  className="text-xs text-[#D62828] dark:text-[#FF5A5F] hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>Queue ({data?.todayFollowUps?.length || 0})</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-border/60 mt-1">
                {(data?.todayFollowUps || []).length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    All scheduled calls for today are up to date.
                  </div>
                ) : (
                  (data?.todayFollowUps || []).slice(0, 5).map((task: any) => (
                    <div key={task.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <Link
                          href={`/leads/${task.lead.id}`}
                          className="font-bold text-foreground hover:text-[#D62828] dark:hover:text-[#FF5A5F] transition-colors"
                        >
                          {task.lead.studentName}
                        </Link>
                        <p className="text-[11px] text-muted-foreground">{task.notes || "Call inquiry"}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-[6px] bg-[#FFC21A]/15 text-[#8A5A00] dark:text-[#FFD25A] text-[10px] font-bold border border-[#FFC21A]/30">
                        {task.type}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Link
              href="/follow-ups"
              className="mt-4 pt-3 border-t border-border flex items-center justify-center gap-1.5 text-xs text-[#D62828] dark:text-[#FF5A5F] font-bold hover:underline"
            >
              <span>Manage follow-up queue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Top Hot Leads List */}
          <div className="p-6 rounded-[14px] bg-card border border-border royal-card shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#D62828] dark:text-[#FF5A5F]" />
                  <h3 className="font-heading font-bold text-sm text-foreground">High-Intent Leads</h3>
                </div>
                <Link
                  href="/leads?scoreCategory=HOT"
                  className="text-xs text-[#D62828] dark:text-[#FF5A5F] hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>Filter HOT</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-border/60 mt-1">
                {(data?.topHotLeads || []).length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    No high-intent inquiries yet. Share your admissions form to capture prospective candidates.
                  </div>
                ) : (
                  (data?.topHotLeads || []).slice(0, 5).map((lead: any) => (
                    <div key={lead.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <Link
                          href={`/leads/${lead.id}`}
                          className="font-bold text-foreground hover:text-[#D62828] dark:hover:text-[#FF5A5F] transition-colors"
                        >
                          {lead.studentName}
                        </Link>
                        <p className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                          {lead.course?.name || "General"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono border ${
                            lead.score >= 75
                              ? "bg-[#D62828]/10 text-[#D62828] dark:text-[#FF5A5F] border-[#D62828]/30 shadow-xs"
                              : "bg-[#FFC21A]/20 text-[#8A5A00] dark:text-[#FFD25A] border-[#FFC21A]/40"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              lead.score >= 75 ? "bg-[#D62828] animate-pulse" : "bg-[#FFC21A]"
                            }`}
                          />
                          {lead.score} {lead.score >= 75 ? "HOT" : "WARM"}
                        </span>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                          {lead.assignedTo?.name || "Unassigned"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Link
              href="/pipeline"
              className="mt-4 pt-3 border-t border-border flex items-center justify-center gap-1.5 text-xs text-[#D62828] dark:text-[#FF5A5F] font-bold hover:underline"
            >
              <span>View in Admissions Pipeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recent Activity Ledger */}
          <div className="p-6 rounded-[14px] bg-card border border-border royal-card shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#D62828] dark:text-[#FF5A5F]" />
                  <h3 className="font-heading font-bold text-sm text-foreground">Activity Stream</h3>
                </div>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Ledger</span>
              </div>

              <div className="divide-y divide-border/60 mt-1">
                {(data?.recentActivities || []).length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    System events and counselor log entries will record here in real time.
                  </div>
                ) : (
                  (data?.recentActivities || []).slice(0, 5).map((act: any) => (
                    <div key={act.id} className="py-2.5 text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground truncate max-w-[180px]">
                          {act.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                          {timeAgo(act.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {act.lead?.studentName ? `${act.lead.studentName}: ` : ""}
                        {act.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border text-center text-[11px] text-muted-foreground font-medium">
              Automated audit trail enabled
            </div>
          </div>
        </div>

        {/* Engagement Heatmap: Days of Week vs Dayparts */}
        <div className="p-6 rounded-[14px] bg-card border border-border royal-card shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Outreach Windows
              </span>
              <h3 className="font-heading text-base font-bold text-foreground">
                Inquiry Timing &amp; Responsiveness Heatmap
              </h3>
            </div>
            <span className="text-xs text-[#D62828] dark:text-[#FF5A5F] font-bold">
              Peak engagement: Tuesday &amp; Thursday afternoons
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {(data?.heatmapData || []).map((slot: any, idx: number) => (
              <div key={idx} className="p-3 rounded-[10px] bg-background border border-border/70 text-center space-y-2">
                <span className="font-bold text-[11px] text-foreground uppercase tracking-wider block font-heading">
                  {slot.day}
                </span>
                <div className="space-y-1 text-[11px] font-mono tabular-nums">
                  <div
                    className="p-1.5 rounded-[6px] font-bold transition-colors"
                    style={{
                      backgroundColor: slot.morning > 5 ? "#D62828" : slot.morning > 2 ? "#FFC21A" : "var(--muted)",
                      color: slot.morning > 5 ? "#ffffff" : slot.morning > 2 ? "#17141A" : "var(--muted-foreground)",
                    }}
                    title={`${slot.morning} inquiries in morning`}
                  >
                    {slot.morning}
                  </div>
                  <div
                    className="p-1.5 rounded-[6px] font-bold transition-colors"
                    style={{
                      backgroundColor: slot.afternoon > 6 ? "#D62828" : slot.afternoon > 3 ? "#FFC21A" : "var(--muted)",
                      color: slot.afternoon > 6 ? "#ffffff" : slot.afternoon > 3 ? "#17141A" : "var(--muted-foreground)",
                    }}
                    title={`${slot.afternoon} inquiries in afternoon`}
                  >
                    {slot.afternoon}
                  </div>
                  <div
                    className="p-1.5 rounded-[6px] font-bold transition-colors"
                    style={{
                      backgroundColor: slot.evening > 4 ? "#D62828" : slot.evening > 1 ? "#FFC21A" : "var(--muted)",
                      color: slot.evening > 4 ? "#ffffff" : slot.evening > 1 ? "#17141A" : "var(--muted-foreground)",
                    }}
                    title={`${slot.evening} inquiries in evening`}
                  >
                    {slot.evening}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground border-t border-border">
            <span>Slots: Top = Morning (9AM-1PM) • Middle = Afternoon (1PM-5PM) • Bottom = Evening (5PM-9PM)</span>
            <span className="font-mono font-medium">Values indicate inbound volume</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

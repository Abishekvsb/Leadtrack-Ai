"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatSparkline } from "@/components/stat-sparkline";
import {
  Users2,
  Sparkles,
  PhoneCall,
  Award,
  TrendingUp,
  Clock,
  Calendar,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Layers,
  ChevronRight,
  HelpCircle,
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
import { formatCurrency, formatDate, timeAgo } from "@/lib/utils";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/types";

const DONUT_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b"];

export default function DashboardPage() {
  const [range, setRange] = useState<"today" | "7d" | "30d" | "all">("30d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Page Header & Range Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Admissions Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              AI-driven student pipeline metrics, counselor workloads & enrollment conversions
            </p>
          </div>

          {/* Date range filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs self-start sm:self-auto">
            {(["today", "7d", "30d", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  range === r
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : r === "all" ? "All Time" : "Today"}
              </button>
            ))}
          </div>
        </div>

        {/* 6 High-Impact KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* 1. Total Leads */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Leads</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <Users2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-bold">{loading ? "..." : kpis?.totalLeads?.value}</p>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {kpis?.totalLeads?.trend}
                </span>
              </div>
              <StatSparkline data={kpis?.totalLeads?.sparkline || [10, 15, 12, 18, 22, 25]} color="#6366f1" />
            </div>
          </div>

          {/* 2. New Today */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">New Today</span>
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-bold">{loading ? "..." : kpis?.newToday?.value}</p>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {kpis?.newToday?.trend}
                </span>
              </div>
              <StatSparkline data={kpis?.newToday?.sparkline || [2, 4, 3, 5, 6, 8]} color="#0ea5e9" />
            </div>
          </div>

          {/* 3. Hot Leads */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Hot Leads</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {loading ? "..." : kpis?.hotLeads?.value}
                </p>
                <span className="text-[10px] font-semibold text-slate-400">Score &ge; 75</span>
              </div>
              <StatSparkline data={kpis?.hotLeads?.sparkline || [10, 12, 15, 18, 22, 28]} color="#10b981" />
            </div>
          </div>

          {/* 4. Follow-ups Due */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Due Tasks</span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {loading ? "..." : kpis?.followUpsDue?.value}
                </p>
                <span className="text-[10px] font-semibold text-slate-400">Pending calls</span>
              </div>
              <StatSparkline data={kpis?.followUpsDue?.sparkline || [6, 8, 5, 9, 7, 8]} color="#f59e0b" />
            </div>
          </div>

          {/* 5. Confirmed Admissions */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Admitted</span>
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {loading ? "..." : kpis?.admissionsConfirmed?.value}
                </p>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {kpis?.admissionsConfirmed?.trend}
                </span>
              </div>
              <StatSparkline data={kpis?.admissionsConfirmed?.sparkline || [1, 3, 4, 6, 9, 15]} color="#a855f7" />
            </div>
          </div>

          {/* 6. Conversion Rate */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Conversion</span>
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-bold">{loading ? "..." : kpis?.conversionRate?.value}</p>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {kpis?.conversionRate?.trend}
                </span>
              </div>
              <StatSparkline data={kpis?.conversionRate?.sparkline || [7.8, 8.4, 9.1, 9.8, 10.3]} color="#0d9488" />
            </div>
          </div>
        </div>

        {/* Charts Row 1: Leads Over Time & Lead Source Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads Over Time (Area Chart) */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">Leads Influx & Confirmed Enrollments</h3>
                <p className="text-xs text-slate-400">Historical enquiry volume trend</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  Enquiries
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Admitted
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.leadsOverTime || []}>
                    <defs>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorAdmitted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        border: "1px solid #1e293b",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    />
                    <Area type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorLeads)" />
                    <Area type="monotone" dataKey="admitted" stroke="#10b981" strokeWidth={2.5} fill="url(#colorAdmitted)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Lead Source Bar Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <div>
              <h3 className="font-semibold text-sm">Lead Source Volume</h3>
              <p className="text-xs text-slate-400">Incoming inquiries by acquisition channel</p>
            </div>

            <div className="h-64 w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading chart...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.sourcePerformance || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="source" type="category" width={85} tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        border: "1px solid #1e293b",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="total" fill="#6366f1" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row 2: Conversion Funnel & Course Interest Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversion Funnel */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-5">
            <div>
              <h3 className="font-semibold text-sm">Admissions Pipeline Funnel</h3>
              <p className="text-xs text-slate-400">Student movement through progressive lifecycle milestones</p>
            </div>

            <div className="space-y-3">
              {(data?.funnelData || []).map((item: any, idx: number) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.stage}</span>
                    <span className="font-bold">
                      {item.count} leads <span className="text-slate-400 font-normal">({item.percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(6, item.percentage)}%`,
                        backgroundColor: item.fill,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course-wise Interest (Donut) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <div>
              <h3 className="font-semibold text-sm">Program Preference</h3>
              <p className="text-xs text-slate-400">Distribution of inquiries across top programs</p>
            </div>

            <div className="h-52 w-full flex items-center justify-center">
              {loading ? (
                <div className="text-xs text-slate-400">Loading chart...</div>
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
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        border: "1px solid #1e293b",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Donut Legend */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              {(data?.courseInterest || []).slice(0, 3).map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 truncate max-w-[170px] text-slate-600 dark:text-slate-400">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                    />
                    <span className="truncate">{c.name}</span>
                  </span>
                  <span className="font-semibold">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Widgets Row 3: Follow-ups Due, Hot Leads & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Follow-up Tasks */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-semibold text-sm">Today&apos;s Follow-up Calls</h3>
                </div>
                <Link href="/follow-ups" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                  View all ({data?.todayFollowUps?.length || 0}) →
                </Link>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-2">
                {(data?.todayFollowUps || []).length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    All follow-ups for today are up to date! 🎉
                  </div>
                ) : (
                  (data?.todayFollowUps || []).slice(0, 5).map((task: any) => (
                    <div key={task.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <Link
                          href={`/leads/${task.lead.id}`}
                          className="font-semibold hover:text-indigo-600 transition-colors"
                        >
                          {task.lead.studentName}
                        </Link>
                        <p className="text-[11px] text-slate-400">{task.notes || "Call inquiry"}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold border border-amber-500/20">
                        {task.type}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Link
              href="/follow-ups"
              className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold"
            >
              <span>Manage follow-up queue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Top Hot Leads List */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-semibold text-sm">Top High-Intent Leads</h3>
                </div>
                <Link href="/leads?scoreCategory=HOT" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                  Filter HOT →
                </Link>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-2">
                {(data?.topHotLeads || []).slice(0, 5).map((lead: any) => (
                  <div key={lead.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-semibold hover:text-indigo-600 transition-colors"
                      >
                        {lead.studentName}
                      </Link>
                      <p className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {lead.course?.name || "General"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {lead.score} <span className="text-[10px] text-slate-400">/ 100</span>
                      </span>
                      <p className="text-[10px] text-slate-400">{lead.assignedTo?.name || "Unassigned"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/pipeline"
              className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold"
            >
              <span>View in Kanban Pipeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recent Activity Feed */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold text-sm">Live Activity Stream</h3>
                </div>
                <span className="text-[11px] text-slate-400">System Feed</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-2">
                {(data?.recentActivities || []).slice(0, 5).map((act: any) => (
                  <div key={act.id} className="py-2.5 text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">{timeAgo(act.createdAt)}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {act.lead?.studentName ? `${act.lead.studentName}: ` : ""}
                      {act.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400">
              Live automated activity logging enabled
            </div>
          </div>
        </div>

        {/* Engagement Heatmap: Days of Week vs Dayparts */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">Student Enquiry Timing Heatmap</h3>
              <p className="text-xs text-slate-400">Optimal outreach windows by day of week and hour of day</p>
            </div>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              Peak: Tue & Thu afternoons
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {(data?.heatmapData || []).map((slot: any, idx: number) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center space-y-2">
                <span className="font-semibold text-xs text-slate-700 dark:text-slate-300 block">{slot.day}</span>
                <div className="space-y-1 text-[11px]">
                  <div
                    className="p-1.5 rounded-lg text-white font-semibold"
                    style={{
                      backgroundColor: slot.morning > 5 ? "#4f46e5" : slot.morning > 2 ? "#818cf8" : "#c7d2fe",
                      color: slot.morning > 2 ? "#fff" : "#1e1b4b",
                    }}
                    title={`${slot.morning} inquiries in morning`}
                  >
                    {slot.morning}
                  </div>
                  <div
                    className="p-1.5 rounded-lg text-white font-semibold"
                    style={{
                      backgroundColor: slot.afternoon > 6 ? "#4f46e5" : slot.afternoon > 3 ? "#818cf8" : "#c7d2fe",
                      color: slot.afternoon > 3 ? "#fff" : "#1e1b4b",
                    }}
                    title={`${slot.afternoon} inquiries in afternoon`}
                  >
                    {slot.afternoon}
                  </div>
                  <div
                    className="p-1.5 rounded-lg text-white font-semibold"
                    style={{
                      backgroundColor: slot.evening > 4 ? "#4f46e5" : slot.evening > 1 ? "#818cf8" : "#c7d2fe",
                      color: slot.evening > 1 ? "#fff" : "#1e1b4b",
                    }}
                    title={`${slot.evening} inquiries in evening`}
                  >
                    {slot.evening}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-4 pt-2 text-[11px] text-slate-400">
            <span>Slots: Top = Morning (9AM-1PM) • Middle = Afternoon (1PM-5PM) • Bottom = Evening (5PM-9PM)</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

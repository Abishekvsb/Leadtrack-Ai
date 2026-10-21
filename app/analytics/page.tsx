"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/components/toast-context";
import {
  BarChart3,
  TrendingUp,
  Download,
  DollarSign,
  Users2,
  BookOpen,
  AlertTriangle,
  Clock,
  Printer,
  Sparkles,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import * as XLSX from "xlsx";

export default function AnalyticsPage() {
  const { success, error } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const json = await res.json();
          if (json.success) setData(json.data);
        }
      } catch {
        error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const handleExportCSV = () => {
    if (!data?.sourceROI) return;
    const worksheet = XLSX.utils.json_to_sheet(data.sourceROI);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Source_ROI");
    XLSX.writeFile(workbook, `LeadTrack_ROI_Report_${Date.now()}.csv`, { bookType: "csv" });
    success("Downloaded CSV Analytics Report");
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-16 print:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Admissions Analytics &amp; ROI Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive acquisition return, counselor benchmarks &amp; seat fulfillment
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Report</span>
            </button>
          </div>
        </div>

        {/* High-Level Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Enquiries</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {loading ? "..." : data?.totalLeads}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold">+18% vs previous intake</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Confirmed Admissions</span>
            <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {loading ? "..." : data?.admittedTotal}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">10.3% Overall Conversion</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Avg Time-To-Conversion</span>
            <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
              {loading ? "..." : `${data?.avgDaysToConvert} Days`}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold">Reduced by 4.2 days with AI</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">UN SDG 4 Index</span>
            <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">100 / 100</p>
            <p className="text-[11px] text-slate-500 font-medium">Equitable access &amp; transparency</p>
          </div>
        </div>

        {/* 1. Source Acquisition ROI Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm">Lead Source Acquisition ROI Analysis</h3>
              <p className="text-xs text-slate-400">Marketing expenditure vs enrolled student tuition yield</p>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              Highest Yield: Referrals &amp; Walk-ins
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] uppercase text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <th className="py-2.5">Lead Source</th>
                  <th className="py-2.5">Total Enquiries</th>
                  <th className="py-2.5">Admissions</th>
                  <th className="py-2.5">Conv. Rate</th>
                  <th className="py-2.5">Estimated Spend</th>
                  <th className="py-2.5">Tuition Revenue</th>
                  <th className="py-2.5 text-right">Marketing ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(data?.sourceROI || []).map((s: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{s.source}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{s.leads}</td>
                    <td className="py-3 font-semibold text-emerald-600 dark:text-emerald-400">{s.admitted}</td>
                    <td className="py-3 font-bold">{s.conversionRate}%</td>
                    <td className="py-3 text-slate-500">{formatCurrency(s.cost)}</td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(s.revenue)}
                    </td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                        +{s.roi}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Counselor Performance & Conversion Leaderboard */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm">Admissions Counselor Conversion Benchmarks</h3>
              <p className="text-xs text-slate-400">Pipeline progression from assignment to enrolled admission</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data?.counselorConversion || []).map((c: any) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{c.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
                    {c.conversionRate}% Conv
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Assigned</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{c.assigned}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Visits Booked</span>
                    <span className="font-bold text-purple-600">{c.campusVisits}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Admissions</span>
                    <span className="font-bold text-emerald-600">{c.admitted}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Program Seat Fulfillment & Drop-Off Diagnosis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Program Seat Fulfillment */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm">Course Capacity &amp; Seat Intake</h3>
            <div className="space-y-3">
              {(data?.courseDemand || []).map((c: any) => (
                <div key={c.id} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="truncate max-w-[200px] text-slate-800 dark:text-slate-200">{c.name}</span>
                    <span>
                      {c.admitted} / {c.seats} seats filled ({c.occupancyRate}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                      style={{ width: `${Math.min(100, Math.max(5, c.occupancyRate))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drop-off / Lost Causes */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm">Drop-Off / Closed Inquiry Diagnosis</h3>
            <div className="space-y-2.5">
              {(data?.dropOffAnalysis || []).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-700 dark:text-slate-300 truncate max-w-[280px]">
                    {item.reason}
                  </span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 shrink-0">
                    {item.count} leads ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

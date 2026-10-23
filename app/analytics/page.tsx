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
  GraduationCap,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="space-y-8 pb-16 print:p-0 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
              Institutional Intelligence
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
              Admissions Analytics &amp; Yield Report
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Audited acquisition ROI, counselor conversion benchmarks, and academic seat fulfillment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-[8px] border border-border bg-card text-foreground hover:bg-[#EDE6DA]/50 dark:hover:bg-[#1F2723] text-xs font-medium transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-[8px] bg-[#0F3D33] dark:bg-[#4FB89A] text-[#F6F2EA] dark:text-[#0F1412] hover:bg-[#165447] dark:hover:bg-[#63C7AA] font-medium text-xs shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Yield</span>
            </button>
          </div>
        </div>

        {/* High-Level Overview Metrics (Academic Prospectus Style Strip) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-[12px] bg-card border border-border shadow-xs space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Total Inquiries</span>
            <p className="font-serif text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
              {loading ? "..." : data?.totalLeads}
            </p>
            <p className="text-[11px] text-[#0F3D33] dark:text-[#4FB89A] font-medium">+18% intake growth</p>
          </div>

          <div className="p-5 rounded-[12px] bg-card border border-border shadow-xs space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Confirmed Admissions</span>
            <p className="font-serif text-3xl sm:text-4xl font-normal text-[#0F3D33] dark:text-[#4FB89A] tracking-tight">
              {loading ? "..." : data?.admittedTotal}
            </p>
            <p className="text-[11px] text-muted-foreground font-mono">10.3% Conversion Rate</p>
          </div>

          <div className="p-5 rounded-[12px] bg-card border border-border shadow-xs space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Average Intake Cycle</span>
            <p className="font-serif text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
              {loading ? "..." : `${data?.avgDaysToConvert} Days`}
            </p>
            <p className="text-[11px] text-accent font-medium">Reduced 4.2 days with Copilot</p>
          </div>

          <div className="p-5 rounded-[12px] bg-card border border-border shadow-xs space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">UN SDG 4 Compliance</span>
            <p className="font-serif text-3xl sm:text-4xl font-normal text-[#0F3D33] dark:text-[#4FB89A] tracking-tight">
              100%
            </p>
            <p className="text-[11px] text-muted-foreground font-medium">Equitable access &amp; transparency</p>
          </div>
        </div>

        {/* 1. Source Acquisition ROI Table */}
        <div className="p-6 rounded-[12px] bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Channel Performance</div>
              <h3 className="font-serif text-base font-normal text-foreground">Lead Source Acquisition ROI Analysis</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Marketing expenditure vs enrolled student tuition yield</p>
            </div>
            <span className="text-xs text-[#0F3D33] dark:text-[#4FB89A] font-medium font-mono">
              Highest Yield: Referrals &amp; Walk-ins
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] uppercase text-muted-foreground font-mono tracking-wider border-b border-border">
                  <th className="py-2.5">Inbound Channel</th>
                  <th className="py-2.5">Inquiries</th>
                  <th className="py-2.5">Admissions</th>
                  <th className="py-2.5">Conversion</th>
                  <th className="py-2.5">Estimated Spend</th>
                  <th className="py-2.5">Tuition Revenue</th>
                  <th className="py-2.5 text-right">Marketing Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(data?.sourceROI || []).map((s: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[#EDE6DA]/30 dark:hover:bg-[#1F2723]/30 transition-colors">
                    <td className="py-3 font-medium text-foreground">{s.source}</td>
                    <td className="py-3 text-muted-foreground font-mono tabular-nums">{s.leads}</td>
                    <td className="py-3 font-medium text-[#0F3D33] dark:text-[#4FB89A] font-mono tabular-nums">{s.admitted}</td>
                    <td className="py-3 font-mono font-medium text-foreground tabular-nums">{s.conversionRate}%</td>
                    <td className="py-3 text-muted-foreground font-mono tabular-nums">{formatCurrency(s.cost)}</td>
                    <td className="py-3 font-medium text-foreground font-mono tabular-nums">
                      {formatCurrency(s.revenue)}
                    </td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-[4px] bg-[#0F3D33]/10 text-[#0F3D33] dark:bg-[#4FB89A]/15 dark:text-[#4FB89A] font-mono text-[11px] border border-[#0F3D33]/20">
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
        <div className="p-6 rounded-[12px] bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Faculty Leaderboard</div>
              <h3 className="font-serif text-base font-normal text-foreground">Admissions Counselor Conversion Benchmarks</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Pipeline progression from assignment to enrolled matriculation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data?.counselorConversion || []).map((c: any) => (
              <div
                key={c.id}
                className="p-5 rounded-[10px] bg-[#EDE6DA]/30 dark:bg-[#1F2723]/30 border border-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-normal text-foreground">{c.name}</span>
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#0F3D33] text-[#F6F2EA] dark:bg-[#4FB89A] dark:text-[#0F1412] font-mono font-bold text-xs">
                    {c.conversionRate}% Conv
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-[8px] bg-card border border-border">
                    <span className="text-[10px] text-muted-foreground font-mono uppercase block">Assigned</span>
                    <span className="font-mono font-bold text-foreground tabular-nums">{c.assigned}</span>
                  </div>
                  <div className="p-2.5 rounded-[8px] bg-card border border-border">
                    <span className="text-[10px] text-muted-foreground font-mono uppercase block">Visits Booked</span>
                    <span className="font-mono font-bold text-accent tabular-nums">{c.campusVisits}</span>
                  </div>
                  <div className="p-2.5 rounded-[8px] bg-card border border-border">
                    <span className="text-[10px] text-muted-foreground font-mono uppercase block">Admitted</span>
                    <span className="font-mono font-bold text-[#0F3D33] dark:text-[#4FB89A] tabular-nums">{c.admitted}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Program Seat Fulfillment & Drop-Off Diagnosis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Program Seat Fulfillment */}
          <div className="p-6 rounded-[12px] bg-card border border-border shadow-xs space-y-4">
            <div className="pb-3 border-b border-border">
              <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Capacity Planning</div>
              <h3 className="font-serif text-base font-normal text-foreground">Program Seat Intake &amp; Fill Rate</h3>
            </div>
            <div className="space-y-4">
              {(data?.courseDemand || []).map((c: any) => (
                <div key={c.id} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="truncate max-w-[200px] text-foreground">{c.name}</span>
                    <span className="font-mono text-muted-foreground tabular-nums">
                      {c.admitted} / {c.seats} seats ({c.occupancyRate}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-[4px] bg-[#EDE6DA] dark:bg-[#1F2723] overflow-hidden">
                    <div
                      className="h-full rounded-[4px] bg-[#0F3D33] dark:bg-[#4FB89A] transition-all"
                      style={{ width: `${Math.min(100, Math.max(5, c.occupancyRate))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drop-off / Lost Causes */}
          <div className="p-6 rounded-[12px] bg-card border border-border shadow-xs space-y-4">
            <div className="pb-3 border-b border-border">
              <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Friction Diagnosis</div>
              <h3 className="font-serif text-base font-normal text-foreground">Inquiry Drop-off Rationale</h3>
            </div>
            <div className="space-y-2.5">
              {(data?.dropOffAnalysis || []).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-[8px] bg-[#EDE6DA]/30 dark:bg-[#1F2723]/30 border border-border flex items-center justify-between text-xs"
                >
                  <span className="text-foreground truncate max-w-[280px]">
                    {item.reason}
                  </span>
                  <span className="font-mono font-medium text-[#C4552F] shrink-0 tabular-nums">
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

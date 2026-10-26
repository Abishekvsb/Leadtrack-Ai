"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/components/toast-context";
import {
  ShieldCheck,
  Search,
  Filter,
  User,
  Clock,
  Terminal,
  Loader2,
  FileText,
  Lock,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function AuditLogsPage() {
  const { error } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch("/api/audit-logs?limit=80");
        if (res.ok) {
          const json = await res.json();
          if (json.success) setLogs(json.data.auditLogs || []);
        } else {
          error("Admin authorization required to view audit trail.");
        }
      } catch {
        error("Failed to load audit logs");
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [error]);

  const filtered = logs.filter((log) => {
    if (filterAction !== "ALL" && log.action !== filterAction) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        (log.user?.name || "").toLowerCase().includes(q) ||
        (log.details || "").toLowerCase().includes(q) ||
        (log.ipAddress || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case "DELETE_LEAD":
        return "bg-[#C4552F]/10 text-[#C4552F] border-[#C4552F]/25";
      case "CREATE_LEAD":
      case "LOGIN":
        return "bg-[#16A34A]/10 text-[#16A34A] dark:text-[#4ADE80] border-[#16A34A]/30 font-bold";
      case "UPDATE_LEAD":
      case "UPDATE_SETTINGS":
        return "bg-[#FFC21A]/15 text-[#8A5A00] dark:text-[#FFD25A] border-[#FFC21A]/35 font-bold";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F0E6D6] dark:border-[#2E1D21] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#D62828]/10 text-[#D62828] dark:text-[#FF5A5F] text-[11px] font-mono font-bold uppercase tracking-wider border border-[#D62828]/25 mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Institutional Governance &amp; Security Compliance</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight title-gold-accent pb-2">
              Audit Trail &amp; Ledger
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl font-sans">
              Immutable archival record of authentications, record revisions, bulk assignments, and system credential modifications.
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-[11px] text-muted-foreground">
              Records logged: <span className="font-semibold text-foreground">{filtered.length}</span>
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-3.5 rounded-[14px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by action, staff name, or IP address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-background/50 border border-border text-foreground placeholder-[#6B665C]/60 dark:placeholder-[#959187]/60 outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 transition-colors font-sans"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg bg-background/50 border border-border text-foreground outline-none font-mono font-medium focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 transition-colors"
            >
              <option value="ALL">All Event Types</option>
              <option value="LOGIN">LOGIN</option>
              <option value="CREATE_LEAD">CREATE_LEAD</option>
              <option value="UPDATE_LEAD">UPDATE_LEAD</option>
              <option value="DELETE_LEAD">DELETE_LEAD</option>
              <option value="UPDATE_SETTINGS">UPDATE_SETTINGS</option>
              <option value="PASSWORD_RESET">PASSWORD_RESET</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="rounded-[14px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] shadow-xs overflow-hidden">
          <div className="overflow-x-auto max-h-[70vh] relative">
            <table className="w-full text-left text-xs font-sans">
              <thead className="sticky top-0 z-10 shadow-xs">
                <tr className="bg-[#FFF9EE]/95 dark:bg-[#1B1114]/95 backdrop-blur-xs text-[10px] font-mono uppercase tracking-wider font-bold text-muted-foreground border-b border-[#F0E6D6] dark:border-[#2E1D21]">
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Staff Member</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                  <th className="py-3 px-4 font-semibold">Entity</th>
                  <th className="py-3 px-4 font-semibold">IP Address</th>
                  <th className="py-3 px-4 font-semibold">Details &amp; Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-muted-foreground">
                      <div className="inline-flex items-center gap-2 font-mono text-xs">
                        <Loader2 className="w-4 h-4 animate-spin text-[#D62828] dark:text-[#FF5A5F]" />
                        <span>Retrieving ledger entries...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-muted-foreground">
                      <div className="max-w-xs mx-auto space-y-2">
                        <FileText className="w-8 h-8 text-[#6B665C]/40 mx-auto" />
                        <p className="font-heading text-sm font-semibold text-foreground">No matching records</p>
                        <p className="text-xs">Adjust your search query or event filter to inspect historical logs.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FFF9EE]/70 dark:hover:bg-[#27191E]/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {formatDateTime(log.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {log.user?.name || "System Automation"}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase bg-muted text-muted-foreground border border-border">
                            {log.user?.role || "SYSTEM"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${getActionBadgeClass(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        {log.entityType}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                        {log.ipAddress || "—"}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate font-mono text-[11px] text-muted-foreground">
                        {log.details || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

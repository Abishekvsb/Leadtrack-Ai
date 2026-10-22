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
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { formatDateTime, timeAgo } from "@/lib/utils";

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
  }, []);

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

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/20 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Institutional Governance &amp; Security Compliance</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Audit Trail &amp; System Event Logs
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Immutable historical record of every login, lead modification, bulk assignment &amp; setting change
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by action, user, or IP address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
            />
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-semibold"
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

        {/* Audit Log Table */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-semibold uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Target Entity</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Details / Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      Loading audit logs...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      No matching audit records.
                    </td>
                  </tr>
                ) : (
                  filtered.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {formatDateTime(log.createdAt)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {log.user?.name || "System Automation"}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-mono">
                            {log.user?.role || "SYSTEM"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-600 dark:text-slate-300">
                        {log.entityType}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-400">{log.ipAddress || "—"}</td>
                      <td className="p-4 max-w-xs truncate font-mono text-[11px] text-slate-500">
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

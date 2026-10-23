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
        return "bg-[#0F3D33]/10 dark:bg-[#4FB89A]/15 text-[#0F3D33] dark:text-[#4FB89A] border-[#0F3D33]/25 dark:border-[#4FB89A]/30";
      case "UPDATE_LEAD":
      case "UPDATE_SETTINGS":
        return "bg-[#E0A030]/10 text-[#B87A14] dark:text-[#E0A030] border-[#E0A030]/30";
      default:
        return "bg-[#FAF7F0] dark:bg-[#1E2622] text-[#6B665C] dark:text-[#959187] border-[#E4DDD0] dark:border-[#26302B]";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4DDD0] dark:border-[#26302B] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FAF7F0] dark:bg-[#171D1A] text-[#0F3D33] dark:text-[#4FB89A] text-[11px] font-mono uppercase tracking-wider border border-[#E4DDD0] dark:border-[#26302B] mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Institutional Governance &amp; Security Compliance</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1B1A17] dark:text-[#ECE8DF]">
              Audit Trail &amp; Ledger
            </h1>
            <p className="text-xs sm:text-sm text-[#6B665C] dark:text-[#959187] mt-1 max-w-2xl font-sans">
              Immutable archival record of authentications, record revisions, bulk assignments, and system credential modifications.
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-[11px] text-[#6B665C] dark:text-[#959187]">
              Records logged: <span className="font-semibold text-[#1B1A17] dark:text-[#ECE8DF]">{filtered.length}</span>
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#171D1A] border border-[#E4DDD0] dark:border-[#26302B] shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B665C] dark:text-[#959187]" />
            <input
              type="text"
              placeholder="Search by action, staff name, or IP address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-[#FAF7F0] dark:bg-[#0F1412] border border-[#E4DDD0] dark:border-[#26302B] text-[#1B1A17] dark:text-[#ECE8DF] placeholder-[#6B665C]/60 dark:placeholder-[#959187]/60 outline-none focus:border-[#0F3D33] dark:focus:border-[#4FB89A] transition-colors font-sans"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-[#6B665C] dark:text-[#959187] hidden sm:block" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg bg-[#FAF7F0] dark:bg-[#0F1412] border border-[#E4DDD0] dark:border-[#26302B] text-[#1B1A17] dark:text-[#ECE8DF] outline-none font-mono font-medium focus:border-[#0F3D33] dark:focus:border-[#4FB89A] transition-colors"
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
        <div className="rounded-xl bg-white dark:bg-[#171D1A] border border-[#E4DDD0] dark:border-[#26302B] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-[#FAF7F0] dark:bg-[#131916] text-[10px] font-mono uppercase tracking-wider text-[#6B665C] dark:text-[#959187] border-b border-[#E4DDD0] dark:border-[#26302B]">
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Staff Member</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                  <th className="py-3 px-4 font-semibold">Entity</th>
                  <th className="py-3 px-4 font-semibold">IP Address</th>
                  <th className="py-3 px-4 font-semibold">Details &amp; Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DDD0]/60 dark:divide-[#26302B]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-[#6B665C] dark:text-[#959187]">
                      <div className="inline-flex items-center gap-2 font-mono text-xs">
                        <Loader2 className="w-4 h-4 animate-spin text-[#0F3D33] dark:text-[#4FB89A]" />
                        <span>Retrieving ledger entries...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-[#6B665C] dark:text-[#959187]">
                      <div className="max-w-xs mx-auto space-y-2">
                        <FileText className="w-8 h-8 text-[#6B665C]/40 mx-auto" />
                        <p className="font-serif text-sm font-semibold text-[#1B1A17] dark:text-[#ECE8DF]">No matching records</p>
                        <p className="text-xs">Adjust your search query or event filter to inspect historical logs.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAF7F0]/60 dark:hover:bg-[#1E2622]/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-[#6B665C] dark:text-[#959187] whitespace-nowrap">
                        {formatDateTime(log.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#1B1A17] dark:text-[#ECE8DF]">
                            {log.user?.name || "System Automation"}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase bg-[#FAF7F0] dark:bg-[#1E2622] text-[#6B665C] dark:text-[#959187] border border-[#E4DDD0] dark:border-[#26302B]">
                            {log.user?.role || "SYSTEM"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${getActionBadgeClass(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-[#1B1A17] dark:text-[#ECE8DF]">
                        {log.entityType}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#6B665C] dark:text-[#959187]">
                        {log.ipAddress || "—"}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate font-mono text-[11px] text-[#6B665C] dark:text-[#959187]">
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

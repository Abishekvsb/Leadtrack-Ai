"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/components/toast-context";
import {
  Sparkles,
  Zap,
  Play,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Power,
  RotateCw,
  Loader2,
  X,
} from "lucide-react";
import { formatDateTime, timeAgo } from "@/lib/utils";

export default function AutomationPage() {
  const { success, error, info } = useToast();
  const [automations, setAutomations] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  // New Rule Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("SCORE_ABOVE");
  const [threshold, setThreshold] = useState("80");
  const [days, setDays] = useState("2");
  const [targetStatus, setTargetStatus] = useState("CAMPUS_VISIT");
  const [actionType, setActionType] = useState("NOTIFY_COUNSELOR");

  const loadData = async () => {
    try {
      const res = await fetch("/api/automations");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setAutomations(json.data.automations || []);
          setLogs(json.data.logs || []);
        }
      }
    } catch {
      error("Failed to load automations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Toggle Rule Status
  const handleToggle = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/automations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentActive }),
      });
      const data = await res.json();
      if (data.success) {
        success(`Automation rule ${!currentActive ? "enabled" : "disabled"}`);
        setAutomations((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isActive: !currentActive } : a))
        );
      }
    } catch {
      error("Failed to update rule state");
    }
  };

  // Run Automation Engine Now
  const handleRunEngine = async () => {
    setTriggering(true);
    try {
      const res = await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RUN_ENGINE" }),
      });
      const data = await res.json();
      if (data.success) {
        success(data.message || "Automation engine executed successfully!");
        loadData();
      } else {
        error(data.error);
      }
    } catch {
      error("Error triggering automation engine");
    } finally {
      setTriggering(false);
    }
  };

  // Create Rule
  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let conditionConfig: any = {};
    if (triggerEvent === "SCORE_ABOVE") conditionConfig.threshold = Number(threshold);
    if (triggerEvent === "NO_RESPONSE_X_DAYS") conditionConfig.days = Number(days);
    if (triggerEvent === "STATUS_CHANGED") conditionConfig.targetStatus = targetStatus;

    try {
      const res = await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          triggerEvent,
          conditionConfig,
          actionType,
          actionConfig: {},
          isActive: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        success("New automation rule published!");
        setCreateModalOpen(false);
        setName("");
        setDescription("");
        loadData();
      } else {
        error(data.error);
      }
    } catch {
      error("Failed to create rule");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Admissions Automation Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Autonomous SLAs, multi-channel check-ins &amp; proactive counselor alerts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunEngine}
              disabled={triggering}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {triggering ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Automation Engine Now</span>
                </>
              )}
            </button>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Rule</span>
            </button>
          </div>
        </div>

        {/* Active Rules Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Active Workflow Recipes ({automations.length})
            </h3>
            <span className="text-xs text-slate-400">Background evaluation active</span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400">Loading rules...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {automations.map((auto) => (
                <div
                  key={auto.id}
                  className={`p-6 rounded-3xl border transition-all space-y-4 flex flex-col justify-between ${
                    auto.isActive
                      ? "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 shadow-xs"
                      : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/40 dark:border-slate-800/40 opacity-70"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            auto.isActive ? "bg-indigo-500/10 text-indigo-600" : "bg-slate-200 text-slate-400"
                          }`}
                        >
                          <Zap className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{auto.name}</h4>
                      </div>

                      {/* Active Toggle Switch */}
                      <button
                        onClick={() => handleToggle(auto.id, auto.isActive)}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                          auto.isActive ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                            auto.isActive ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {auto.description || "Automated institutional SLA rule."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {auto.executionCount} executions
                    </span>
                    <span>Last run: {auto.lastRunAt ? timeAgo(auto.lastRunAt) : "Never"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Execution Audit Log Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm">Real-time Automation Execution History</h3>
            <span className="text-xs text-slate-400">Showing last {logs.length} runs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] uppercase text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <th className="py-2.5">Rule Executed</th>
                  <th className="py-2.5">Candidate Lead</th>
                  <th className="py-2.5">Result</th>
                  <th className="py-2.5">Details</th>
                  <th className="py-2.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No automated executions logged yet. Click &quot;Run Automation Engine Now&quot; to test.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                        {log.automation?.name || "System Rule"}
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">
                        {log.lead?.studentName || "Multiple Leads"}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 max-w-xs truncate">{log.message}</td>
                      <td className="py-3 text-right text-slate-400">{timeAgo(log.executedAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Create Automation Rule */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base">Build New Automation Recipe</h3>
                <button onClick={() => setCreateModalOpen(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold">Rule Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIP Hot Lead Escalation"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Explain when and why this rule executes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold">Trigger Event (WHEN)</label>
                  <select
                    value={triggerEvent}
                    onChange={(e) => setTriggerEvent(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="SCORE_ABOVE">AI Score crosses threshold</option>
                    <option value="NO_RESPONSE_X_DAYS">No counselor touchpoint in X days</option>
                    <option value="STATUS_CHANGED">Lead status changes to specific stage</option>
                    <option value="LEAD_CREATED">New student inquiry created</option>
                  </select>
                </div>

                {triggerEvent === "SCORE_ABOVE" && (
                  <div className="space-y-1">
                    <label className="font-semibold">Minimum Score Threshold (0 - 100)</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>
                )}

                {triggerEvent === "NO_RESPONSE_X_DAYS" && (
                  <div className="space-y-1">
                    <label className="font-semibold">Days without response</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>
                )}

                {triggerEvent === "STATUS_CHANGED" && (
                  <div className="space-y-1">
                    <label className="font-semibold">Target Stage</label>
                    <select
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    >
                      <option value="CAMPUS_VISIT">Campus Visit</option>
                      <option value="APPLICATION_SUBMITTED">Application Submitted</option>
                      <option value="ADMITTED">Admitted</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-semibold">Action Executed (THEN)</label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="NOTIFY_COUNSELOR">Notify assigned counselor with urgent alert</option>
                    <option value="SEND_EMAIL">Dispatch automated email template</option>
                    <option value="SEND_WHATSAPP">Dispatch automated WhatsApp template</option>
                    <option value="UPDATE_STATUS">Transition pipeline stage</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl border text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md"
                  >
                    Save &amp; Activate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

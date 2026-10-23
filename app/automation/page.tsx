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
  const { success, error } = useToast();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        success(`Workflow recipe ${!currentActive ? "enabled" : "disabled"}`);
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
          conditionConfig: JSON.stringify(conditionConfig),
          actionType,
          actionConfig: JSON.stringify({ channel: "INSTITUTION_DEFAULT" }),
        }),
      });
      const data = await res.json();
      if (data.success) {
        success("New workflow recipe registered!");
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
      <div className="space-y-8 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
              Automated Operations
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
              SLA &amp; Workflow Recipes
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Autonomous response SLAs, multi-channel candidate reminders, and counselor alert rules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunEngine}
              disabled={triggering}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-[8px] bg-[#0F3D33] dark:bg-[#4FB89A] text-[#F6F2EA] dark:text-[#0F1412] hover:bg-[#165447] dark:hover:bg-[#63C7AA] font-medium text-xs shadow-xs transition-colors disabled:opacity-50"
            >
              {triggering ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Engine Now</span>
                </>
              )}
            </button>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-[8px] border border-border bg-card text-foreground hover:bg-[#EDE6DA]/50 dark:hover:bg-[#1F2723] font-medium text-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Recipe</span>
            </button>
          </div>
        </div>

        {/* Active Rules Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-normal text-foreground">
              Configured Recipes ({automations.length})
            </h3>
            <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
              Background Monitor Active
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs text-muted-foreground font-serif italic">Loading automated recipes...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {automations.map((auto) => (
                <div
                  key={auto.id}
                  className={`p-6 rounded-[12px] border transition-all space-y-4 flex flex-col justify-between ${
                    auto.isActive
                      ? "bg-card border-border shadow-xs"
                      : "bg-[#EDE6DA]/20 dark:bg-[#171D1A]/40 border-border opacity-70"
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-[6px] flex items-center justify-center border ${
                            auto.isActive
                              ? "bg-[#0F3D33]/10 text-[#0F3D33] dark:bg-[#4FB89A]/15 dark:text-[#4FB89A] border-[#0F3D33]/20"
                              : "bg-[#EDE6DA] text-muted-foreground border-border"
                          }`}
                        >
                          <Zap className="w-4 h-4 stroke-[1.5]" />
                        </div>
                        <h4 className="font-serif text-base font-normal text-foreground">{auto.name}</h4>
                      </div>

                      {/* Active Toggle Switch */}
                      <button
                        onClick={() => handleToggle(auto.id, auto.isActive)}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                          auto.isActive ? "bg-[#0F3D33] dark:bg-[#4FB89A]" : "bg-[#EDE6DA] dark:bg-[#26302B] border border-border"
                        }`}
                        title="Toggle rule active state"
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                            auto.isActive ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {auto.description || "Institutional admissions workflow recipe."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1.5 font-medium text-foreground tabular-nums">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F3D33] dark:text-[#4FB89A]" />
                      {auto.executionCount} executions
                    </span>
                    <span className="tabular-nums">Last evaluated: {auto.lastRunAt ? timeAgo(auto.lastRunAt) : "Never"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Execution Audit Log Table */}
        <div className="p-6 rounded-[12px] bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-serif text-base font-normal text-foreground">Automation Execution Audit Log</h3>
            <span className="font-mono text-xs text-muted-foreground">Recent {logs.length} executions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] uppercase text-muted-foreground font-mono tracking-wider border-b border-border">
                  <th className="py-2.5">Recipe</th>
                  <th className="py-2.5">Candidate Dossier</th>
                  <th className="py-2.5">Outcome</th>
                  <th className="py-2.5">Operational Details</th>
                  <th className="py-2.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground font-serif italic">
                      No automated executions logged yet. Click &quot;Execute Engine Now&quot; to test.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#EDE6DA]/30 dark:hover:bg-[#1F2723]/30 transition-colors">
                      <td className="py-3 font-medium text-foreground">
                        {log.automation?.name || "System Recipe"}
                      </td>
                      <td className="py-3 text-foreground">
                        {log.lead?.studentName || "Multiple Candidates"}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase bg-[#0F3D33]/10 text-[#0F3D33] dark:bg-[#4FB89A]/15 dark:text-[#4FB89A] border border-[#0F3D33]/20">
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground max-w-xs truncate">{log.message}</td>
                      <td className="py-3 text-right font-mono text-muted-foreground text-[11px] tabular-nums">
                        {timeAgo(log.executedAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Create Automation Rule */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-card rounded-[12px] p-6 sm:p-8 shadow-academic-floating border border-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Workflow Configuration</div>
                  <h3 className="font-serif text-lg font-normal text-foreground">Register New Recipe</h3>
                </div>
                <button onClick={() => setCreateModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Recipe Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. High Intent Candidate Priority Outreach"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-[#0F3D33] dark:focus:border-[#4FB89A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Operational Rationale</label>
                  <textarea
                    rows={2}
                    placeholder="Describe the institutional goal and trigger scenario..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-[#0F3D33] dark:focus:border-[#4FB89A] resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Trigger Condition (WHEN)</label>
                  <select
                    value={triggerEvent}
                    onChange={(e) => setTriggerEvent(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#0F3D33] dark:focus:border-[#4FB89A]"
                  >
                    <option value="SCORE_ABOVE">AI Readiness score crosses threshold</option>
                    <option value="NO_RESPONSE_X_DAYS">No counselor consultation recorded in X days</option>
                    <option value="STATUS_CHANGED">Candidate advances to target stage</option>
                    <option value="LEAD_CREATED">New candidate inquiry registered</option>
                  </select>
                </div>

                {triggerEvent === "SCORE_ABOVE" && (
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Minimum Score Threshold (0 - 100)</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value)}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#0F3D33] dark:focus:border-[#4FB89A]"
                    />
                  </div>
                )}

                {triggerEvent === "NO_RESPONSE_X_DAYS" && (
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Days without counselor touchpoint</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#0F3D33] dark:focus:border-[#4FB89A]"
                    />
                  </div>
                )}

                {triggerEvent === "STATUS_CHANGED" && (
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Target Admission Stage</label>
                    <select
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value)}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#0F3D33] dark:focus:border-[#4FB89A]"
                    >
                      <option value="CAMPUS_VISIT">Campus Visit</option>
                      <option value="APPLICATION_SUBMITTED">Application Submitted</option>
                      <option value="ADMITTED">Admitted</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Automated Action (THEN)</label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#0F3D33] dark:focus:border-[#4FB89A]"
                  >
                    <option value="NOTIFY_COUNSELOR">Notify assigned counselor with urgent task</option>
                    <option value="SEND_EMAIL">Dispatch automated email template</option>
                    <option value="SEND_WHATSAPP">Dispatch automated WhatsApp template</option>
                    <option value="UPDATE_STATUS">Transition pipeline stage</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 rounded-[8px] border border-border text-foreground hover:bg-[#EDE6DA]/50 dark:hover:bg-[#1F2723] text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-[8px] bg-[#0F3D33] dark:bg-[#4FB89A] text-[#F6F2EA] dark:text-[#0F1412] text-xs font-medium shadow-xs"
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

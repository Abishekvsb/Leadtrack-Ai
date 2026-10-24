"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/components/toast-context";
import {
  CalendarCheck2,
  Calendar,
  Clock,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ChevronRight,
  List,
  CalendarDays,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { formatDate, formatDateTime, timeAgo } from "@/lib/utils";

export default function FollowUpsPage() {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<"ALL" | "TODAY" | "OVERDUE" | "UPCOMING" | "COMPLETED">("TODAY");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [counts, setCounts] = useState({ all: 0, today: 0, overdue: 0, upcoming: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  // Complete / Reschedule Modal
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [modalMode, setModalMode] = useState<"complete" | "reschedule" | "create" | null>(null);
  const [outcomeNote, setOutcomeNote] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");

  // Create Task State
  const [leads, setLeads] = useState<any[]>([]);
  const [newLeadId, setNewLeadId] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newType, setNewType] = useState("CALL");
  const [newPriority, setNewPriority] = useState("MEDIUM");
  const [newNotes, setNewNotes] = useState("");

  const loadFollowUps = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/follow-ups?filter=${activeTab}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setFollowUps(json.data.followUps || []);
          setCounts(json.data.counts);
        }
      }
    } catch {
      error("Failed to load follow-ups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowUps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    async function loadLeadsList() {
      try {
        const res = await fetch("/api/leads?limit=100");
        if (res.ok) {
          const json = await res.json();
          if (json.success) setLeads(json.data.leads || []);
        }
      } catch {}
    }
    loadLeadsList();
  }, []);

  // Complete Task
  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    try {
      const res = await fetch("/api/follow-ups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedTask.id,
          status: "COMPLETED",
          outcome: outcomeNote || "Follow-up consultation successfully conducted.",
        }),
      });
      if (res.ok) {
        success("Consultation logged & task resolved");
        setModalMode(null);
        setSelectedTask(null);
        setOutcomeNote("");
        loadFollowUps();
      }
    } catch {
      error("Failed to update task");
    }
  };

  // Reschedule Task
  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !rescheduleDate) return;
    try {
      const res = await fetch("/api/follow-ups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedTask.id,
          scheduledAt: rescheduleDate,
          status: "PENDING",
        }),
      });
      if (res.ok) {
        success("Task rescheduled in admissions calendar");
        setModalMode(null);
        setSelectedTask(null);
        setRescheduleDate("");
        loadFollowUps();
      }
    } catch {
      error("Failed to reschedule task");
    }
  };

  // Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadId || !newDate) return;
    try {
      const res = await fetch("/api/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: newLeadId,
          scheduledAt: newDate,
          type: newType,
          priority: newPriority,
          notes: newNotes,
        }),
      });
      if (res.ok) {
        success("Follow-up appointment booked");
        setModalMode(null);
        setNewLeadId("");
        setNewDate("");
        setNewNotes("");
        loadFollowUps();
      }
    } catch {
      error("Failed to create task");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
              Admissions Outreach
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
              Counselor Tasks &amp; Schedule
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Pending consultations, scheduled campus walkthroughs, and admissions outreach deadlines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-[8px] bg-card border border-border shadow-xs">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-[6px] text-xs font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-[#D62828] text-white dark:bg-[#FF5A5F] dark:text-[#120A0C] font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`p-1.5 rounded-[6px] text-xs font-medium transition-colors ${
                  viewMode === "calendar"
                    ? "bg-[#D62828] text-white dark:bg-[#FF5A5F] dark:text-[#120A0C] font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Calendar Timeline"
              >
                <CalendarDays className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setModalMode("create")}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold text-xs shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Outreach</span>
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: "TODAY", label: "Due Today", count: counts.today },
            { key: "OVERDUE", label: "Overdue", count: counts.overdue },
            { key: "UPCOMING", label: "Upcoming", count: counts.upcoming },
            { key: "ALL", label: "All Tasks", count: counts.all },
            { key: "COMPLETED", label: "Resolved", count: counts.completed },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-[8px] text-xs font-medium whitespace-nowrap transition-all border ${
                activeTab === tab.key
                  ? "bg-[#D62828] text-white border-[#D62828] dark:bg-[#FF5A5F] dark:text-[#120A0C] dark:border-[#FF5A5F] font-bold shadow-xs"
                  : "bg-card border-border text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-[4px] font-mono text-[10px] tabular-nums ${
                  activeTab === tab.key
                    ? "bg-white/20 text-white dark:bg-black/20 dark:text-[#0F1412]"
                    : "bg-[#F8F2E6] dark:bg-[#1B1114] text-muted-foreground border border-border"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#D62828] dark:text-[#FF5A5F] mx-auto" />
            <p className="font-heading italic text-xs text-muted-foreground">Accessing outreach calendar...</p>
          </div>
        ) : followUps.length === 0 ? (
          <div className="p-12 rounded-[12px] bg-card border border-border text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#D62828] dark:text-[#FF5A5F] mx-auto stroke-[1.5]" />
            <h3 className="font-heading text-lg font-normal text-foreground">No tasks scheduled in this filter</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Your admissions queue is up to date. Schedule a consultation call or campus visit using the action above.
            </p>
          </div>
        ) : viewMode === "list" ? (
          <div className="rounded-[12px] bg-card border border-border shadow-xs divide-y divide-border">
            {followUps.map((task) => {
              const isOverdue = new Date(task.scheduledAt) < new Date() && task.status === "PENDING";

              return (
                <div
                  key={task.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FFF9EE]/70 dark:hover:bg-[#27191E]/60 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 border ${
                        task.status === "COMPLETED"
                          ? "bg-[#16A34A]/10 text-[#16A34A] dark:text-[#4ADE80] border-[#16A34A]/25"
                          : isOverdue
                          ? "bg-[#C4552F]/10 text-[#C4552F] border-[#C4552F]/30"
                          : "bg-[#FFC21A]/15 text-[#8A5A00] dark:text-[#FFD25A] border-[#FFC21A]/35 font-bold"
                      }`}
                    >
                      <PhoneCall className="w-4 h-4 stroke-[1.5]" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/leads/${task.lead.id}`}
                          className="font-heading text-sm font-normal text-foreground hover:text-[#D62828] dark:hover:text-[#FF5A5F] transition-colors"
                        >
                          {task.lead.studentName}
                        </Link>
                        <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono uppercase bg-[#F8F2E6] dark:bg-[#1B1114] text-muted-foreground border border-border">
                          {task.type}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono uppercase border ${
                            task.priority === "HIGH" || task.priority === "URGENT"
                              ? "bg-[#C4552F]/10 text-[#C4552F] border-[#C4552F]/20"
                              : "bg-[#F8F2E6] dark:bg-[#1B1114] text-muted-foreground border-border"
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {task.notes || "General admissions follow-up consultation"}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-0.5 font-mono">
                        <span className="flex items-center gap-1 tabular-nums">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(task.scheduledAt)}
                        </span>
                        <span>•</span>
                        <span className="tabular-nums">Lead Score: {task.lead.score} / 100</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {task.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setModalMode("complete");
                          }}
                          className="min-h-[38px] px-3.5 py-1.5 rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold text-xs shadow-xs transition-colors flex items-center justify-center"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setModalMode("reschedule");
                          }}
                          className="min-h-[38px] px-3.5 py-1.5 rounded-[8px] border border-border bg-card text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] text-xs font-medium transition-colors flex items-center justify-center"
                        >
                          Reschedule
                        </button>
                      </>
                    )}
                    <Link
                      href={`/leads/${task.lead.id}`}
                      className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-[8px] border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] transition-colors"
                      title="Open Candidate Dossier"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Calendar View Timeline */
          <div className="p-6 rounded-[12px] bg-card border border-border shadow-xs space-y-4">
            <h3 className="font-heading text-base font-normal text-foreground">Chronological Outreach Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {followUps.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-[10px] bg-[#F8F2E6]/60 dark:bg-[#1B1114]/60 border border-border space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[#D62828] dark:text-[#FF5A5F] text-xs font-semibold tabular-nums">
                      {formatDate(task.scheduledAt)}
                    </span>
                    <span className="text-[10px] uppercase text-muted-foreground">{task.type}</span>
                  </div>
                  <Link href={`/leads/${task.lead.id}`} className="font-heading text-sm font-normal text-foreground block hover:underline">
                    {task.lead.studentName}
                  </Link>
                  <p className="text-muted-foreground text-[11px] line-clamp-2 leading-relaxed">
                    {task.notes || "Admissions consultation"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Complete Task */}
        {modalMode === "complete" && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-card rounded-[12px] p-6 shadow-academic-floating border border-border space-y-4">
              <h3 className="font-heading text-base font-normal text-foreground">
                Resolve Task for {selectedTask.lead.studentName}
              </h3>
              <form onSubmit={handleComplete} className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Consultation Outcome Summary</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Candidate confirmed scholarship criteria, campus tour scheduled for next week..."
                    value={outcomeNote}
                    onChange={(e) => setOutcomeNote(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-3 py-1.5 rounded-[8px] border border-border text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold shadow-xs"
                  >
                    Mark Resolved
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Reschedule Task */}
        {modalMode === "reschedule" && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-card rounded-[12px] p-6 shadow-academic-floating border border-border space-y-4">
              <h3 className="font-heading text-base font-normal text-foreground">Reschedule Appointment</h3>
              <form onSubmit={handleReschedule} className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">New Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-3 py-1.5 rounded-[8px] border border-border text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold shadow-xs"
                  >
                    Confirm New Time
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Create Task */}
        {modalMode === "create" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-md bg-card rounded-[12px] p-6 shadow-academic-floating border border-border space-y-4">
              <h3 className="font-heading text-base font-normal text-foreground">Schedule Outreach Task</h3>
              <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Select Candidate *</label>
                  <select
                    required
                    value={newLeadId}
                    onChange={(e) => setNewLeadId(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                  >
                    <option value="">Select Candidate File</option>
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.studentName} ({l.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Action Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    >
                      <option value="CALL">Phone Call</option>
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="CAMPUS_TOUR">Campus Walkthrough</option>
                      <option value="EMAIL">Email</option>
                      <option value="MEETING">Meeting</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Directive &amp; Objectives</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Call regarding merit scholarship quota and application submission..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-3 py-1.5 rounded-[8px] border border-border text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold shadow-xs"
                  >
                    Schedule
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

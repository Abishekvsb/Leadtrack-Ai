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
          outcome: outcomeNote || "Follow-up resolved successfully.",
        }),
      });
      if (res.ok) {
        success("Task marked complete");
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
        success("Task rescheduled");
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
    if (!newLeadId || !newDate) {
      error("Lead and Date are required");
      return;
    }
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
        success("Follow-up task created");
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
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Counselor Follow-up Queue
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Scheduled calls, campus walkthroughs, and automated enquiry SLAs
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg text-xs font-semibold ${
                  viewMode === "list" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-900"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`p-1.5 rounded-lg text-xs font-semibold ${
                  viewMode === "calendar" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-900"
                }`}
                title="Calendar Timeline"
              >
                <CalendarDays className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setModalMode("create")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Follow-up</span>
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: "TODAY", label: "Due Today", count: counts.today, color: "text-amber-600 bg-amber-500/10" },
            { key: "OVERDUE", label: "Overdue", count: counts.overdue, color: "text-rose-600 bg-rose-500/10" },
            { key: "UPCOMING", label: "Upcoming", count: counts.upcoming, color: "text-indigo-600 bg-indigo-500/10" },
            { key: "ALL", label: "All Tasks", count: counts.all, color: "text-slate-600 bg-slate-500/10" },
            { key: "COMPLETED", label: "Resolved", count: counts.completed, color: "text-emerald-600 bg-emerald-500/10" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.key ? "bg-white/20 text-white" : tab.color
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
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
            <p className="text-xs text-slate-400">Loading follow-ups...</p>
          </div>
        ) : followUps.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-sm">No tasks in this category</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your queue is clean! Use the button above to schedule a new call or student campus walkthrough.
            </p>
          </div>
        ) : viewMode === "list" ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
            {followUps.map((task) => {
              const isOverdue = new Date(task.scheduledAt) < new Date() && task.status === "PENDING";

              return (
                <div
                  key={task.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        task.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : isOverdue
                          ? "bg-rose-500/10 text-rose-600"
                          : "bg-indigo-500/10 text-indigo-600"
                      }`}
                    >
                      <PhoneCall className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/leads/${task.lead.id}`}
                          className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                        >
                          {task.lead.studentName}
                        </Link>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {task.type}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            task.priority === "HIGH" || task.priority === "URGENT"
                              ? "bg-rose-500/10 text-rose-600"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {task.notes || "General admissions follow-up"}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDateTime(task.scheduledAt)}
                        </span>
                        <span>•</span>
                        <span>Lead Score: {task.lead.score} / 100</span>
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
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setModalMode("reschedule");
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
                        >
                          Reschedule
                        </button>
                      </>
                    )}
                    <Link
                      href={`/leads/${task.lead.id}`}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-400 hover:text-slate-800"
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
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm">Chronological Schedule Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {followUps.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-indigo-600 dark:text-indigo-400">{formatDate(task.scheduledAt)}</span>
                    <span className="text-[10px] text-slate-400">{task.type}</span>
                  </div>
                  <Link href={`/leads/${task.lead.id}`} className="font-semibold block hover:underline">
                    {task.lead.studentName}
                  </Link>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-2">
                    {task.notes || "Follow-up"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Complete Task */}
        {modalMode === "complete" && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-sm">Resolve Task for {selectedTask.lead.studentName}</h3>
              <form onSubmit={handleComplete} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold">Call / Meeting Outcome Note</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Student answered, confirmed campus visit for Saturday..."
                    value={outcomeNote}
                    onChange={(e) => setOutcomeNote(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-3 py-1.5 rounded-xl border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-sm">Reschedule Task</h3>
              <form onSubmit={handleReschedule} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold">New Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-3 py-1.5 rounded-xl border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold"
                  >
                    Save New Time
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Create Task */}
        {modalMode === "create" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-sm">Schedule Follow-up Task</h3>
              <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold">Select Student Lead *</label>
                  <select
                    required
                    value={newLeadId}
                    onChange={(e) => setNewLeadId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="">Choose Student</option>
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.studentName} ({l.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold">Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold">Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    >
                      <option value="CALL">Phone Call</option>
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="CAMPUS_TOUR">Campus Walkthrough</option>
                      <option value="EMAIL">Email</option>
                      <option value="MEETING">Meeting</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold">Task Objective</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Call student regarding merit scholarship offer..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-3 py-1.5 rounded-xl border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold"
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

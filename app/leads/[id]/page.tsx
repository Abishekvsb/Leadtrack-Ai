"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/components/toast-context";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  FileText,
  Upload,
  AlertCircle,
  TrendingUp,
  User,
  MapPin,
  ChevronRight,
  BookOpen,
  Pin,
  PhoneCall,
  Flame,
  HelpCircle,
  X,
  ExternalLink,
  Loader2,
  GitMerge,
} from "lucide-react";
import { STATUS_COLORS, STATUS_LABELS, SCORE_COLORS, LeadStatus, ScoreCategory } from "@/lib/types";
import { formatCurrency, formatDate, formatDateTime, timeAgo } from "@/lib/utils";

const PIPELINE_STAGES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "CAMPUS_VISIT",
  "APPLICATION_SUBMITTED",
  "ADMITTED",
];

export default function LeadDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { success, error, info } = useToast();

  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [counselors, setCounselors] = useState<any[]>([]);

  // Modals & Panels
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicateLead, setDuplicateLead] = useState<any>(null);

  // Notes state
  const [noteContent, setNoteContent] = useState("");
  const [noteIsPinned, setNoteIsPinned] = useState(false);
  const [submittingNote, setSubmittingNote] = useState(false);

  // Call log state
  const [callOutcome, setCallOutcome] = useState("Connected - Expressed Interest");
  const [callNotes, setCallNotes] = useState("");

  // Follow-up state
  const [fuDate, setFuDate] = useState("");
  const [fuType, setFuType] = useState("CALL");
  const [fuPriority, setFuPriority] = useState("MEDIUM");
  const [fuNotes, setFuNotes] = useState("");

  // Document state
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("12th Marksheet PDF");

  // Email modal state
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // Fetch lead data
  const loadLead = async () => {
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.lead) {
          setLead(json.data.lead);
          checkForDuplicates(json.data.lead.email, json.data.lead.phone, json.data.lead.id);
        } else {
          error("Lead not found");
          router.push("/leads");
        }
      }
    } catch {
      error("Failed to load lead details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLead();
  }, [id]);

  // Load aux templates, courses, team
  useEffect(() => {
    async function loadAux() {
      try {
        const [tRes, cRes, uRes] = await Promise.all([
          fetch("/api/templates"),
          fetch("/api/courses"),
          fetch("/api/team"),
        ]);
        if (tRes.ok) {
          const tJson = await tRes.json();
          if (tJson.success) setTemplates(tJson.data.templates || []);
        }
        if (cRes.ok) {
          const cJson = await cRes.json();
          if (cJson.success) setCourses(cJson.data.courses || []);
        }
        if (uRes.ok) {
          const uJson = await uRes.json();
          if (uJson.success) setCounselors(uJson.data.users || []);
        }
      } catch {}
    }
    loadAux();
  }, []);

  // Check for duplicates
  const checkForDuplicates = async (email: string, phone: string, excludeId: string) => {
    try {
      const res = await fetch("/api/leads/check-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, excludeId }),
      });
      const data = await res.json();
      if (data.success && data.hasDuplicate) {
        setDuplicateLead(data.data.duplicate);
      }
    } catch {}
  };

  // Status Stepper Change
  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        success(`Lead moved to ${STATUS_LABELS[newStatus as LeadStatus] || newStatus}`);
        loadLead();
      } else {
        error(data.error);
      }
    } catch {
      error("Failed to update status");
    }
  };

  // Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setSubmittingNote(true);
    try {
      const res = await fetch(`/api/leads/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent, isPinned: noteIsPinned }),
      });
      const data = await res.json();
      if (data.success) {
        success("Counselor note saved");
        setNoteContent("");
        setNoteIsPinned(false);
        loadLead();
      }
    } catch {
      error("Failed to add note");
    } finally {
      setSubmittingNote(false);
    }
  };

  // Log Outbound Call
  const handleLogCall = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/leads/${id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CALL_LOGGED",
          title: `Call: ${callOutcome}`,
          description: callNotes || "Outbound phone consultation completed.",
        }),
      });
      if (res.ok) {
        success("Call recorded in timeline");
        setCallModalOpen(false);
        setCallNotes("");
        loadLead();
      }
    } catch {
      error("Failed to log call");
    }
  };

  // Schedule Follow-Up
  const handleScheduleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fuDate) {
      error("Please pick a scheduled date");
      return;
    }
    try {
      const res = await fetch("/api/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: id,
          scheduledAt: fuDate,
          type: fuType,
          priority: fuPriority,
          notes: fuNotes,
        }),
      });
      if (res.ok) {
        success("Follow-up task scheduled");
        setFollowUpModalOpen(false);
        setFuNotes("");
        loadLead();
      }
    } catch {
      error("Failed to schedule task");
    }
  };

  // Upload Document
  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;
    try {
      const res = await fetch(`/api/leads/${id}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: docName,
          fileType: docType,
          fileSize: "1.4 MB",
        }),
      });
      if (res.ok) {
        success("Document metadata registered");
        setDocModalOpen(false);
        setDocName("");
        loadLead();
      }
    } catch {
      error("Failed to add document");
    }
  };

  // Merge Duplicate Leads
  const handleMerge = async () => {
    if (!duplicateLead) return;
    try {
      const res = await fetch("/api/leads/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetLeadId: lead.id,
          sourceLeadId: duplicateLead.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        success("Duplicate enquiry records successfully merged!");
        setDuplicateModalOpen(false);
        setDuplicateLead(null);
        loadLead();
      } else {
        error(data.error);
      }
    } catch {
      error("Merge failed");
    }
  };

  // Template selection in email modal
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = templates.find((t) => t.id === templateId);
    if (tmpl) {
      let subj = tmpl.subject || "";
      let body = tmpl.body || "";
      // Replace variables
      subj = subj.replace(/{{name}}/g, lead.studentName).replace(/{{course}}/g, lead.course?.name || "Program");
      body = body
        .replace(/{{name}}/g, lead.studentName)
        .replace(/{{course}}/g, lead.course?.name || "Program")
        .replace(/{{counselor}}/g, lead.assignedTo?.name || "Admissions Office")
        .replace(/{{institution}}/g, "Apex Institute");
      setEmailSubject(subj);
      setEmailBody(body);
    }
  };

  // Send Email Action
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/leads/${id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "EMAIL_SENT",
          title: `Email Dispatched: ${emailSubject}`,
          description: emailBody.slice(0, 150) + "...",
        }),
      });
      success(`Email dispatched to ${lead.email}`);
      setEmailModalOpen(false);
      loadLead();
    } catch {
      error("Failed to send email");
    }
  };

  if (loading || !lead) {
    return (
      <DashboardLayout>
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-xs text-slate-400">Loading student dossier...</p>
        </div>
      </DashboardLayout>
    );
  }

  const scoreInfo = SCORE_COLORS[lead.scoreCategory as ScoreCategory] || SCORE_COLORS.WARM;
  const statusInfo = STATUS_COLORS[lead.status as LeadStatus] || STATUS_COLORS.NEW;

  // Score breakdown JSON
  let scoreBreakdown: any = {};
  try {
    scoreBreakdown = JSON.parse(lead.scoreBreakdown || "{}");
  } catch {}

  const currentStageIndex = PIPELINE_STAGES.indexOf(lead.status as LeadStatus);

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-16">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/leads"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Leads Registry</span>
          </Link>

          {/* Duplicate Banner Alert */}
          {duplicateLead && (
            <button
              onClick={() => setDuplicateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-all animate-pulse"
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Potential Duplicate Detected: {duplicateLead.studentName} (Click to Merge)</span>
            </button>
          )}
        </div>

        {/* Lead Header Profile & Quick Action Bar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/25">
              {lead.studentName.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {lead.studentName}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                  {STATUS_LABELS[lead.status as LeadStatus] || lead.status}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-medium">
                  via {lead.leadSource}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {lead.city} {lead.state ? `, ${lead.state}` : ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  {lead.course?.name || "General Degree Enquiry"}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Counselor: {lead.assignedTo?.name || "Unassigned"}
                </span>
              </div>
            </div>
          </div>

          {/* One-Click Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            {/* 1-Click WhatsApp */}
            <a
              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                `Hello ${lead.studentName}! This is ${lead.assignedTo?.name || "Admissions"} from Apex Institute regarding your enquiry for ${lead.course?.name || "our programs"}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* 1-Click Call */}
            <button
              onClick={() => setCallModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Log Call</span>
            </button>

            {/* 1-Click Email */}
            <button
              onClick={() => {
                if (templates.length > 0) handleSelectTemplate(templates[0].id);
                setEmailModalOpen(true);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Email</span>
            </button>

            {/* Schedule Follow-up */}
            <button
              onClick={() => setFollowUpModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Task</span>
            </button>
          </div>
        </div>

        {/* Status Stepper Progression */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500 uppercase tracking-wider">
              Admission Pipeline Stage
            </span>
            <span className="text-slate-400">Click any stage to transition lead</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {PIPELINE_STAGES.map((st, idx) => {
              const isPast = currentStageIndex > idx;
              const isCurrent = lead.status === st;

              return (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`p-3 rounded-2xl text-left border transition-all text-xs flex flex-col justify-between h-20 ${
                    isCurrent
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25"
                      : isPast
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/60 text-slate-500 hover:border-indigo-400"
                  }`}
                >
                  <span className="font-bold text-[10px] uppercase opacity-75">Step 0{idx + 1}</span>
                  <span className="font-semibold truncate">{STATUS_LABELS[st]}</span>
                  {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 self-end" />}
                  {isCurrent && <span className="text-[10px] font-bold self-end underline">Active</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Lead Intelligence & Next Best Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Score Gauge Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                AI Lead Intent Score
              </span>
              <button
                onClick={() => setScoreModalOpen(true)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Why this score?</span>
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="my-4 flex items-center justify-around">
              {/* Score Gauge Circle */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      lead.score >= 75
                        ? "text-emerald-500"
                        : lead.score >= 45
                        ? "text-amber-500"
                        : "text-slate-400"
                    }
                    strokeDasharray={`${lead.score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold tracking-tight">{lead.score}</span>
                  <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Category</span>
                  <p className={`font-bold text-sm ${scoreInfo.text}`}>{lead.scoreCategory}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Conversion Likelihood</span>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {lead.conversionProbability}%
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Engagement Level</span>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{lead.engagementLevel}</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-600 dark:text-slate-400">
              Evaluated across {lead.activities?.length || 0} interaction logs, source authority, and program demand.
            </div>
          </div>

          {/* Next Best Action Card */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-indigo-900 via-indigo-950 to-purple-950 text-white shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Recommendation Engine</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">Recommended Next Best Action</h3>
              <p className="text-indigo-100 text-sm leading-relaxed max-w-2xl">
                &ldquo;{lead.nextBestAction}&rdquo;
              </p>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-indigo-800/60 text-xs text-indigo-300">
              <span>Counselor SLA: Within 4 hours of enquiry</span>
              <button
                onClick={() => setCallModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-colors shadow-md"
              >
                Execute Action Now →
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Tabs / Panels: Overview, Notes, Timeline, Documents, Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Student Details & Guardian Info */}
          <div className="space-y-6">
            {/* Student Info Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Profile &amp; Contact Information
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Full Name</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{lead.studentName}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Primary Phone</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{lead.phone}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Email Address</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{lead.email}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Parent / Guardian Name</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {lead.parentName || "Not provided"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Parent Phone</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {lead.parentPhone || "Not provided"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">City &amp; State</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {lead.city} {lead.state ? `, ${lead.state}` : ""}
                  </p>
                </div>
                {lead.message && (
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Student Message</span>
                    <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {lead.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Documents Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm">Application Documents</h3>
                <button
                  onClick={() => setDocModalOpen(true)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach</span>
                </button>
              </div>

              <div className="space-y-2">
                {(lead.documents || []).length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No documents uploaded yet.</p>
                ) : (
                  lead.documents.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="font-semibold truncate">{doc.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{doc.fileSize}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Center & Right Columns: Notes & Live Activity Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Counselor Discussion Notes */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
              <h3 className="font-bold text-sm">Counselor Discussion Notes</h3>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  placeholder="Record call summary, scholarship queries, student preferences, or parent questions..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:border-indigo-500 resize-none"
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noteIsPinned}
                      onChange={(e) => setNoteIsPinned(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    <span>Pin note to top</span>
                  </label>

                  <button
                    type="submit"
                    disabled={submittingNote || !noteContent.trim()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors disabled:opacity-50"
                  >
                    {submittingNote ? "Saving..." : "Post Note"}
                  </button>
                </div>
              </form>

              {/* Existing Notes Feed */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                {(lead.notes || []).length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No counselor notes yet.</p>
                ) : (
                  lead.notes.map((note: any) => (
                    <div
                      key={note.id}
                      className={`p-4 rounded-2xl text-xs space-y-2 border ${
                        note.isPinned
                          ? "bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/60"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {note.author?.name || "Counselor"}
                        </span>
                        <div className="flex items-center gap-2">
                          {note.isPinned && (
                            <span className="flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                              <Pin className="w-3 h-3" /> Pinned
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">{timeAgo(note.createdAt)}</span>
                        </div>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Activity History Timeline */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
              <h3 className="font-bold text-sm">Lifecycle Activity Timeline</h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {(lead.activities || []).map((act: any) => (
                  <div key={act.id} className="relative space-y-1">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{act.title}</span>
                      <span className="text-[10px] text-slate-400">{timeAgo(act.createdAt)}</span>
                    </div>
                    {act.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {act.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Why This Score? Breakdown */}
        {scoreModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-base">Mathematical AI Score Breakdown</h3>
                </div>
                <button onClick={() => setScoreModalOpen(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {Object.entries(scoreBreakdown).map(([key, factor]: [string, any]) => (
                  <div
                    key={key}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {factor.score !== undefined ? `${factor.score} / ${factor.max} pts` : factor}
                      </span>
                    </div>
                    {factor.reason && <p className="text-slate-500 text-[11px]">{factor.reason}</p>}
                  </div>
                ))}
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setScoreModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Log Outbound Call */}
        {callModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm">Log Phone Call with {lead.studentName}</h3>
                <button onClick={() => setCallModalOpen(false)} className="text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleLogCall} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold">Call Outcome</label>
                  <select
                    value={callOutcome}
                    onChange={(e) => setCallOutcome(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="Connected - Expressed Keen Interest">Connected - Expressed Keen Interest</option>
                    <option value="Connected - Campus Visit Booked">Connected - Campus Visit Booked</option>
                    <option value="Connected - Requested Fee Structure">Connected - Requested Fee Structure</option>
                    <option value="No Answer / Switched Off">No Answer / Switched Off</option>
                    <option value="Call Back Later">Call Back Later</option>
                    <option value="Wrong Number">Wrong Number</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold">Discussion Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what was discussed during the call..."
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCallModalOpen(false)}
                    className="px-4 py-2 rounded-xl border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Save Call Log
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Send Email */}
        {emailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm">Send Email to {lead.studentName}</h3>
                <button onClick={() => setEmailModalOpen(false)} className="text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold">Quick Template</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => handleSelectTemplate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="">Custom Email</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold">Subject Line</label>
                  <input
                    type="text"
                    required
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold">Email Body</label>
                  <textarea
                    rows={6}
                    required
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none font-mono text-[11px]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEmailModalOpen(false)}
                    className="px-4 py-2 rounded-xl border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  >
                    Dispatch Email
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Schedule Follow-Up */}
        {followUpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm">Schedule Follow-up Task</h3>
                <button onClick={() => setFollowUpModalOpen(false)} className="text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleScheduleFollowUp} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold">Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={fuDate}
                    onChange={(e) => setFuDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold">Type</label>
                    <select
                      value={fuType}
                      onChange={(e) => setFuType(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    >
                      <option value="CALL">Phone Call</option>
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="CAMPUS_TOUR">Campus Tour</option>
                      <option value="EMAIL">Email</option>
                      <option value="MEETING">In-person Meeting</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold">Priority</label>
                    <select
                      value={fuPriority}
                      onChange={(e) => setFuPriority(e.target.value)}
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
                  <label className="font-semibold">Task Objective / Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Call regarding scholarship document submission..."
                    value={fuNotes}
                    onChange={(e) => setFuNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setFollowUpModalOpen(false)}
                    className="px-4 py-2 rounded-xl border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Document Attachment */}
        {docModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-sm">Register Document Attachment</h3>
              <form onSubmit={handleUploadDoc} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold">Document Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12th Grade Marksheet"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold">Document Category</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="12th Marksheet PDF">12th Marksheet PDF</option>
                    <option value="Entrance Score Card">Entrance Score Card</option>
                    <option value="Identity Proof (Aadhaar/Passport)">Identity Proof (Aadhaar/Passport)</option>
                    <option value="Scholarship Application Form">Scholarship Application Form</option>
                    <option value="Transfer Certificate">Transfer Certificate</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDocModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold"
                  >
                    Save Document
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Merge Duplicate Leads */}
        {duplicateModalOpen && duplicateLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <GitMerge className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Duplicate Lead Merge Assistant</h3>
                  <p className="text-xs text-slate-400">Consolidate redundant student enquiries into one clean record</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-2">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Target (Keep): {lead.studentName} ({lead.email})
                </p>
                <p className="font-bold text-slate-500 dark:text-slate-400">
                  Source (Merge &amp; Archive): {duplicateLead.studentName} ({duplicateLead.email})
                </p>
                <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                  All activity history, counselor notes, and follow-up tasks from the duplicate will be automatically transferred
                  to this lead.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDuplicateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleMerge}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md"
                >
                  Confirm &amp; Merge Records
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

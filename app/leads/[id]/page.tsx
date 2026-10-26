"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/components/toast-context";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { LeadScoreStamp, ScoreDial } from "@/components/ui/design-system";
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
  HelpCircle,
  X,
  ExternalLink,
  Loader2,
  GitMerge,
  GraduationCap,
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
  const { success, error } = useToast();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      } catch (err) {
        console.error("Aux loading failed", err);
      }
    }
    loadAux();
  }, []);

  // Check for duplicates
  const checkForDuplicates = async (email: string, phone: string, currentId: string) => {
    try {
      const q = new URLSearchParams({ email, phone, excludeId: currentId });
      const res = await fetch(`/api/leads/check-duplicate?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.duplicate) {
          setDuplicateLead(data.data.duplicate);
        }
      }
    } catch {}
  };

  // Merge duplicate
  const handleMerge = async () => {
    if (!duplicateLead) return;
    try {
      const res = await fetch("/api/leads/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primaryLeadId: lead.id, duplicateLeadId: duplicateLead.id }),
      });
      const data = await res.json();
      if (data.success) {
        success("Candidate records merged successfully!");
        setDuplicateModalOpen(false);
        setDuplicateLead(null);
        loadLead();
      } else {
        error(data.error);
      }
    } catch {
      error("Merge operation failed");
    }
  };

  // Status Change
  const handleStatusChange = async (newStatus: LeadStatus) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        success(`Admissions stage advanced to: ${STATUS_LABELS[newStatus]}`);
        setLead(data.data.lead);
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
        success("Counselor observation added to dossier");
        setNoteContent("");
        setNoteIsPinned(false);
        loadLead();
      } else {
        error(data.error);
      }
    } catch {
      error("Failed to post note");
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
          title: `Call Logged: ${callOutcome}`,
          description: callNotes || "Outbound phone consultation recorded by counselor.",
        }),
      });
      if (res.ok) {
        success("Phone consultation logged in dossier");
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
    try {
      const res = await fetch(`/api/follow-ups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
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
        setFuDate("");
        loadLead();
      }
    } catch {
      error("Failed to schedule follow-up");
    }
  };

  // Attach Document
  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/leads/${id}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: docName,
          category: docType,
          fileUrl: "https://leadtrack.institution.edu/docs/sample.pdf",
          fileSize: "1.2 MB",
        }),
      });
      if (res.ok) {
        success("Academic document attached to dossier");
        setDocModalOpen(false);
        setDocName("");
        loadLead();
      }
    } catch {
      error("Failed to attach document");
    }
  };

  // Email Template Select
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = templates.find((t) => t.id === templateId);
    if (tmpl) {
      setEmailSubject(
        tmpl.subject
          .replace("{{studentName}}", lead.studentName)
          .replace("{{courseName}}", lead.course?.name || "our program")
      );
      setEmailBody(
        tmpl.body
          .replace(/{{studentName}}/g, lead.studentName)
          .replace(/{{courseName}}/g, lead.course?.name || "your requested program")
          .replace(/{{counselorName}}/g, lead.assignedTo?.name || "Admissions Committee")
      );
    }
  };

  // Send Email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/leads/${id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "EMAIL_SENT",
          title: `Email Dispatched: ${emailSubject}`,
          description: emailBody.slice(0, 200) + "...",
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
          <Loader2 className="w-6 h-6 animate-spin text-[#D62828] dark:text-[#FF5A5F] mx-auto" />
          <p className="font-serif italic text-xs text-muted-foreground">Retrieving candidate dossier...</p>
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
      <div className="space-y-6 pb-16 max-w-7xl mx-auto">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/leads"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Admissions Registry</span>
          </Link>

          {/* Duplicate Banner Alert */}
          {duplicateLead && (
            <button
              onClick={() => setDuplicateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#FFC21A]/15 border border-[#FFC21A]/35 text-[#8A5A00] dark:text-[#FFD25A] text-xs font-bold hover:bg-[#FFC21A]/25 transition-all"
            >
              <GitMerge className="w-3.5 h-3.5 text-[#FFC21A]" />
              <span>Duplicate Record Detected: {duplicateLead.studentName} (Click to Merge)</span>
            </button>
          )}
        </div>

        {/* Lead Header Profile & Quick Action Bar (Student Card Dossier Header) */}
        <div className="p-6 sm:p-8 rounded-[14px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-[10px] bg-gradient-to-br from-[#D62828] to-[#8F1218] text-white font-heading font-bold text-xl flex items-center justify-center shrink-0 border border-[#FFC21A]/30 shadow-xs">
              {lead.studentName.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight title-gold-accent pb-1">
                  {lead.studentName}
                </h1>
                <span className="inline-flex items-center gap-1.5 text-xs text-foreground font-medium">
                  <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                  <span>{STATUS_LABELS[lead.status as LeadStatus] || lead.status}</span>
                </span>
                <span className="px-2 py-0.5 rounded-[4px] bg-[#F8F2E6] dark:bg-[#1B1114] text-muted-foreground text-[10px] font-mono uppercase border border-border">
                  via {lead.leadSource}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground/80" />
                  {lead.city} {lead.state ? `, ${lead.state}` : ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-muted-foreground/80" />
                  {lead.course?.name || "General Degree Enquiry"}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground/80" />
                  Counselor: {lead.assignedTo?.name || "Unassigned"}
                </span>
              </div>
            </div>
          </div>

          {/* One-Click Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                `Hello ${lead.studentName}! This is ${lead.assignedTo?.name || "Admissions"} from ${lead.institution?.name || "our admissions office"} regarding your enquiry for ${lead.course?.name || "our programs"}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-[8px] bg-[#16A34A] text-white hover:bg-[#15803D] font-semibold text-xs shadow-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Log Call */}
            <button
              onClick={() => setCallModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-[8px] border border-border bg-card text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] font-medium text-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Log Call</span>
            </button>

            {/* Send Email */}
            <button
              onClick={() => {
                if (templates.length > 0) handleSelectTemplate(templates[0].id);
                setEmailModalOpen(true);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-[8px] border border-border bg-card text-foreground hover:hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] font-medium text-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Email</span>
            </button>

            {/* Schedule Task */}
            <button
              onClick={() => setFollowUpModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-[8px] border border-border bg-card text-foreground hover:hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] font-medium text-xs transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Task</span>
            </button>
          </div>
        </div>

        {/* Status Stepper Progression */}
        <div className="p-6 rounded-[14px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Admission Pipeline Progression
            </span>
            <span className="text-muted-foreground text-[11px]">Click any step to advance candidate stage</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {PIPELINE_STAGES.map((st, idx) => {
              const isPast = currentStageIndex > idx;
              const isCurrent = lead.status === st;

              return (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`p-3 rounded-[8px] text-left border transition-all text-xs flex flex-col justify-between h-20 ${
                    isCurrent
                      ? "bg-[#D62828] text-white border-[#D62828] dark:bg-[#FF5A5F] dark:text-[#120A0C] dark:border-[#FF5A5F] font-bold shadow-xs"
                      : isPast
                      ? "bg-[#FFF9EE]/80 dark:bg-[#1B1114]/80 border-border text-foreground"
                      : "bg-card border-border text-muted-foreground hover:border-[#FFC21A]/50"
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase opacity-75">Step 0{idx + 1}</span>
                  <span className="font-medium truncate">{STATUS_LABELS[st]}</span>
                  {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-[#D62828] dark:text-[#FF5A5F] self-end" />}
                  {isCurrent && <span className="font-mono text-[9px] uppercase tracking-widest self-end">Current</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Lead Intelligence & Next Best Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Score Official Stamp Card */}
          <div className="p-6 rounded-[14px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>AI Readiness Evaluation</span>
              </span>
              <button
                onClick={() => setScoreModalOpen(true)}
                className="text-xs text-[#D62828] dark:text-[#FF5A5F] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Scoring logic</span>
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="my-5 flex items-center justify-around gap-4">
              {/* Score Dial & Dossier Stamp */}
              <ScoreDial score={lead.score} size={100} strokeWidth={8} label="Intent Score" />

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-mono">Conversion Index</span>
                  <p className="font-mono text-base font-bold text-foreground tabular-nums">
                    {lead.conversionProbability}%
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-mono">Engagement</span>
                  <p className="font-medium text-xs text-foreground uppercase tracking-wider">
                    {lead.engagementLevel}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-mono">Activity Count</span>
                  <p className="font-mono text-xs text-foreground tabular-nums">
                    {lead.activities?.length || 0} events
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-[8px] bg-[#F8F2E6]/60 dark:bg-[#1B1114]/60 border border-border text-[11px] text-muted-foreground leading-relaxed">
              Synthesized from inbound channel reputation, student inquiries, academic preferences, and counselor touchpoints.
            </div>
          </div>

          {/* Next Best Action Card (Institutional Academic Brief) */}
          <div className="lg:col-span-2 p-6 sm:p-7 rounded-[12px] bg-gradient-to-br from-[#8F1218] via-[#D62828] to-[#B81E1E] text-white border border-[#FFC21A]/30 shadow-card flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-white/15 text-[#FFC21A] text-[11px] font-mono uppercase tracking-wider border border-white/20 font-bold">
                <Sparkles className="w-3 h-3 text-accent" />
                <span>Admissions Copilot Advisory</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-white tracking-tight">
                Recommended Next Step
              </h3>
              <p className="font-serif italic text-base sm:text-lg text-[#F6F2EA]/90 leading-relaxed max-w-2xl">
                &ldquo;{lead.nextBestAction}&rdquo;
              </p>
            </div>

            <div className="pt-5 flex items-center justify-between border-t border-white/10 text-xs text-[#F6F2EA]/70 mt-4">
              <span>Counselor Turnaround Target: 4 hrs</span>
              <button
                onClick={() => setCallModalOpen(true)}
                className="px-4 py-2 rounded-[8px] bg-[#FFC21A] text-[#17141A] font-bold text-xs hover:bg-[#E5A100] transition-colors shadow-xs"
              >
                Execute Consultation →
              </button>
            </div>
          </div>
        </div>

        {/* Two-Column Dossier Spread: Profile / Documents vs Notes & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Student Dossier Profile Card */}
          <div className="space-y-6">
            {/* Student Info Box */}
            <div className="p-6 rounded-[12px] bg-card border border-border shadow-xs space-y-4">
              <div className="pb-3 border-b border-border">
                <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Identity Record</div>
                <h3 className="font-serif text-base font-normal text-foreground">Candidate &amp; Family Dossier</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-mono">Full Name</span>
                  <p className="font-medium text-foreground mt-0.5">{lead.studentName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-mono">Primary Contact Phone</span>
                  <p className="font-mono text-xs text-foreground mt-0.5 tabular-nums">{lead.phone}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-mono">Email Address</span>
                  <p className="font-mono text-xs text-foreground mt-0.5">{lead.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-mono">Parent / Guardian Name</span>
                  <p className="font-medium text-foreground mt-0.5">{lead.parentName || "Not on file"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-mono">Parent Contact Phone</span>
                  <p className="font-mono text-xs text-foreground mt-0.5 tabular-nums">
                    {lead.parentPhone || "Not on file"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-mono">Location</span>
                  <p className="font-medium text-foreground mt-0.5">
                    {lead.city} {lead.state ? `, ${lead.state}` : ""}
                  </p>
                </div>
                {lead.message && (
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase font-mono">Initial Enquiry Message</span>
                    <p className="p-3 rounded-[8px] bg-[#F8F2E6]/60 dark:bg-[#1B1114]/60 border border-border text-foreground mt-1 text-xs leading-relaxed">
                      {lead.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Documents Box */}
            <div className="p-6 rounded-[12px] bg-card border border-border shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Credentials</div>
                  <h3 className="font-serif text-base font-normal text-foreground">Academic Records</h3>
                </div>
                <button
                  onClick={() => setDocModalOpen(true)}
                  className="text-xs text-[#D62828] dark:text-[#FF5A5F] font-medium hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach</span>
                </button>
              </div>

              <div className="space-y-2">
                {(lead.documents || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center font-serif italic">
                    No academic transcripts or documents uploaded.
                  </p>
                ) : (
                  lead.documents.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-[8px] bg-[#F8F2E6]/40 dark:bg-[#1B1114]/40 border border-border flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-foreground truncate">{doc.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">{doc.fileSize}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Center & Right Columns: Notes & Live Activity Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Counselor Discussion Notes */}
            <div className="p-6 rounded-[12px] bg-card border border-border shadow-xs space-y-4">
              <div className="pb-3 border-b border-border">
                <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Admissions Notes</div>
                <h3 className="font-serif text-base font-normal text-foreground">Counselor Observations &amp; Dialogue</h3>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  placeholder="Record consultation takeaways, scholarship eligibility, parent concerns, or candidate interests..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full p-3.5 rounded-[8px] bg-background/50 border border-border text-foreground placeholder:text-muted-foreground text-xs outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 resize-none"
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={noteIsPinned}
                      onChange={(e) => setNoteIsPinned(e.target.checked)}
                      className="rounded-[4px] border-border text-[#D62828] focus:ring-[#D62828]"
                    />
                    <span>Pin observation to top</span>
                  </label>

                  <button
                    type="submit"
                    disabled={submittingNote || !noteContent.trim()}
                    className="px-4 py-2 rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold text-xs shadow-xs transition-colors disabled:opacity-50 shadow-xs"
                  >
                    {submittingNote ? "Saving..." : "Record Note"}
                  </button>
                </div>
              </form>

              {/* Existing Notes Feed */}
              <div className="space-y-3 pt-3 border-t border-border">
                {(lead.notes || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center font-serif italic">
                    No counselor observations recorded yet.
                  </p>
                ) : (
                  lead.notes.map((note: any) => (
                    <div
                      key={note.id}
                      className={`p-4 rounded-[8px] text-xs space-y-2 border ${
                        note.isPinned
                          ? "bg-[#FFF9EE]/80 dark:bg-[#1B1114]/80 border-[#FFC21A]/50"
                          : "bg-background/40 border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {note.author?.name || "Counselor"}
                        </span>
                        <div className="flex items-center gap-2">
                          {note.isPinned && (
                            <span className="flex items-center gap-1 text-[10px] text-accent font-mono uppercase tracking-wider">
                              <Pin className="w-3 h-3" /> Pinned
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-muted-foreground">{timeAgo(note.createdAt)}</span>
                        </div>
                      </div>
                      <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Activity History Timeline */}
            <div className="p-6 rounded-[12px] bg-card border border-border shadow-xs space-y-4">
              <div className="pb-3 border-b border-border">
                <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Audit Log</div>
                <h3 className="font-serif text-base font-normal text-foreground">Lifecycle Engagement History</h3>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                {(lead.activities || []).map((act: any) => (
                  <div key={act.id} className="relative space-y-1">
                    <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-[#D62828] dark:bg-[#FF5A5F] ring-4 ring-card shadow-xs" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{act.title}</span>
                      <span className="text-[10px] font-mono tabular-nums text-muted-foreground">{timeAgo(act.createdAt)}</span>
                    </div>
                    {act.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-card rounded-[12px] p-6 sm:p-8 shadow-floating border border-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <h3 className="font-serif text-lg font-normal text-foreground">Mathematical Scoring Breakdown</h3>
                </div>
                <button onClick={() => setScoreModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {Object.entries(scoreBreakdown).map(([key, factor]: [string, any]) => (
                  <div
                    key={key}
                    className="p-3 rounded-[8px] bg-[#F8F2E6]/60 dark:bg-[#1B1114]/60 border border-border space-y-1"
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span className="capitalize text-foreground">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-mono text-[#D62828] dark:text-[#FF5A5F]">
                        {factor.score !== undefined ? `${factor.score} / ${factor.max} pts` : factor}
                      </span>
                    </div>
                    {factor.reason && <p className="text-muted-foreground text-[11px]">{factor.reason}</p>}
                  </div>
                ))}
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setScoreModalOpen(false)}
                  className="px-4 py-2 rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] text-xs font-semibold shadow-xs"
                >
                  Close Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Log Outbound Call */}
        {callModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-md bg-card rounded-[12px] p-6 shadow-floating border border-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-serif text-base font-normal text-foreground">
                  Consultation Call with {lead.studentName}
                </h3>
                <button onClick={() => setCallModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleLogCall} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Call Outcome</label>
                  <select
                    value={callOutcome}
                    onChange={(e) => setCallOutcome(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                  >
                    <option value="Connected - Expressed Keen Interest">Connected - Expressed Keen Interest</option>
                    <option value="Connected - Campus Visit Booked">Connected - Campus Visit Booked</option>
                    <option value="Connected - Requested Fee Structure">Connected - Requested Fee Structure</option>
                    <option value="No Answer / Switched Off">No Answer / Switched Off</option>
                    <option value="Call Back Later">Call Back Later</option>
                    <option value="Wrong Number">Wrong Number</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Discussion Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Brief summary of candidate queries, concerns, or next commitments..."
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCallModalOpen(false)}
                    className="px-4 py-2 rounded-[8px] border border-border text-foreground hover:hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold shadow-xs"
                  >
                    Save Call Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Send Email */}
        {emailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-card rounded-[12px] p-6 shadow-floating border border-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-serif text-base font-normal text-foreground">
                  Dispatch Email to {lead.studentName}
                </h3>
                <button onClick={() => setEmailModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Institutional Template</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => handleSelectTemplate(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                  >
                    <option value="">Custom Message</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Subject Line</label>
                  <input
                    type="text"
                    required
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Message Body</label>
                  <textarea
                    rows={6}
                    required
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none resize-none font-mono text-[11px]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEmailModalOpen(false)}
                    className="px-4 py-2 rounded-[8px] border border-border text-foreground hover:hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold shadow-xs"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Schedule Follow-Up */}
        {followUpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-md bg-card rounded-[12px] p-6 shadow-floating border border-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-serif text-base font-normal text-foreground">Schedule Task</h3>
                <button onClick={() => setFollowUpModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleScheduleFollowUp} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Scheduled Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={fuDate}
                    onChange={(e) => setFuDate(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Action Type</label>
                    <select
                      value={fuType}
                      onChange={(e) => setFuType(e.target.value)}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    >
                      <option value="CALL">Phone Call</option>
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="CAMPUS_TOUR">Campus Tour</option>
                      <option value="EMAIL">Email</option>
                      <option value="MEETING">In-person Meeting</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Priority Level</label>
                    <select
                      value={fuPriority}
                      onChange={(e) => setFuPriority(e.target.value)}
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
                  <label className="font-medium text-foreground">Task Directive / Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Inquire about entrance exam verification and scholarship documents..."
                    value={fuNotes}
                    onChange={(e) => setFuNotes(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setFollowUpModalOpen(false)}
                    className="px-4 py-2 rounded-[8px] border border-border text-foreground hover:hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold shadow-xs"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-card rounded-[12px] p-6 shadow-floating border border-border space-y-4">
              <h3 className="font-serif text-base font-normal text-foreground">Register Academic Record</h3>
              <form onSubmit={handleUploadDoc} className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Record Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Higher Secondary Certificate"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Document Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
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
                    className="px-3 py-1.5 rounded-[8px] border border-border text-foreground hover:hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold shadow-xs"
                  >
                    Register Document
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Merge Duplicate Leads */}
        {duplicateModalOpen && duplicateLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-card rounded-[12px] p-6 sm:p-8 shadow-floating border border-border space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[8px] bg-[#FFC21A]/15 text-[#8A5A00] dark:text-[#FFD25A] flex items-center justify-center shrink-0 border border-[#FFC21A]/35">
                  <GitMerge className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-normal text-foreground">Duplicate Lead Merge Assistant</h3>
                  <p className="text-xs text-muted-foreground">Consolidate redundant candidate records into a single official file</p>
                </div>
              </div>

              <div className="p-4 rounded-[8px] bg-[#F8F2E6]/60 dark:bg-[#1B1114]/60 border border-border text-xs space-y-2">
                <p className="font-medium text-foreground">
                  Target (Preserve): {lead.studentName} ({lead.email})
                </p>
                <p className="font-medium text-muted-foreground">
                  Source (Merge &amp; Archive): {duplicateLead.studentName} ({duplicateLead.email})
                </p>
                <p className="text-[11px] text-muted-foreground pt-2 border-t border-border">
                  All activity history, counselor notes, and follow-up tasks will be transferred to this primary dossier.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDuplicateModalOpen(false)}
                  className="px-4 py-2 rounded-[8px] border border-border text-foreground hover:hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleMerge}
                  className="px-5 py-2 rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold text-xs shadow-xs"
                >
                  Confirm &amp; Merge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

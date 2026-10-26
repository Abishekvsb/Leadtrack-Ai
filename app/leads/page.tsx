"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/components/toast-context";
import {
  Users2,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Trash2,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckSquare,
  Square,
  FileSpreadsheet,
  X,
  Loader2,
  Sparkles,
  ArrowUpDown,
  Phone,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { STATUS_COLORS, STATUS_LABELS, SCORE_COLORS, LeadStatus, ScoreCategory } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import * as XLSX from "xlsx";

function LeadsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error } = useToast();

  const [leads, setLeads] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [counselors, setCounselors] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "ALL");
  const [courseId, setCourseId] = useState(searchParams.get("courseId") || "ALL");
  const [leadSource, setLeadSource] = useState("ALL");
  const [scoreCategory, setScoreCategory] = useState(searchParams.get("scoreCategory") || "ALL");
  const [assignedToId, setAssignedToId] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [bulkStatusModal, setBulkStatusModal] = useState(false);
  const [bulkAssignModal, setBulkAssignModal] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bulkTargetStatus, setBulkTargetStatus] = useState("CONTACTED");
  const [bulkTargetCounselor, setBulkTargetCounselor] = useState("");

  // Create Form State
  const [createFormData, setCreateFormData] = useState({
    studentName: "",
    email: "",
    phone: "",
    parentName: "",
    parentPhone: "",
    city: "",
    courseId: "",
    leadSource: "Website",
    status: "NEW",
    assignedToId: "",
    message: "",
  });

  // CSV Import State
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [csvPreviewData, setCsvPreviewData] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState({
    student: true,
    contact: true,
    course: true,
    score: true,
    status: true,
    counselor: true,
    created: true,
  });
  const [showColMenu, setShowColMenu] = useState(false);

  // Fetch leads
  const fetchLeads = async (page = 1) => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        search,
        status,
        courseId,
        leadSource,
        scoreCategory,
        assignedToId,
        sortBy,
        sortOrder,
      });

      const res = await fetch(`/api/leads?${q.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setLeads(Array.isArray(json.data?.leads) ? json.data.leads : []);
          setPagination(json.data?.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 });
          setSelectedIds([]);
        }
      }
    } catch {
      error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, courseId, leadSource, scoreCategory, assignedToId, sortBy, sortOrder]);

  // Load courses and team for filter dropdowns
  useEffect(() => {
    async function loadAux() {
      try {
        const [cRes, uRes] = await Promise.all([fetch("/api/courses"), fetch("/api/team")]);
        if (cRes.ok) {
          const cData = await cRes.json();
          if (cData.success) {
            setCourses(Array.isArray(cData.data?.courses) ? cData.data.courses : Array.isArray(cData.data) ? cData.data : []);
          }
        }
        if (uRes.ok) {
          const uData = await uRes.json();
          if (uData.success) {
            setCounselors(Array.isArray(uData.data?.users) ? uData.data.users : Array.isArray(uData.data) ? uData.data : []);
          }
        }
      } catch (err) {
        console.error("Failed to load courses or counselors", err);
      }
    }
    loadAux();
  }, []);

  // Selection Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds((Array.isArray(leads) ? leads : []).map((l) => l.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Status Update
  const handleBulkStatus = async () => {
    try {
      const res = await fetch("/api/leads/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: selectedIds, status: bulkTargetStatus }),
      });
      const data = await res.json();
      if (data.success) {
        success(data.message);
        setBulkStatusModal(false);
        fetchLeads(pagination.page);
      } else {
        error(data.error);
      }
    } catch {
      error("Bulk status update failed");
    }
  };

  // Bulk Counselor Assign
  const handleBulkAssign = async () => {
    try {
      const res = await fetch("/api/leads/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: selectedIds, assignedToId: bulkTargetCounselor || null }),
      });
      const data = await res.json();
      if (data.success) {
        success(data.message);
        setBulkAssignModal(false);
        fetchLeads(pagination.page);
      } else {
        error(data.error);
      }
    } catch {
      error("Bulk assign failed");
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    try {
      const res = await fetch("/api/leads/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: selectedIds }),
      });
      const data = await res.json();
      if (data.success) {
        success(data.message);
        setDeleteConfirmOpen(false);
        fetchLeads(pagination.page);
      } else {
        error(data.error);
      }
    } catch {
      error("Bulk delete failed");
    }
  };

  // Export to Excel / CSV
  const handleExport = (format: "csv" | "xlsx") => {
    const exportData = (Array.isArray(leads) ? leads : []).map((l) => ({
      "Student Name": l.studentName,
      Email: l.email,
      Phone: l.phone,
      City: l.city,
      Course: l.course?.name || "General",
      Source: l.leadSource,
      Status: STATUS_LABELS[l.status as LeadStatus] || l.status,
      "AI Score": l.score,
      Category: l.scoreCategory,
      Counselor: l.assignedTo?.name || "Unassigned",
      "Created Date": new Date(l.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    if (format === "csv") {
      XLSX.writeFile(workbook, `LeadTrack_Export_${Date.now()}.csv`, { bookType: "csv" });
    } else {
      XLSX.writeFile(workbook, `LeadTrack_Export_${Date.now()}.xlsx`, { bookType: "xlsx" });
    }
    success(`Exported ${leads.length} leads to ${format.toUpperCase()}`);
  };

  // Handle CSV Import File Parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          error("The uploaded spreadsheet appears to be empty.");
          return;
        }

        const normalized = data.map((row) => ({
          studentName: row["Student Name"] || row["Name"] || row["studentName"] || "",
          email: row["Email"] || row["email"] || "",
          phone: String(row["Phone"] || row["phone"] || row["Mobile"] || ""),
          city: row["City"] || row["city"] || "",
          leadSource: row["Source"] || row["leadSource"] || "Website",
        }));

        const valid = normalized.filter((r) => r.studentName && (r.email || r.phone));
        if (valid.length === 0) {
          error("No valid student records with Name and Phone/Email found.");
          return;
        }

        setCsvPreviewData(valid);
        success(`Parsed ${valid.length} valid lead records for import!`);
      } catch {
        error("Error parsing spreadsheet file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // Commit CSV Import to Backend
  const handleCommitImport = async () => {
    setImporting(true);
    let successCount = 0;

    for (const row of csvPreviewData) {
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(row),
        });
        if (res.ok) successCount++;
      } catch {}
    }

    setImporting(false);
    setImportModalOpen(false);
    setCsvPreviewData([]);
    success(`Successfully imported ${successCount} student leads with AI scores!`);
    fetchLeads(1);
  };

  // Create Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createFormData),
      });
      const data = await res.json();
      if (data.success) {
        success("Lead created and AI scored successfully!");
        setCreateModalOpen(false);
        setCreateFormData({
          studentName: "",
          email: "",
          phone: "",
          parentName: "",
          parentPhone: "",
          city: "",
          courseId: "",
          leadSource: "Website",
          status: "NEW",
          assignedToId: "",
          message: "",
        });
        fetchLeads(1);
      } else {
        error(data.error);
      }
    } catch {
      error("Failed to create lead");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        {/* Top Header & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
              Admissions Registry
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
              Student Candidates
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Manage prospective student records, execute bulk assignments, and track admissions readiness.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Import Button */}
            <button
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-[8px] border border-border bg-card text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] text-xs font-medium transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Import CSV</span>
            </button>

            {/* Export Button */}
            <button
              onClick={() => handleExport("csv")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-[8px] border border-border bg-card text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Export CSV</span>
            </button>

            {/* Add Lead Button */}
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-[8px] bg-[#D62828] hover:bg-[#B81E1E] text-white shadow-xs font-semibold text-xs font-medium transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Candidate</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-card border border-border rounded-[12px] p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search by student name, email, phone, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchLeads(1)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-[8px] bg-background/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 focus:ring-1 focus:ring-[#FFC21A]/35 min-h-[40px] transition-all"
              />
            </div>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 min-h-[40px]"
            >
              <option value="ALL">All Pipeline Stages</option>
              <option value="NEW">New Enquiry</option>
              <option value="CONTACTED">Contacted</option>
              <option value="INTERESTED">Interested</option>
              <option value="CAMPUS_VISIT">Campus Visit</option>
              <option value="APPLICATION_SUBMITTED">Application Submitted</option>
              <option value="ADMITTED">Admitted</option>
              <option value="LOST">Lost</option>
            </select>

            {/* Score Filter */}
            <select
              value={scoreCategory}
              onChange={(e) => setScoreCategory(e.target.value)}
              className="px-3 py-2 text-xs rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 min-h-[40px]"
            >
              <option value="ALL">All Score Bands</option>
              <option value="HOT">Hot Leads (80+)</option>
              <option value="WARM">Warm Leads (50-79)</option>
              <option value="COLD">Cold Leads (&lt;50)</option>
            </select>

            {/* Source Filter */}
            <select
              value={leadSource}
              onChange={(e) => setLeadSource(e.target.value)}
              className="px-3 py-2 text-xs rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 min-h-[40px]"
            >
              <option value="ALL">All Inbound Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Referral">Referral</option>
              <option value="Education Fair">Education Fair</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>

            {/* Program Filter */}
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="px-3 py-2 text-xs rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 min-h-[40px]"
            >
              <option value="ALL">All Academic Programs</option>
              {(Array.isArray(courses) ? courses : []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code || c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filter Clear & Column Visibility */}
          <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">
                Showing <span className="font-mono font-medium text-foreground">{pagination.total}</span> candidates
              </span>
              {(status !== "ALL" || courseId !== "ALL" || leadSource !== "ALL" || scoreCategory !== "ALL" || search) && (
                <button
                  onClick={() => {
                    setStatus("ALL");
                    setCourseId("ALL");
                    setLeadSource("ALL");
                    setScoreCategory("ALL");
                    setSearch("");
                  }}
                  className="text-[#D62828] dark:text-[#FF5A5F] font-medium hover:underline inline-flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Clear filters</span>
                </button>
              )}
            </div>

            {/* Column Visibility Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowColMenu(!showColMenu)}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Columns</span>
              </button>

              {showColMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-[10px] bg-card border border-border shadow-floating p-3 z-30 space-y-2">
                  <span className="text-[10px] uppercase font-medium text-muted-foreground tracking-wider block">
                    Display Columns
                  </span>
                  {Object.keys(visibleColumns).map((col) => (
                    <label key={col} className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                      <input
                        type="checkbox"
                        checked={(visibleColumns as any)[col]}
                        onChange={(e) =>
                          setVisibleColumns({ ...visibleColumns, [col]: e.target.checked })
                        }
                        className="rounded-[4px] border-border text-[#D62828] focus:ring-[#D62828]"
                      />
                      <span className="capitalize">{col}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Actions Floating Bar */}
        {selectedIds.length > 0 && (
          <div className="sticky top-20 z-20 flex items-center justify-between p-3.5 rounded-[10px] bg-gradient-to-r from-[#8F1218] via-[#D62828] to-[#B81E1E] text-white border border-[#FFC21A]/30 shadow-floating shadow-floating animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-0.5 rounded-[6px] bg-white/20 font-mono font-bold text-[#FFC21A]">
                {selectedIds.length}
              </span>
              <span>candidates selected</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setBulkStatusModal(true)}
                className="px-3 py-1.5 rounded-[8px] bg-white/15 hover:bg-white/25 text-white font-semibold text-xs font-medium transition-colors"
              >
                Update Stage
              </button>
              <button
                onClick={() => setBulkAssignModal(true)}
                className="px-3 py-1.5 rounded-[8px] bg-white/15 hover:bg-white/25 text-white font-semibold text-xs font-medium transition-colors"
              >
                Assign Counselor
              </button>
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="px-3 py-1.5 rounded-[8px] bg-[#C4552F] hover:bg-[#A94322] text-xs font-medium text-white transition-colors"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="p-1.5 rounded-[6px] hover:bg-[#165447] text-[#F6F2EA]/70 hover:text-white"
                title="Deselect all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="rounded-[12px] bg-card border border-border shadow-xs overflow-hidden">
          {/* Desktop & Tablet Data Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-[#FFF9EE]/80 dark:bg-[#1B1114]/80 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  <th className="p-4 w-10 text-center">
                    <button onClick={handleSelectAll} className="focus:outline-none">
                      {selectedIds.length > 0 && selectedIds.length === leads.length ? (
                        <CheckSquare className="w-4 h-4 text-[#D62828] dark:text-[#FF5A5F]" />
                      ) : (
                        <Square className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </th>

                  {visibleColumns.student && (
                    <th
                      className="p-4 cursor-pointer select-none hover:text-foreground"
                      onClick={() => {
                        setSortBy("studentName");
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Candidate</span>
                        <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </th>
                  )}

                  {visibleColumns.contact && <th className="p-4">Contact Details</th>}
                  {visibleColumns.course && <th className="p-4">Program &amp; Channel</th>}

                  {visibleColumns.score && (
                    <th
                      className="p-4 cursor-pointer select-none hover:text-foreground"
                      onClick={() => {
                        setSortBy("score");
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>AI Score</span>
                        <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </th>
                  )}

                  {visibleColumns.status && <th className="p-4">Admissions Stage</th>}
                  {visibleColumns.counselor && <th className="p-4">Counselor</th>}

                  {visibleColumns.created && (
                    <th
                      className="p-4 cursor-pointer select-none hover:text-foreground"
                      onClick={() => {
                        setSortBy("createdAt");
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Date Logged</span>
                        <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </th>
                  )}

                  <th className="p-4 text-right">Dossier</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-20 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-[#D62828] dark:text-[#FF5A5F]" />
                        <span className="font-serif italic text-sm">Accessing admissions registry...</span>
                      </div>
                    </td>
                  </tr>
                ) : !Array.isArray(leads) || leads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-20 text-center text-muted-foreground">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Users2 className="w-8 h-8 mx-auto text-muted-foreground/60 stroke-[1.5]" />
                        <p className="font-serif text-base text-foreground">No candidate records found</p>
                        <p className="text-xs text-muted-foreground">Try broadening your search or adjusting active filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (Array.isArray(leads) ? leads : []).map((lead) => {
                    const isSelected = selectedIds.includes(lead.id);
                    const statusInfo = STATUS_COLORS[lead.status as LeadStatus] || STATUS_COLORS.NEW;
                    const scoreInfo = SCORE_COLORS[lead.scoreCategory as ScoreCategory] || SCORE_COLORS.WARM;

                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-[#FFF9EE]/40 dark:hover:bg-[#27191E]/30 transition-colors ${
                          isSelected ? "bg-[#FFF9EE]/90 dark:bg-[#27191E]/70" : ""
                        }`}
                      >
                        <td className="p-4 text-center">
                          <button onClick={() => handleToggleSelect(lead.id)} className="focus:outline-none">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#D62828] dark:text-[#FF5A5F]" />
                            ) : (
                              <Square className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </td>

                        {visibleColumns.student && (
                          <td className="p-4">
                            <Link
                              href={`/leads/${lead.id}`}
                              className="font-serif text-sm font-normal text-foreground hover:text-[#D62828] dark:hover:text-[#FF5A5F] transition-colors"
                            >
                              {lead.studentName}
                            </Link>
                            <p className="text-[11px] text-muted-foreground">{lead.city || "Unspecified City"}</p>
                          </td>
                        )}

                        {visibleColumns.contact && (
                          <td className="p-4 space-y-0.5">
                            <p className="font-mono text-xs text-foreground tabular-nums">{lead.phone}</p>
                            <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">{lead.email}</p>
                          </td>
                        )}

                        {visibleColumns.course && (
                          <td className="p-4 space-y-1">
                            <p className="font-medium text-foreground truncate max-w-[170px]">
                              {lead.course?.name || "General Enquiry"}
                            </p>
                            <span className="inline-block px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono uppercase bg-[#F8F2E6] dark:bg-[#1B1114] text-muted-foreground border border-border">
                              {lead.leadSource}
                            </span>
                          </td>
                        )}

                        {visibleColumns.score && (
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`w-8 h-8 rounded-[6px] flex items-center justify-center font-mono font-bold text-xs ${scoreInfo.badge}`}
                              >
                                {lead.score}
                              </span>
                              <div className="flex flex-col">
                                <span className={`text-[10px] font-mono font-semibold tracking-wider ${scoreInfo.text}`}>
                                  {lead.scoreCategory}
                                </span>
                                <span className="text-[10px] font-mono tabular-nums text-muted-foreground">
                                  {lead.conversionProbability}% conv
                                </span>
                              </div>
                            </div>
                          </td>
                        )}

                        {visibleColumns.status && (
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 text-xs text-foreground font-medium">
                              <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                              <span>{STATUS_LABELS[lead.status as LeadStatus] || lead.status}</span>
                            </span>
                          </td>
                        )}

                        {visibleColumns.counselor && (
                          <td className="p-4">
                            <p className="font-medium text-foreground">
                              {lead.assignedTo?.name || (
                                <span className="text-muted-foreground italic">Unassigned</span>
                              )}
                            </p>
                          </td>
                        )}

                        {visibleColumns.created && (
                          <td className="p-4 text-muted-foreground font-mono tabular-nums text-[11px]">
                            {formatDate(lead.createdAt)}
                          </td>
                        )}

                        <td className="p-4 text-right">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[8px] border border-border bg-card text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] font-medium text-[11px] transition-colors"
                          >
                            <span>Dossier</span>
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards View (visible on < 768px) */}
          <div className="block md:hidden divide-y divide-border">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin text-[#D62828] dark:text-[#FF5A5F] mx-auto mb-2" />
                <span className="font-serif italic text-xs">Loading records...</span>
              </div>
            ) : !Array.isArray(leads) || leads.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground space-y-2">
                <Users2 className="w-8 h-8 mx-auto text-muted-foreground/60 stroke-[1.5]" />
                <p className="font-serif text-sm text-foreground">No candidate records found</p>
                <p className="text-[11px] text-muted-foreground">Try broadening your search filters.</p>
              </div>
            ) : (
              (Array.isArray(leads) ? leads : []).map((lead) => {
                const isSelected = selectedIds.includes(lead.id);
                const statusInfo = STATUS_COLORS[lead.status as LeadStatus] || STATUS_COLORS.NEW;
                const scoreInfo = SCORE_COLORS[lead.scoreCategory as ScoreCategory] || SCORE_COLORS.WARM;

                return (
                  <div
                    key={lead.id}
                    className={`p-4 space-y-3 transition-colors ${
                      isSelected ? "bg-[#FFF9EE]/90 dark:bg-[#27191E]/70" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => handleToggleSelect(lead.id)}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-1 focus:outline-none"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-[#D62828] dark:text-[#FF5A5F]" />
                          ) : (
                            <Square className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>
                        <div>
                          <Link
                            href={`/leads/${lead.id}`}
                            className="font-serif text-base font-normal text-foreground hover:text-[#D62828] dark:hover:text-[#FF5A5F] transition-colors line-clamp-1"
                          >
                            {lead.studentName}
                          </Link>
                          <p className="text-[11px] text-muted-foreground">{lead.city || "Unspecified City"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded-[6px] font-mono font-bold text-xs ${scoreInfo.badge}`}>
                          {lead.score}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-foreground font-medium">
                          <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                          <span className="text-[11px]">{STATUS_LABELS[lead.status as LeadStatus] || lead.status}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#F8F2E6]/60 dark:bg-[#1B1114]/60 p-3 rounded-[8px] border border-border">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-mono tracking-wider">
                          Program &amp; Source
                        </span>
                        <span className="font-medium text-foreground truncate block">
                          {lead.course?.code || lead.course?.name || "General"}
                        </span>
                        <span className="text-muted-foreground text-[10px]">{lead.leadSource}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-mono tracking-wider">
                          Counselor
                        </span>
                        <span className="font-medium text-foreground truncate block">
                          {lead.assignedTo?.name || "Unassigned"}
                        </span>
                        <span className="text-muted-foreground font-mono text-[10px]">{formatDate(lead.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3 text-xs">
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="min-h-[44px] flex items-center gap-1.5 text-foreground hover:text-[#D62828] font-mono tabular-nums"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#D62828] dark:text-[#FF5A5F]" />
                            <span>{lead.phone}</span>
                          </a>
                        )}
                      </div>

                      <Link
                        href={`/leads/${lead.id}`}
                        className="min-h-[44px] px-4 py-2 rounded-[8px] bg-card border border-border hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] font-medium text-xs flex items-center gap-1 text-foreground transition-colors"
                      >
                        <span>Open Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between p-4 border-t border-border text-xs">
            <span className="text-muted-foreground">
              Page <span className="font-mono font-medium text-foreground">{pagination.page}</span> of{" "}
              <span className="font-mono font-medium text-foreground">{pagination.totalPages}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchLeads(pagination.page - 1)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 rounded-[8px] border border-border bg-card text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] disabled:opacity-40 transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchLeads(pagination.page + 1)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 rounded-[8px] border border-border bg-card text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] disabled:opacity-40 transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal: Create Lead */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-xl bg-card rounded-[12px] p-6 sm:p-8 shadow-floating border border-border max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Registry Entry</div>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-foreground tracking-tight">
                    Add Candidate Profile
                  </h3>
                </div>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1.5 rounded-[6px] text-muted-foreground hover:text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLead} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Candidate Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Mehta"
                      value={createFormData.studentName}
                      onChange={(e) => setCreateFormData({ ...createFormData, studentName: e.target.value })}
                      className="w-full p-2.5 rounded-[8px] text-xs bg-background/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Phone Number *</label>
                    <input
                      type="tel"
                      inputMode="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={createFormData.phone}
                      onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-[8px] text-xs bg-background/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Email Address *</label>
                    <input
                      type="email"
                      inputMode="email"
                      required
                      placeholder="student@gmail.com"
                      value={createFormData.email}
                      onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                      className="w-full p-2.5 rounded-[8px] text-xs bg-background/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune"
                      value={createFormData.city}
                      onChange={(e) => setCreateFormData({ ...createFormData, city: e.target.value })}
                      className="w-full p-2.5 rounded-[8px] text-xs bg-background/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Academic Program</label>
                    <select
                      value={createFormData.courseId}
                      onChange={(e) => setCreateFormData({ ...createFormData, courseId: e.target.value })}
                      className="w-full p-2.5 rounded-[8px] text-xs bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    >
                      <option value="">Select Degree Program</option>
                      {(Array.isArray(courses) ? courses : []).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Inbound Channel</label>
                    <select
                      value={createFormData.leadSource}
                      onChange={(e) => setCreateFormData({ ...createFormData, leadSource: e.target.value })}
                      className="w-full p-2.5 rounded-[8px] text-xs bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    >
                      <option value="Website">Website</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Referral">Referral</option>
                      <option value="Education Fair">Education Fair</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Assigned Counselor</label>
                    <select
                      value={createFormData.assignedToId}
                      onChange={(e) => setCreateFormData({ ...createFormData, assignedToId: e.target.value })}
                      className="w-full p-2.5 rounded-[8px] text-xs bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    >
                      <option value="">Auto-assign (Round Robin)</option>
                      {(Array.isArray(counselors) ? counselors : []).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Pipeline Stage</label>
                    <select
                      value={createFormData.status}
                      onChange={(e) => setCreateFormData({ ...createFormData, status: e.target.value })}
                      className="w-full p-2.5 rounded-[8px] text-xs bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    >
                      <option value="NEW">New Enquiry</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="INTERESTED">Interested</option>
                      <option value="CAMPUS_VISIT">Campus Visit</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Initial Counselor Remarks</label>
                  <textarea
                    rows={3}
                    placeholder="Academic background, prior examination score, parent consultation preferences..."
                    value={createFormData.message}
                    onChange={(e) => setCreateFormData({ ...createFormData, message: e.target.value })}
                    className="w-full p-2.5 rounded-[8px] text-xs bg-background/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-medium rounded-[8px] bg-[#D62828] hover:bg-[#B81E1E] text-white shadow-xs font-semibold shadow-xs"
                  >
                    Register &amp; Compute AI Score
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: CSV Import */}
        {importModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-2xl bg-card rounded-[12px] p-6 sm:p-8 shadow-floating border border-border max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Bulk Ingestion</div>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-foreground tracking-tight">
                    Batch Lead Import
                  </h3>
                </div>
                <button onClick={() => setImportModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="border-2 border-dashed border-border rounded-[10px] p-6 text-center space-y-3 bg-[#F8F2E6]/40 dark:bg-[#1B1114]/40">
                <FileSpreadsheet className="w-10 h-10 text-[#D62828] dark:text-[#FF5A5F] mx-auto stroke-[1.5]" />
                <div>
                  <p className="text-xs font-medium text-foreground">Upload CSV or Excel Workbook</p>
                  <p className="text-[11px] text-muted-foreground">Expected headers: Student Name, Email, Phone, City, Source</p>
                </div>
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-[8px] bg-[#D62828] hover:bg-[#B81E1E] text-white shadow-xs font-semibold text-xs font-medium shadow-xs"
                >
                  Select File
                </button>
              </div>

              {/* Preview Table */}
              {csvPreviewData.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-foreground">
                    Parsed Preview ({csvPreviewData.length} candidate rows ready):
                  </span>
                  <div className="max-h-48 overflow-y-auto border border-border rounded-[8px]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8F2E6]/60 dark:bg-[#1B1114]/60 text-[10px] uppercase text-muted-foreground">
                        <tr>
                          <th className="p-2">Name</th>
                          <th className="p-2">Email</th>
                          <th className="p-2">Phone</th>
                          <th className="p-2">City</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-[11px]">
                        {csvPreviewData.slice(0, 5).map((row, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-medium">{row.studentName}</td>
                            <td className="p-2 text-muted-foreground">{row.email}</td>
                            <td className="p-2 font-mono tabular-nums">{row.phone}</td>
                            <td className="p-2">{row.city}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setImportModalOpen(false);
                    setCsvPreviewData([]);
                  }}
                  className="px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={csvPreviewData.length === 0 || importing}
                  onClick={handleCommitImport}
                  className="px-5 py-2 text-xs font-medium rounded-[8px] bg-[#D62828] hover:bg-[#B81E1E] text-white shadow-xs font-semibold disabled:opacity-50 shadow-xs"
                >
                  {importing ? "Ingesting & Scoring..." : `Confirm & Ingest ${csvPreviewData.length} Candidates`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Bulk Status */}
        {bulkStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-card rounded-[12px] p-6 shadow-floating border border-border space-y-4">
              <h3 className="font-serif text-lg font-normal text-foreground">
                Update Stage ({selectedIds.length} candidates)
              </h3>
              <select
                value={bulkTargetStatus}
                onChange={(e) => setBulkTargetStatus(e.target.value)}
                className="w-full p-2.5 rounded-[8px] text-xs bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
              >
                <option value="NEW">New Enquiry</option>
                <option value="CONTACTED">Contacted</option>
                <option value="INTERESTED">Interested</option>
                <option value="CAMPUS_VISIT">Campus Visit</option>
                <option value="APPLICATION_SUBMITTED">Application Submitted</option>
                <option value="ADMITTED">Admitted</option>
                <option value="LOST">Lost</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setBulkStatusModal(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded-[8px] border border-border text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkStatus}
                  className="px-4 py-1.5 text-xs font-medium rounded-[8px] bg-[#D62828] text-white font-semibold shadow-xs"
                >
                  Apply Stage
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Bulk Assign Counselor */}
        {bulkAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-card rounded-[12px] p-6 shadow-floating border border-border space-y-4">
              <h3 className="font-serif text-lg font-normal text-foreground">
                Assign Counselor ({selectedIds.length} candidates)
              </h3>
              <select
                value={bulkTargetCounselor}
                onChange={(e) => setBulkTargetCounselor(e.target.value)}
                className="w-full p-2.5 rounded-[8px] text-xs bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
              >
                <option value="">Select Counselor</option>
                {(Array.isArray(counselors) ? counselors : []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setBulkAssignModal(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded-[8px] border border-border text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkAssign}
                  className="px-4 py-1.5 text-xs font-medium rounded-[8px] bg-[#D62828] text-white font-semibold shadow-xs"
                >
                  Assign Candidates
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Dialog: Bulk Delete */}
        <ConfirmDialog
          isOpen={deleteConfirmOpen}
          title={`Delete ${selectedIds.length} candidate records?`}
          message="This action is irreversible. All associated activities, follow-ups, and notes will be permanently removed from institutional records."
          confirmLabel="Delete Records"
          isDestructive
          onConfirm={handleBulkDelete}
          onCancel={() => setDeleteConfirmOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground font-serif italic">Loading candidate records...</div>}>
      <LeadsContent />
    </Suspense>
  );
}

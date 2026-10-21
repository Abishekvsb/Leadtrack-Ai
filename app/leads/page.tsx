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
  ExternalLink,
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
  const [leadSource, setLeadSource] = useState(searchParams.get("leadSource") || "ALL");
  const [scoreCategory, setScoreCategory] = useState(searchParams.get("scoreCategory") || "ALL");
  const [assignedToId, setAssignedToId] = useState(searchParams.get("assignedToId") || "");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusModal, setBulkStatusModal] = useState(false);
  const [bulkAssignModal, setBulkAssignModal] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bulkTargetStatus, setBulkTargetStatus] = useState("CONTACTED");
  const [bulkTargetCounselor, setBulkTargetCounselor] = useState("");

  // Create Lead Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
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

  // CSV Import Modal
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
          setLeads(json.data.leads);
          setPagination(json.data.pagination);
          setSelectedIds([]);
        }
      }
    } catch (e) {
      error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(pagination.page);
  }, [status, courseId, leadSource, scoreCategory, assignedToId, sortBy, sortOrder]);

  // Load courses and team for filter dropdowns
  useEffect(() => {
    async function loadAux() {
      try {
        const [cRes, uRes] = await Promise.all([fetch("/api/courses"), fetch("/api/team")]);
        if (cRes.ok) {
          const cJson = await cRes.json();
          if (cJson.success) setCourses(cJson.data.courses || []);
        }
        if (uRes.ok) {
          const uJson = await uRes.json();
          if (uJson.success) {
            const list = uJson.data.users || [];
            setCounselors(list.filter((u: any) => u.role === "COUNSELOR"));
          }
        }
      } catch {}
    }
    loadAux();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads(1);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map((l) => l.id));
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CHANGE_STATUS",
          leadIds: selectedIds,
          status: bulkTargetStatus,
        }),
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
      error("Bulk action failed");
    }
  };

  // Bulk Counselor Assign
  const handleBulkAssign = async () => {
    if (!bulkTargetCounselor) {
      error("Please pick a counselor");
      return;
    }
    try {
      const res = await fetch("/api/leads/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ASSIGN",
          leadIds: selectedIds,
          assignedToId: bulkTargetCounselor,
        }),
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          leadIds: selectedIds,
        }),
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
    const exportData = leads.map((l) => ({
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
        const rawJson = XLSX.utils.sheet_to_json(ws);

        // Map and validate rows
        const normalized = rawJson.map((row: any) => ({
          studentName: row["Student Name"] || row["studentName"] || row["Name"] || "Student",
          email: row["Email"] || row["email"] || `imported.${Date.now()}@gmail.com`,
          phone: String(row["Phone"] || row["phone"] || "+91 98000 00000"),
          city: row["City"] || row["city"] || "Bangalore",
          leadSource: row["Source"] || row["leadSource"] || "Website",
          status: row["Status"] || "NEW",
        }));

        setCsvPreviewData(normalized);
      } catch {
        error("Error parsing CSV / Excel file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // Execute Import
  const handleCommitImport = async () => {
    if (csvPreviewData.length === 0) return;
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
      <div className="space-y-6 pb-12">
        {/* Top Header & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Admissions Lead Registry
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage candidate enquiries, execute bulk workflows & track admissions readiness
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Import Button */}
            <button
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import CSV</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative group">
              <button
                onClick={() => handleExport("csv")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Add Lead Button */}
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Lead</span>
            </button>
          </div>
        </div>

        {/* Search & Multi-Filters Toolbar */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search name, phone, email, city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                />
              </form>
            </div>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New Enquiry</option>
              <option value="CONTACTED">Contacted</option>
              <option value="INTERESTED">Interested</option>
              <option value="CAMPUS_VISIT">Campus Visit</option>
              <option value="APPLICATION_SUBMITTED">Application Submitted</option>
              <option value="ADMITTED">Admitted</option>
              <option value="LOST">Lost</option>
            </select>

            {/* Score Category Filter */}
            <select
              value={scoreCategory}
              onChange={(e) => setScoreCategory(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
            >
              <option value="ALL">All AI Scores</option>
              <option value="HOT">Hot Leads (Score &ge; 75)</option>
              <option value="WARM">Warm Leads (45 - 74)</option>
              <option value="COLD">Cold Leads (&lt; 45)</option>
            </select>

            {/* Lead Source Filter */}
            <select
              value={leadSource}
              onChange={(e) => setLeadSource(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
            >
              <option value="ALL">All Sources</option>
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
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
            >
              <option value="ALL">All Programs</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filter Clear & Column Visibility */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">
                Found <span className="font-semibold text-slate-800 dark:text-slate-200">{pagination.total}</span> leads
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
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Column Visibility Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowColMenu(!showColMenu)}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Columns</span>
              </button>

              {showColMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-30 space-y-1.5 animate-in fade-in">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Toggle Columns
                  </span>
                  {Object.keys(visibleColumns).map((col) => (
                    <label key={col} className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={(visibleColumns as any)[col]}
                        onChange={(e) =>
                          setVisibleColumns({ ...visibleColumns, [col]: e.target.checked })
                        }
                        className="rounded border-slate-300 text-indigo-600"
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
          <div className="sticky top-20 z-20 flex items-center justify-between p-3.5 rounded-2xl bg-indigo-900 text-white shadow-2xl animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-700 font-bold">{selectedIds.length}</span>
              <span>leads selected</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setBulkStatusModal(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-xs font-semibold transition-colors"
              >
                Change Status
              </button>
              <button
                onClick={() => setBulkAssignModal(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-xs font-semibold transition-colors"
              >
                Assign Counselor
              </button>
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-xs font-semibold transition-colors"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="p-1.5 rounded-lg hover:bg-indigo-800 text-indigo-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 w-10 text-center">
                    <button onClick={handleSelectAll}>
                      {selectedIds.length > 0 && selectedIds.length === leads.length ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </th>

                  {visibleColumns.student && (
                    <th className="p-4 cursor-pointer" onClick={() => {
                      setSortBy("studentName");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}>
                      <div className="flex items-center gap-1.5">
                        <span>Student Profile</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  )}

                  {visibleColumns.contact && <th className="p-4">Contact</th>}
                  {visibleColumns.course && <th className="p-4">Program & Source</th>}

                  {visibleColumns.score && (
                    <th className="p-4 cursor-pointer" onClick={() => {
                      setSortBy("score");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}>
                      <div className="flex items-center gap-1.5">
                        <span>AI Lead Score</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  )}

                  {visibleColumns.status && <th className="p-4">Pipeline Status</th>}
                  {visibleColumns.counselor && <th className="p-4">Assigned To</th>}

                  {visibleColumns.created && (
                    <th className="p-4 cursor-pointer" onClick={() => {
                      setSortBy("createdAt");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}>
                      <div className="flex items-center gap-1.5">
                        <span>Enquiry Date</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  )}

                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                        <span>Loading leads...</span>
                      </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-slate-400">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Users2 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                        <p className="font-semibold text-sm">No leads match your criteria</p>
                        <p className="text-[11px]">Try adjusting your search terms or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const isSelected = selectedIds.includes(lead.id);
                    const statusInfo = STATUS_COLORS[lead.status as LeadStatus] || STATUS_COLORS.NEW;
                    const scoreInfo = SCORE_COLORS[lead.scoreCategory as ScoreCategory] || SCORE_COLORS.WARM;

                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                          isSelected ? "bg-indigo-50/50 dark:bg-indigo-950/20" : ""
                        }`}
                      >
                        <td className="p-4 text-center">
                          <button onClick={() => handleToggleSelect(lead.id)}>
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        </td>

                        {visibleColumns.student && (
                          <td className="p-4">
                            <Link
                              href={`/leads/${lead.id}`}
                              className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                              {lead.studentName}
                            </Link>
                            <p className="text-[11px] text-slate-400">{lead.city}</p>
                          </td>
                        )}

                        {visibleColumns.contact && (
                          <td className="p-4 space-y-0.5">
                            <p className="font-medium text-slate-800 dark:text-slate-200">{lead.phone}</p>
                            <p className="text-[11px] text-slate-400">{lead.email}</p>
                          </td>
                        )}

                        {visibleColumns.course && (
                          <td className="p-4 space-y-0.5">
                            <p className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                              {lead.course?.name || "General Enquiry"}
                            </p>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {lead.leadSource}
                            </span>
                          </td>
                        )}

                        {visibleColumns.score && (
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${scoreInfo.badge}`}
                              >
                                {lead.score}
                              </span>
                              <div className="flex flex-col">
                                <span className={`text-[10px] font-bold ${scoreInfo.text}`}>
                                  {lead.scoreCategory}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {lead.conversionProbability}% conv
                                </span>
                              </div>
                            </div>
                          </td>
                        )}

                        {visibleColumns.status && (
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                              {STATUS_LABELS[lead.status as LeadStatus] || lead.status}
                            </span>
                          </td>
                        )}

                        {visibleColumns.counselor && (
                          <td className="p-4">
                            <p className="font-medium text-slate-800 dark:text-slate-200">
                              {lead.assignedTo?.name || "Unassigned"}
                            </p>
                          </td>
                        )}

                        {visibleColumns.created && (
                          <td className="p-4 text-slate-500 text-[11px]">
                            {formatDate(lead.createdAt)}
                          </td>
                        )}

                        <td className="p-4 text-right">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-[11px] text-indigo-600 dark:text-indigo-400 transition-colors"
                          >
                            <span>Open</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400">
              Showing page <span className="font-semibold text-slate-800 dark:text-slate-200">{pagination.page}</span> of{" "}
              {pagination.totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchLeads(pagination.page - 1)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchLeads(pagination.page + 1)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal: Create Lead */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base">Add New Student Lead</h3>
                <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLead} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Student Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Mehta"
                      value={createFormData.studentName}
                      onChange={(e) => setCreateFormData({ ...createFormData, studentName: e.target.value })}
                      className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={createFormData.phone}
                      onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="student@gmail.com"
                      value={createFormData.email}
                      onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune"
                      value={createFormData.city}
                      onChange={(e) => setCreateFormData({ ...createFormData, city: e.target.value })}
                      className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Program</label>
                    <select
                      value={createFormData.courseId}
                      onChange={(e) => setCreateFormData({ ...createFormData, courseId: e.target.value })}
                      className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    >
                      <option value="">Select Degree Program</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Lead Source</label>
                    <select
                      value={createFormData.leadSource}
                      onChange={(e) => setCreateFormData({ ...createFormData, leadSource: e.target.value })}
                      className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
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
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Assign Counselor</label>
                    <select
                      value={createFormData.assignedToId}
                      onChange={(e) => setCreateFormData({ ...createFormData, assignedToId: e.target.value })}
                      className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    >
                      <option value="">Auto-assign (Round Robin)</option>
                      {counselors.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Pipeline Stage</label>
                    <select
                      value={createFormData.status}
                      onChange={(e) => setCreateFormData({ ...createFormData, status: e.target.value })}
                      className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    >
                      <option value="NEW">New Enquiry</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="INTERESTED">Interested</option>
                      <option value="CAMPUS_VISIT">Campus Visit</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Counselor Notes / Enquiry Remarks</label>
                  <textarea
                    rows={3}
                    placeholder="Student background, 12th score, family questions..."
                    value={createFormData.message}
                    onChange={(e) => setCreateFormData({ ...createFormData, message: e.target.value })}
                    className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25"
                  >
                    Create &amp; Compute AI Score
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: CSV Import */}
        {importModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base">Bulk Lead CSV / Excel Import</h3>
                <button onClick={() => setImportModalOpen(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center space-y-3">
                <FileSpreadsheet className="w-10 h-10 text-indigo-500 mx-auto" />
                <div>
                  <p className="text-xs font-semibold">Upload CSV or Excel file</p>
                  <p className="text-[11px] text-slate-400">Columns supported: Student Name, Email, Phone, City, Source</p>
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  Choose File
                </button>
              </div>

              {/* Preview Table */}
              {csvPreviewData.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Preview ({csvPreviewData.length} records ready to import):
                  </span>
                  <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase text-slate-400">
                        <tr>
                          <th className="p-2">Name</th>
                          <th className="p-2">Email</th>
                          <th className="p-2">Phone</th>
                          <th className="p-2">City</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                        {csvPreviewData.slice(0, 5).map((row, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-semibold">{row.studentName}</td>
                            <td className="p-2 text-slate-400">{row.email}</td>
                            <td className="p-2">{row.phone}</td>
                            <td className="p-2">{row.city}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setImportModalOpen(false);
                    setCsvPreviewData([]);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={csvPreviewData.length === 0 || importing}
                  onClick={handleCommitImport}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                >
                  {importing ? "Importing & Scoring..." : `Confirm & Import ${csvPreviewData.length} Leads`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Bulk Status */}
        {bulkStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-sm">Bulk Update Status ({selectedIds.length} leads)</h3>
              <select
                value={bulkTargetStatus}
                onChange={(e) => setBulkTargetStatus(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
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
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkStatus}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
                >
                  Apply Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Bulk Assign Counselor */}
        {bulkAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-sm">Bulk Assign Counselor ({selectedIds.length} leads)</h3>
              <select
                value={bulkTargetCounselor}
                onChange={(e) => setBulkTargetCounselor(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
              >
                <option value="">Select Counselor</option>
                {counselors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setBulkAssignModal(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkAssign}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
                >
                  Assign Leads
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Dialog: Bulk Delete */}
        <ConfirmDialog
          isOpen={deleteConfirmOpen}
          title={`Delete ${selectedIds.length} leads?`}
          message="This action is irreversible. All associated activities, follow-ups, and notes will be permanently removed."
          confirmLabel="Delete Leads"
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
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Leads...</div>}>
      <LeadsContent />
    </Suspense>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/components/toast-context";
import {
  MessageSquareShare,
  Mail,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Check,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function TemplatesPage() {
  const { success, error } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"ALL" | "EMAIL" | "WHATSAPP">("ALL");
  const [loading, setLoading] = useState(true);

  // Editor Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<"EMAIL" | "WHATSAPP">("EMAIL");
  const [category, setCategory] = useState("FOLLOW_UP");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const sampleVariables: Record<string, string> = {
    "{{name}}": "Aarav Sharma",
    "{{course}}": "B.Tech Computer Science",
    "{{counselor}}": "Priya Sharma",
    "{{institution}}": "Apex Institute of Technology",
  };

  const loadTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      if (res.ok) {
        const json = await res.json();
        if (json.success) setTemplates(json.data.templates || []);
      }
    } catch {
      error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const openEditor = (tmpl?: any) => {
    if (tmpl) {
      setEditingId(tmpl.id);
      setName(tmpl.name);
      setType(tmpl.type);
      setCategory(tmpl.category);
      setSubject(tmpl.subject || "");
      setBody(tmpl.body);
    } else {
      setEditingId(null);
      setName("");
      setType("EMAIL");
      setCategory("FOLLOW_UP");
      setSubject("Update regarding your admission to {{institution}}");
      setBody("Dear {{name}},\n\nThank you for reaching out regarding our {{course}} program at {{institution}}.\n\nWarm regards,\n{{counselor}}");
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;

    try {
      const method = editingId ? "PUT" : "POST";
      const payload: any = { name, type, category, subject, body, variables: ["name", "course", "counselor", "institution"] };
      if (editingId) payload.id = editingId;

      const res = await fetch("/api/templates", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        success(editingId ? "Template updated" : "Template created");
        setModalOpen(false);
        loadTemplates();
      } else {
        error(data.error);
      }
    } catch {
      error("Failed to save template");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        success("Template removed");
        loadTemplates();
      }
    } catch {
      error("Delete failed");
    }
  };

  // Live rendered preview string
  const renderPreview = (text: string) => {
    let out = text;
    for (const [v, rep] of Object.entries(sampleVariables)) {
      out = out.split(v).join(rep);
    }
    return out;
  };

  const filtered = templates.filter((t) => (filterType === "ALL" ? true : t.type === filterType));

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Communication Templates
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Email &amp; WhatsApp standardized responses with dynamic smart variables
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter buttons */}
            <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              {(["ALL", "EMAIL", "WHATSAPP"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filterType === t
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {t === "ALL" ? "All" : t.toLowerCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => openEditor()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Template</span>
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="py-24 text-center text-xs text-slate-400">Loading templates...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No templates found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.type === "EMAIL"
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {t.type === "EMAIL" ? <Mail className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                      {t.type}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">{t.category}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h3>
                    {t.subject && (
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        Subject: {t.subject}
                      </p>
                    )}
                  </div>

                  <p className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed font-mono whitespace-pre-wrap">
                    {t.body}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditor(t)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => openEditor(t)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Preview Live →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Template Editor & Live Preview */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base">
                  {editingId ? "Edit Communication Template" : "New Communication Template"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                {/* Left: Input Form */}
                <form onSubmit={handleSave} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold">Template Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Campus Visit Invitation"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold">Channel Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                      >
                        <option value="EMAIL">Email</option>
                        <option value="WHATSAPP">WhatsApp</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                      >
                        <option value="WELCOME">Welcome &amp; Prospectus</option>
                        <option value="FOLLOW_UP">Counselor Follow-up</option>
                        <option value="CAMPUS_VISIT">Campus Visit</option>
                        <option value="ADMISSION_OFFER">Admission Offer</option>
                        <option value="REMINDER">Deadline Reminder</option>
                      </select>
                    </div>
                  </div>

                  {type === "EMAIL" && (
                    <div className="space-y-1">
                      <label className="font-semibold">Email Subject</label>
                      <input
                        type="text"
                        placeholder="e.g. Welcome to {{institution}} – Information Pack"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold">Message Body</label>
                      <span className="text-[10px] text-slate-400">Variables supported below</span>
                    </div>
                    <textarea
                      rows={8}
                      required
                      placeholder="Hi {{name}}, we are excited to discuss {{course}}..."
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-mono text-[11px] resize-none"
                    />
                  </div>

                  {/* Variable chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["{{name}}", "{{course}}", "{{counselor}}", "{{institution}}"].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setBody((prev) => prev + " " + chip)}
                        className="px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 rounded-xl border font-semibold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md"
                    >
                      Save Template
                    </button>
                  </div>
                </form>

                {/* Right: Real-time Live Preview */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Live Rendered Recipient Preview:
                  </span>
                  <div
                    className={`p-6 rounded-3xl border space-y-4 ${
                      type === "EMAIL"
                        ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-xs shadow-xs"
                        : "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/20 text-xs shadow-xs"
                    }`}
                  >
                    {type === "EMAIL" && (
                      <div className="pb-3 border-b border-slate-200 dark:border-slate-700 space-y-1">
                        <p className="text-slate-400 text-[11px]">
                          To: <span className="text-slate-700 dark:text-slate-300">aarav.sharma@gmail.com</span>
                        </p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          Subject: {renderPreview(subject) || "(No Subject)"}
                        </p>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200">
                      {renderPreview(body) || "Start typing in the editor on the left to see live variable interpolation..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

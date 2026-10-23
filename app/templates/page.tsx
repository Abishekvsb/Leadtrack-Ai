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
    "{{course}}": "B.Tech Computer Science & AI",
    "{{counselor}}": "Dr. E. Vance, Dean of Admissions",
    "{{institution}}": "LeadTrack Institute of Technology",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setBody("Dear {{name}},\n\nThank you for your interest in the {{course}} program at {{institution}}.\n\nOur admissions faculty has reviewed your preliminary inquiry, and we invite you to participate in an informational consultation.\n\nWarm regards,\n{{counselor}}");
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
      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
              Institutional Communications
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
              Correspondence Templates
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Curated official response templates for admissions email inquiries and WhatsApp notices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter buttons */}
            <div className="flex items-center p-1 rounded-[8px] bg-card border border-border shadow-xs">
              {(["ALL", "EMAIL", "WHATSAPP"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all ${
                    filterType === t
                      ? "bg-[#0F3D33] text-[#F6F2EA] dark:bg-[#4FB89A] dark:text-[#0F1412]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "ALL" ? "All Channels" : t === "EMAIL" ? "Email" : "WhatsApp"}
                </button>
              ))}
            </div>

            <button
              onClick={() => openEditor()}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-[8px] bg-[#0F3D33] dark:bg-[#4FB89A] text-[#F6F2EA] dark:text-[#0F1412] hover:bg-[#165447] dark:hover:bg-[#63C7AA] font-medium text-xs shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Template</span>
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#0F3D33] dark:text-[#4FB89A] mx-auto" />
            <p className="font-serif italic text-xs text-muted-foreground">Loading correspondence templates...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground font-serif italic border border-dashed border-border rounded-[12px]">
            No communication templates found in this channel.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-[12px] bg-card border border-border shadow-xs hover:border-[#0F3D33]/40 dark:hover:border-[#4FB89A]/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase border ${
                        t.type === "EMAIL"
                          ? "bg-[#5B7083]/10 text-[#5B7083] dark:text-[#8CA0B2] border-[#5B7083]/20"
                          : "bg-[#0F3D33]/10 text-[#0F3D33] dark:bg-[#4FB89A]/15 dark:text-[#4FB89A] border-[#0F3D33]/20"
                      }`}
                    >
                      {t.type === "EMAIL" ? <Mail className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                      {t.type}
                    </span>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">{t.category}</span>
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-normal text-foreground">{t.name}</h3>
                    {t.subject && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        Subject: {t.subject}
                      </p>
                    )}
                  </div>

                  <p className="p-3.5 rounded-[8px] bg-[#EDE6DA]/30 dark:bg-[#1F2723]/30 border border-border text-[11px] text-foreground line-clamp-4 leading-relaxed font-mono whitespace-pre-wrap">
                    {t.body}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditor(t)}
                      className="p-1.5 rounded-[6px] hover:bg-[#EDE6DA]/50 dark:hover:bg-[#1F2723] text-muted-foreground hover:text-foreground"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 rounded-[6px] hover:bg-[#C4552F]/10 text-muted-foreground hover:text-[#C4552F]"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => openEditor(t)}
                    className="text-xs font-medium text-[#0F3D33] dark:text-[#4FB89A] hover:underline"
                  >
                    View Parchment →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Template Editor & Live Preview */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-4xl bg-card rounded-[12px] p-6 sm:p-8 shadow-academic-floating border border-border max-h-[92vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Template Authoring</div>
                  <h3 className="font-serif text-lg font-normal text-foreground">
                    {editingId ? "Revise Institutional Template" : "Draft New Template"}
                  </h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                {/* Left: Input Form */}
                <form onSubmit={handleSave} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Template Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Merit Scholarship Award Notice"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#0F3D33] dark:focus:border-[#4FB89A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-medium text-foreground">Delivery Channel</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#0F3D33] dark:focus:border-[#4FB89A]"
                      >
                        <option value="EMAIL">Email</option>
                        <option value="WHATSAPP">WhatsApp</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-medium text-foreground">Admissions Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#0F3D33] dark:focus:border-[#4FB89A]"
                      >
                        <option value="WELCOME">Welcome &amp; Prospectus</option>
                        <option value="FOLLOW_UP">Counselor Follow-up</option>
                        <option value="CAMPUS_VISIT">Campus Tour Invitation</option>
                        <option value="ADMISSION_OFFER">Admission Offer</option>
                        <option value="REMINDER">Application Deadline Reminder</option>
                      </select>
                    </div>
                  </div>

                  {type === "EMAIL" && (
                    <div className="space-y-1.5">
                      <label className="font-medium text-foreground">Subject Line</label>
                      <input
                        type="text"
                        placeholder="e.g. Welcome to {{institution}} – Admissions Information Pack"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#0F3D33] dark:focus:border-[#4FB89A]"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-foreground">Message Body</label>
                      <span className="text-[10px] text-muted-foreground font-mono">Dynamic variables</span>
                    </div>
                    <textarea
                      rows={8}
                      required
                      placeholder="Dear {{name}}, we are pleased to discuss..."
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#0F3D33] dark:focus:border-[#4FB89A] font-mono text-[11px] resize-none"
                    />
                  </div>

                  {/* Variable chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["{{name}}", "{{course}}", "{{counselor}}", "{{institution}}"].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setBody((prev) => prev + " " + chip)}
                        className="px-2 py-1 rounded-[6px] bg-card border border-border hover:border-[#0F3D33] dark:hover:border-[#4FB89A] text-foreground font-mono text-[10px] transition-colors"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 rounded-[8px] border border-border text-foreground hover:bg-[#EDE6DA]/50 dark:hover:bg-[#1F2723] text-xs font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-[8px] bg-[#0F3D33] dark:bg-[#4FB89A] text-[#F6F2EA] dark:text-[#0F1412] text-xs font-medium shadow-xs"
                    >
                      Save Template
                    </button>
                  </div>
                </form>

                {/* Right: Real-time Live Parchment Preview */}
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                    Parchment Preview (Interpolated):
                  </span>
                  <div className="p-6 sm:p-7 rounded-[12px] bg-[#EDE6DA]/40 dark:bg-[#171D1A] border border-border space-y-4 shadow-academic-floating">
                    {type === "EMAIL" && (
                      <div className="pb-3 border-b border-border space-y-1">
                        <p className="text-muted-foreground text-[11px] font-mono">
                          Recipient: <span className="text-foreground">aarav.sharma@example.edu</span>
                        </p>
                        <p className="font-serif text-sm font-normal text-foreground">
                          {renderPreview(subject) || "(No Subject)"}
                        </p>
                      </div>
                    )}
                    <p className="font-serif text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                      {renderPreview(body) || "Type content on the left to observe real-time variable interpolation..."}
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

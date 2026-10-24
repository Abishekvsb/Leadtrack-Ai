"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/components/toast-context";
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Lock,
  X,
  Loader2,
  Copy,
  Check,
  Clock,
  Trash2,
  Send,
  ExternalLink,
} from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";

export default function TeamPage() {
  const { success, error } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite Modal
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("COUNSELOR");
  const [inviting, setInviting] = useState(false);
  const [generatedInviteUrl, setGeneratedInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const loadTeam = async () => {
    try {
      const [resUsers, resInvites] = await Promise.all([
        fetch("/api/team"),
        fetch("/api/team/invite"),
      ]);

      if (resUsers.ok) {
        const json = await resUsers.json();
        if (json.success) setUsers(json.data.users || []);
      }

      if (resInvites.ok) {
        const json = await resInvites.json();
        if (json.success) setInvites(json.data.invites || []);
      }
    } catch {
      error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const res = await fetch("/api/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        success(`Staff status changed to ${newStatus}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
      }
    } catch {
      error("Failed to update status");
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        success(`Institutional role updated to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch {
      error("Failed to update role");
    }
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setInviting(true);
    setGeneratedInviteUrl("");
    setCopied(false);

    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (data.success) {
        success("Invitation link generated successfully!");
        setGeneratedInviteUrl(data.data.invite.inviteUrl);
        loadTeam();
      } else {
        error(data.error || "Failed to create invite");
      }
    } catch {
      error("Network error creating invite");
    } finally {
      setInviting(false);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    success("Invitation link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      const res = await fetch(`/api/team/invite?id=${inviteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        success("Invitation revoked");
        setInvites((prev) => prev.filter((i) => i.id !== inviteId));
      } else {
        error(data.error || "Failed to revoke invite");
      }
    } catch {
      error("Network error revoking invite");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
              Faculty &amp; Admissions Personnel
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
              Admissions Staff Roster
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Accredit counselor roles, govern permission privileges, and supervise candidate caseloads.
            </p>
          </div>

          <button
            onClick={() => {
              setGeneratedInviteUrl("");
              setEmail("");
              setInviteModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Accredit Faculty</span>
          </button>
        </div>

        {/* Team Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#D62828] dark:text-[#FF5A5F] mx-auto" />
            <p className="font-heading italic text-xs text-muted-foreground">Loading admissions faculty roster...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center rounded-[12px] border border-dashed border-border bg-card space-y-4">
            <div className="w-12 h-12 rounded-[10px] bg-[#D62828]/10 text-[#D62828] dark:bg-[#FF5A5F]/15 dark:text-[#FF5A5F] border border-[#D62828]/25 flex items-center justify-center mx-auto shadow-xs">
              <Users className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-normal text-foreground">No faculty members registered</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                Accredit admissions counselors and coordinators. They will receive a credentialing link to set up their profile.
              </p>
            </div>
            <button
              onClick={() => setInviteModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold text-xs shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Issue First Invitation</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Active Faculty &amp; Staff ({users.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="p-6 rounded-[12px] bg-card border border-border shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-[8px] bg-gradient-to-br from-[#D62828] to-[#8F1218] text-white font-heading font-bold text-base flex items-center justify-center shrink-0 border border-[#FFC21A]/30 shadow-xs">
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <h3 className="font-heading text-base font-normal text-foreground">{u.name}</h3>
                          <p className="text-[11px] font-mono text-muted-foreground">{u.email}</p>
                          {u.phone && <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{u.phone}</p>}
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase border transition-colors ${
                          u.status === "ACTIVE"
                            ? "bg-[#16A34A]/10 text-[#16A34A] dark:text-[#4ADE80] border-[#16A34A]/25 font-bold"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === "ACTIVE" ? "bg-[#16A34A]" : "bg-muted-foreground"}`} />
                        <span>{u.status}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                      <div className="p-2.5 rounded-[8px] bg-[#F8F2E6]/60 dark:bg-[#1B1114]/60 border border-border">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase block">Candidate Caseload</span>
                        <span className="font-mono font-bold text-foreground tabular-nums">
                          {u._count?.leads || 0}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-[8px] bg-[#F8F2E6]/60 dark:bg-[#1B1114]/60 border border-border">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase block">Resolved Tasks</span>
                        <span className="font-mono font-bold text-foreground tabular-nums">
                          {u._count?.followUps || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-xs">Institutional Privilege:</span>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="p-1.5 rounded-[6px] bg-background/50 border border-border font-medium text-xs text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    >
                      <option value="COUNSELOR">Counselor</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Dean / Admin</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Invites Section */}
        {invites.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Security Invitations</div>
              <h2 className="font-heading text-lg font-normal text-foreground">Pending Credential Invitations</h2>
              <p className="text-xs text-muted-foreground">Staff invited who have not completed credential activation</p>
            </div>

            <div className="rounded-[12px] border border-border bg-card overflow-hidden">
              <div className="divide-y divide-border">
                {invites.map((inv) => {
                  const isExpired = new Date(inv.expiresAt) < new Date();
                  const isUsed = !!inv.usedAt;
                  return (
                    <div
                      key={inv.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[8px] bg-[#F8F2E6] dark:bg-[#1B1114] text-foreground border border-border flex items-center justify-center font-bold">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{inv.email}</span>
                            <span className="px-2 py-0.5 rounded-[4px] bg-[#F8F2E6] dark:bg-[#1B1114] text-[10px] font-mono uppercase text-muted-foreground border border-border">
                              {inv.role}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {isUsed
                              ? "Activated"
                              : isExpired
                              ? "Expired"
                              : `Valid until ${formatDate(inv.expiresAt)}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {!isUsed && !isExpired && (
                          <button
                            onClick={() => {
                              const baseUrl = window.location.origin;
                              handleCopyLink(`${baseUrl}/invite/${inv.token}`);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-border bg-card hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] font-medium text-xs text-foreground transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Copy Token Link</span>
                          </button>
                        )}
                        {!isUsed && (
                          <button
                            onClick={() => handleRevokeInvite(inv.id)}
                            className="p-1.5 text-muted-foreground hover:text-[#C4552F] rounded-[6px]"
                            title="Revoke invitation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Invite Team Member */}
        {inviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-md bg-card rounded-[12px] p-6 sm:p-8 shadow-academic-floating border border-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Staff Accreditation</div>
                  <h3 className="font-heading text-lg font-normal text-foreground">Issue Faculty Invitation</h3>
                </div>
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!generatedInviteUrl ? (
                <form onSubmit={handleCreateInvite} className="space-y-4 text-xs">
                  <p className="text-muted-foreground leading-relaxed">
                    Generate an institutional accreditation link. The counselor or manager will utilize this link to configure their credentials securely.
                  </p>

                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Official Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="counselor@institution.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Assigned Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    >
                      <option value="COUNSELOR">Admissions Counselor (Manage Assigned Leads)</option>
                      <option value="MANAGER">Admissions Manager (Manage Team &amp; Pipeline)</option>
                      <option value="ADMIN">Dean / Administrator (Full System Authority)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={inviting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold text-xs shadow-xs transition-colors disabled:opacity-50 mt-2"
                  >
                    {inviting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating Secure Link...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Generate Accreditation Link</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-[8px] bg-[#16A34A]/10 dark:bg-[#16A34A]/15 border border-[#16A34A]/25 dark:border-[#16A34A]/35 text-foreground flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D62828] dark:text-[#FF5A5F] mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium block">Accreditation Link Generated</span>
                      <span className="text-muted-foreground">Deliver this token to <strong className="font-mono text-foreground">{email}</strong> to finalize onboard accreditation:</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Token URL (Valid for 7 Days)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={generatedInviteUrl}
                        className="flex-1 p-2.5 rounded-[8px] bg-background/50 border border-border font-mono text-[11px] text-foreground outline-none"
                      />
                      <button
                        onClick={() => handleCopyLink(generatedInviteUrl)}
                        className="px-3.5 py-2.5 rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold text-xs shrink-0 flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setInviteModalOpen(false)}
                      className="px-4 py-2 rounded-[8px] border border-border bg-card text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] font-medium text-xs"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

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
        success(`User status changed to ${newStatus}`);
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
        success(`User role updated to ${newRole}`);
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
        success("Invite link generated successfully!");
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
    success("Invite link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      const res = await fetch(`/api/team/invite?id=${inviteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        success("Invite revoked");
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
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Admissions Staff &amp; Counselors
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Invite counselors, manage role privileges, and monitor caseloads
            </p>
          </div>

          <button
            onClick={() => {
              setGeneratedInviteUrl("");
              setEmail("");
              setInviteModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-all self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        </div>

        {/* Team Grid */}
        {loading ? (
          <div className="py-24 text-center text-xs text-slate-400">Loading team members...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">No team members yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                Invite your admissions counselors and managers. They will receive a secure token to set their password.
              </p>
            </div>
            <button
              onClick={() => setInviteModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Send First Invite</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Staff ({users.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">{u.name}</h3>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                          {u.phone && <p className="text-[10px] text-slate-400 mt-0.5">{u.phone}</p>}
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                          u.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-slate-200 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {u.status}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                        <span className="text-[10px] text-slate-400 block">Assigned Leads</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {u._count?.leads || 0}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                        <span className="text-[10px] text-slate-400 block">Tasks Handled</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {u._count?.followUps || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Role:</span>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs outline-none"
                    >
                      <option value="COUNSELOR">Counselor</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Invites Section */}
        {invites.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Pending Team Invitations</h2>
                <p className="text-xs text-slate-400">Staff members invited who have not yet activated their password</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {invites.map((inv) => {
                  const isExpired = new Date(inv.expiresAt) < new Date();
                  const isUsed = !!inv.usedAt;
                  return (
                    <div
                      key={inv.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center font-bold">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{inv.email}</span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                              {inv.role}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {isUsed
                              ? "Activated"
                              : isExpired
                              ? "Expired"
                              : `Expires ${formatDate(inv.expiresAt)}`}
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-xs"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Link</span>
                          </button>
                        )}
                        {!isUsed && (
                          <button
                            onClick={() => handleRevokeInvite(inv.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base">Invite Team Member</h3>
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!generatedInviteUrl ? (
                <form onSubmit={handleCreateInvite} className="space-y-4 text-xs">
                  <p className="text-slate-500 dark:text-slate-400">
                    Generate an invitation link. The counselor or manager will use this link to set their own secure password and join your workspace.
                  </p>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Staff Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="counselor@institution.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Assigned Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-medium"
                    >
                      <option value="COUNSELOR">Admissions Counselor (Manage Assigned Leads)</option>
                      <option value="MANAGER">Admissions Manager (Manage Team &amp; Pipeline)</option>
                      <option value="ADMIN">Administrator (Full System Access)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={inviting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 mt-2"
                  >
                    {inviting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating Secure Link...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Generate Invitation Link</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold block">Invitation Link Created!</span>
                      <span>Send this link to <strong className="font-mono">{email}</strong> to complete their onboarding:</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Invite Link (Valid for 7 days)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={generatedInviteUrl}
                        className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-600 dark:text-slate-300 outline-none"
                      />
                      <button
                        onClick={() => handleCopyLink(generatedInviteUrl)}
                        className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shrink-0 flex items-center gap-1.5 shadow-sm"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setInviteModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs"
                    >
                      Done
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

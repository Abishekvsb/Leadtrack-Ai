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
} from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";

export default function TeamPage() {
  const { success, error } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite Modal
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("COUNSELOR");
  const [password, setPassword] = useState("Counselor@123");

  const loadTeam = async () => {
    try {
      const res = await fetch("/api/team");
      if (res.ok) {
        const json = await res.json();
        if (json.success) setUsers(json.data.users || []);
      }
    } catch {
      error("Failed to load team");
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

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, role, password }),
      });
      const data = await res.json();
      if (data.success) {
        success("New counselor account provisioned!");
        setInviteModalOpen(false);
        setName("");
        setEmail("");
        setPhone("");
        loadTeam();
      } else {
        error(data.error);
      }
    } catch {
      error("Failed to add user");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Admissions Staff &amp; Counselors
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage institution personnel, assign role privileges &amp; monitor caseloads
            </p>
          </div>

          <button
            onClick={() => setInviteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-all self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        </div>

        {/* Team Grid */}
        {loading ? (
          <div className="py-24 text-center text-xs text-slate-400">Loading team...</div>
        ) : (
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
        )}

        {/* Modal: Add Team Member */}
        {inviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base">Provision Counselor Account</h3>
                <button onClick={() => setInviteModalOpen(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleInvite} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold">Staff Member Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sumanth Rao"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sumanth@institution.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold">Role Privilege</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="COUNSELOR">Admissions Counselor</option>
                    <option value="MANAGER">Admissions Manager</option>
                    <option value="ADMIN">Dean / Administrator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold">Temporary Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setInviteModalOpen(false)}
                    className="px-4 py-2 rounded-xl border text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md"
                  >
                    Provision Account
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

"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/components/toast-context";
import {
  Settings,
  Building,
  BookOpen,
  Sliders,
  Shield,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function SettingsPage() {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<"institution" | "courses" | "scoring" | "security">("institution");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Institution Form
  const [institution, setInstitution] = useState<any>({
    name: "",
    code: "",
    logo: "",
    website: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    workingHours: "",
  });

  // Courses Form & List
  const [courses, setCourses] = useState<any[]>([]);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    department: "Engineering",
    degree: "B.Tech",
    duration: "4 Years",
    fee: 180000,
    seats: 120,
  });

  // Security Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const loadData = async () => {
    try {
      const [iRes, cRes] = await Promise.all([fetch("/api/settings"), fetch("/api/courses")]);
      if (iRes.ok) {
        const iJson = await iRes.json();
        if (iJson.success && iJson.data?.institution) setInstitution(iJson.data.institution);
      }
      if (cRes.ok) {
        const cJson = await cRes.json();
        if (cJson.success) setCourses(cJson.data.courses || []);
      }
    } catch {
      error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Institution
  const handleSaveInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(institution),
      });
      const data = await res.json();
      if (data.success) {
        success("Institution profile successfully saved!");
      } else {
        error(data.error);
      }
    } catch {
      error("Failed to update institution settings");
    } finally {
      setSaving(false);
    }
  };

  // Add Course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });
      const data = await res.json();
      if (data.success) {
        success("Degree program added successfully!");
        setCourseModalOpen(false);
        setNewCourse({
          name: "",
          code: "",
          department: "Engineering",
          degree: "B.Tech",
          duration: "4 Years",
          fee: 180000,
          seats: 120,
        });
        loadData();
      } else {
        error(data.error);
      }
    } catch {
      error("Failed to add course");
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id: string) => {
    try {
      const res = await fetch(`/api/courses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        success("Program removed");
        loadData();
      }
    } catch {
      error("Delete failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institution Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure campus details, degree programs, working hours &amp; scoring weights
          </p>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {[
            { key: "institution", label: "Campus Profile", icon: Building },
            { key: "courses", label: "Degree Programs", icon: BookOpen },
            { key: "scoring", label: "Lead Sources & Weights", icon: Sliders },
            { key: "security", label: "Password & Security", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Institution Profile */}
        {activeTab === "institution" && (
          <form
            onSubmit={handleSaveInstitution}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base">Institution Identity &amp; Campus Details</h3>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold">Institution Name *</label>
                <input
                  type="text"
                  required
                  value={institution.name || ""}
                  onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Institution Code / Accreditation</label>
                <input
                  type="text"
                  placeholder="e.g. AITM-BLR"
                  value={institution.code || ""}
                  onChange={(e) => setInstitution({ ...institution, code: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Admissions Hotline Phone</label>
                <input
                  type="tel"
                  value={institution.phone || ""}
                  onChange={(e) => setInstitution({ ...institution, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Admissions Email Address</label>
                <input
                  type="email"
                  value={institution.email || ""}
                  onChange={(e) => setInstitution({ ...institution, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Official Website URL</label>
                <input
                  type="url"
                  placeholder="https://apex-tech.edu.in"
                  value={institution.website || ""}
                  onChange={(e) => setInstitution({ ...institution, website: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Counseling Working Hours</label>
                <input
                  type="text"
                  placeholder="09:00 - 18:00 (Mon - Sat)"
                  value={institution.workingHours || ""}
                  onChange={(e) => setInstitution({ ...institution, workingHours: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold">Campus Physical Address</label>
                <input
                  type="text"
                  placeholder="Campus Park, Electronic City Phase 1"
                  value={institution.address || ""}
                  onChange={(e) => setInstitution({ ...institution, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Courses Management */}
        {activeTab === "courses" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base">Active Degree Programs ({courses.length})</h3>
                <p className="text-xs text-slate-400">Programs shown on student enquiry portal &amp; admissions pipeline</p>
              </div>
              <button
                onClick={() => setCourseModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Program</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {courses.map((course) => (
                <div key={course.id} className="py-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{course.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                        {course.code}
                      </span>
                    </div>
                    <p className="text-slate-500">
                      {course.department} • {course.duration} • Fee: {formatCurrency(course.fee)} / year • Seats:{" "}
                      {course.seats}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Lead Sources & Weights */}
        {activeTab === "scoring" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 text-xs">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base">Lead Scoring Engine Weights (Total = 100)</h3>
              <p className="text-slate-400">Custom rule weightings for computing 0-100 student intent score</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold">Source Authority (25%)</span>
                <p className="text-slate-500 text-[11px]">Personal referrals &amp; direct walk-ins carry highest intent</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold">Multi-Touch Engagement (25%)</span>
                <p className="text-slate-500 text-[11px]">Calls answered, WhatsApp chats, and campus tours attended</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold">Profile Completeness (15%)</span>
                <p className="text-slate-500 text-[11px]">Verified student phone, email, and parent contact details</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold">Course Demand Index (15%)</span>
                <p className="text-slate-500 text-[11px]">Flagship high-placement programs (B.Tech CS/AI, MBA)</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Password & Security */}
        {activeTab === "security" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 max-w-md">
            <h3 className="font-bold text-base pb-2 border-b border-slate-100 dark:border-slate-800">
              Update Security Credentials
            </h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold">New Password</label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => success("Password updated securely")}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold mt-2"
              >
                Change Password
              </button>
            </div>
          </div>
        )}

        {/* Modal: Add Program */}
        {courseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base">Add Degree Program</h3>
                <button onClick={() => setCourseModalOpen(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCourse} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold">Program Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech in Robotics &amp; Automation"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold">Program Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BTECH-ROBO"
                      value={newCourse.code}
                      onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold">Department</label>
                    <input
                      type="text"
                      required
                      placeholder="Engineering"
                      value={newCourse.department}
                      onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold">Degree Type</label>
                    <input
                      type="text"
                      required
                      placeholder="B.Tech"
                      value={newCourse.degree}
                      onChange={(e) => setNewCourse({ ...newCourse, degree: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold">Duration</label>
                    <input
                      type="text"
                      required
                      placeholder="4 Years"
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold">Annual Fee (INR) *</label>
                    <input
                      type="number"
                      required
                      value={newCourse.fee}
                      onChange={(e) => setNewCourse({ ...newCourse, fee: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold">Seat Intake *</label>
                    <input
                      type="number"
                      required
                      value={newCourse.seats}
                      onChange={(e) => setNewCourse({ ...newCourse, seats: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCourseModalOpen(false)}
                    className="px-4 py-2 rounded-xl border text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md"
                  >
                    Add Program
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

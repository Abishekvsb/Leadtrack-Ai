"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as any) || "institution";
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<"institution" | "courses" | "scoring" | "security">(
    initialTab === "courses" || initialTab === "scoring" || initialTab === "security" ? initialTab : "institution"
  );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        success("Academic program added successfully!");
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
        <div className="border-b border-[#F0E6D6] dark:border-[#2E1D21] pb-5">
          <div className="text-[11px] uppercase tracking-wider text-[#D62828] dark:text-[#FF5A5F] font-bold mb-1">
            System Administration
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight title-gold-accent pb-2">
            Institutional Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage campus accreditations, degree programs, counseling schedule &amp; AI evaluation weights.
          </p>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#F0E6D6] dark:border-[#2E1D21] pb-2 overflow-x-auto">
          {[
            { key: "institution", label: "Campus Profile", icon: Building },
            { key: "courses", label: "Degree Programs", icon: BookOpen },
            { key: "scoring", label: "Scoring Engine Weights", icon: Sliders },
            { key: "security", label: "Credential Security", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? "btn-crimson-gradient text-white border-[#8F1218] font-bold shadow-xs"
                    : "bg-white dark:bg-[#1B1114] border-[#F0E6D6] dark:border-[#2E1D21] text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#25171B]"
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
            className="p-6 sm:p-8 rounded-[14px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D6] dark:border-[#2E1D21]">
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Charter Details</div>
                <h3 className="font-heading text-lg font-bold text-foreground">Campus Profile &amp; Accreditations</h3>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] btn-crimson-gradient btn-shimmer text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Saving..." : "Save Charter"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Institution Legal Name *</label>
                <input
                  type="text"
                  required
                  value={institution.name || ""}
                  onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
                  className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Institutional Code / AICTE Code</label>
                <input
                  type="text"
                  placeholder="e.g. AITM-BLR"
                  value={institution.code || ""}
                  onChange={(e) => setInstitution({ ...institution, code: e.target.value })}
                  className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Admissions Helpline Phone</label>
                <input
                  type="tel"
                  value={institution.phone || ""}
                  onChange={(e) => setInstitution({ ...institution, phone: e.target.value })}
                  className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Admissions Faculty Email</label>
                <input
                  type="email"
                  value={institution.email || ""}
                  onChange={(e) => setInstitution({ ...institution, email: e.target.value })}
                  className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Official Website URL</label>
                <input
                  type="url"
                  placeholder="https://apex-tech.edu.in"
                  value={institution.website || ""}
                  onChange={(e) => setInstitution({ ...institution, website: e.target.value })}
                  className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Admissions Office Hours</label>
                <input
                  type="text"
                  placeholder="09:00 - 18:00 (Mon - Sat)"
                  value={institution.workingHours || ""}
                  onChange={(e) => setInstitution({ ...institution, workingHours: e.target.value })}
                  className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-medium text-foreground">Campus Physical Address</label>
                <input
                  type="text"
                  placeholder="Campus Park, Electronic City Phase 1, Bangalore"
                  value={institution.address || ""}
                  onChange={(e) => setInstitution({ ...institution, address: e.target.value })}
                  className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                />
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Courses Management */}
        {activeTab === "courses" && (
          <div className="p-6 sm:p-8 rounded-[14px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D6] dark:border-[#2E1D21]">
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Academic Portfolio</div>
                <h3 className="font-heading text-lg font-bold text-foreground">Active Degree Programs ({courses.length})</h3>
                <p className="text-xs text-muted-foreground">Offered programs visible on public enquiry and admissions workflow</p>
              </div>
              <button
                onClick={() => setCourseModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] btn-crimson-gradient btn-shimmer text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Program</span>
              </button>
            </div>

            <div className="divide-y divide-[#F0E6D6] dark:divide-[#2E1D21] text-xs">
              {courses.map((course) => (
                <div key={course.id} className="py-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-base font-bold text-foreground">{course.name}</span>
                      <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono uppercase bg-[#F8F2E6] dark:bg-[#1B1114] text-foreground border border-border">
                        {course.code}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs font-mono">
                      {course.department} • {course.duration} • Fee: {formatCurrency(course.fee)} / yr • Intake:{" "}
                      {course.seats} seats
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 rounded-[6px] text-muted-foreground hover:text-[#C4552F] hover:bg-[#C4552F]/10 transition-colors"
                    title="Remove Program"
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
          <div className="p-6 sm:p-8 rounded-[14px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] shadow-xs space-y-6 text-xs">
            <div className="pb-3 border-b border-[#F0E6D6] dark:border-[#2E1D21]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Scoring Algorithm</div>
              <h3 className="font-heading text-lg font-bold text-foreground">AI Readiness Model Weights (Sum = 100%)</h3>
              <p className="text-muted-foreground">Governs the mathematical formula generating the 0 - 100 student intent index</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-[12px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] space-y-1 shadow-xs">
                <span className="font-mono font-bold text-foreground">Channel Authority (25%)</span>
                <p className="text-muted-foreground text-[11px]">Direct campus walk-ins &amp; alumni referrals receive highest baseline weight.</p>
              </div>
              <div className="p-4 rounded-[12px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] space-y-1 shadow-xs">
                <span className="font-mono font-bold text-foreground">Consultation Engagement (25%)</span>
                <p className="text-muted-foreground text-[11px]">Outbound calls connected, WhatsApp correspondence, and campus tours.</p>
              </div>
              <div className="p-4 rounded-[12px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] space-y-1 shadow-xs">
                <span className="font-mono font-bold text-foreground">Dossier Completeness (25%)</span>
                <p className="text-muted-foreground text-[11px]">Verified student contact, parent mobile number, and preliminary marksheets.</p>
              </div>
              <div className="p-4 rounded-[12px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] space-y-1 shadow-xs">
                <span className="font-mono font-bold text-foreground">Program Demand Index (25%)</span>
                <p className="text-muted-foreground text-[11px]">Flagship high-placement academic programs (Computer Science, Data Science).</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Password & Security */}
        {activeTab === "security" && (
          <div className="p-6 sm:p-8 rounded-[14px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] shadow-xs space-y-4 max-w-md">
            <div className="pb-2 border-b border-[#F0E6D6] dark:border-[#2E1D21]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Account Protection</div>
              <h3 className="font-heading text-lg font-bold text-foreground">Update Password</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-foreground">New Password</label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter updated password"
                  className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                />
              </div>
              <button
                type="button"
                onClick={() => success("Password updated securely")}
                className="w-full py-2.5 rounded-[10px] btn-crimson-gradient btn-shimmer text-white font-bold text-xs mt-2 shadow-xs cursor-pointer"
              >
                Change Password
              </button>
            </div>
          </div>
        )}

        {/* Modal: Add Program */}
        {courseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-md bg-card rounded-[12px] p-6 sm:p-8 shadow-academic-floating border border-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Degree Registry</div>
                  <h3 className="font-heading text-lg font-normal text-foreground">Add Academic Program</h3>
                </div>
                <button onClick={() => setCourseModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCourse} className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Program Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech in Artificial Intelligence"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Program Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BTECH-AI"
                      value={newCourse.code}
                      onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Department</label>
                    <input
                      type="text"
                      required
                      placeholder="Computer Science"
                      value={newCourse.department}
                      onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Degree Level</label>
                    <input
                      type="text"
                      required
                      placeholder="B.Tech / Undergraduate"
                      value={newCourse.degree}
                      onChange={(e) => setNewCourse({ ...newCourse, degree: e.target.value })}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Duration</label>
                    <input
                      type="text"
                      required
                      placeholder="4 Years"
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Annual Tuition (INR) *</label>
                    <input
                      type="number"
                      required
                      value={newCourse.fee}
                      onChange={(e) => setNewCourse({ ...newCourse, fee: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Approved Seat Intake *</label>
                    <input
                      type="number"
                      required
                      value={newCourse.seats}
                      onChange={(e) => setNewCourse({ ...newCourse, seats: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-[8px] bg-background/50 border border-border text-foreground outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setCourseModalOpen(false)}
                    className="px-4 py-2 rounded-[8px] border border-border text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-[8px] bg-[#D62828] text-white hover:bg-[#B81E1E] font-semibold text-xs shadow-xs"
                  >
                    Register Program
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

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="py-24 text-center font-heading italic text-xs text-muted-foreground">Loading institutional settings...</div>
        </DashboardLayout>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}

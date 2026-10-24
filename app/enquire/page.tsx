"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Compass,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function PublicEnquiryPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    phone: "",
    city: "",
    courseId: "",
    leadSource: "Website",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Load active courses
  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setCourses(data.data.courses || []);
            if (data.data.courses?.length > 0) {
              setFormData((prev) => ({ ...prev, courseId: data.data.courses[0].id }));
            }
          }
        }
      } catch {}
    }
    loadCourses();
  }, []);

  const filledCount = [
    formData.studentName.trim(),
    formData.email.trim(),
    formData.phone.trim(),
    formData.city.trim(),
    formData.courseId,
  ].filter(Boolean).length;
  const progressPercent = Math.round((filledCount / 5) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setDuplicateWarning(null);
    setLoading(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 409 || data.isDuplicate) {
        setDuplicateWarning(data.error);
        setLoading(false);
        return;
      }

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to submit enquiry. Please check your inputs.");
        setLoading(false);
        return;
      }

      // Success Celebration with Royal Crimson and Gold Confetti
      setSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#D62828", "#FFC21A", "#FFE08A", "#16A34A", "#FF5A5F"],
      });
    } catch {
      setErrorMessage("Network error submitting enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9EE] dark:bg-[#120A0C] py-12 px-4 sm:px-6 flex items-center justify-center text-foreground font-sans relative overflow-hidden">
      {/* Subtle Aurora Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-96 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-[#D62828]/10 via-[#FFC21A]/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-2xl w-full bg-card rounded-[16px] p-6 sm:p-10 border border-border shadow-card space-y-7 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9EE] dark:bg-[#1B1114] text-[#8A5A00] dark:text-[#FFD25A] text-[11px] font-mono uppercase tracking-wider border border-[#FFC21A]/40 shadow-xs font-bold">
            <Compass className="w-3.5 h-3.5 text-[#FFC21A]" />
            <span>Admissions Portal &amp; Candidate Registry</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Admissions Candidacy Enquiry
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Submit your particulars to receive official syllabus prospectuses, fee schedule disclosures, and merit scholarship eligibility criteria.
          </p>
        </div>

        {/* Gold Progress Indicator */}
        {!submitted && (
          <div className="space-y-1.5 p-3.5 rounded-[12px] bg-[#F8F2E6]/70 dark:bg-[#1B1114]/70 border border-border">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-muted-foreground font-medium uppercase tracking-wider">
                Dossier Completion
              </span>
              <span className="text-[#8A5A00] dark:text-[#FFD25A] font-bold">
                {progressPercent}% Complete
              </span>
            </div>
            <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border/80">
              <div
                className="h-full bg-gradient-to-r from-[#D62828] via-[#FF5A5F] to-[#FFC21A] transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(6, progressPercent)}%` }}
              />
            </div>
          </div>
        )}

        {submitted ? (
          <div className="p-8 sm:p-10 rounded-[14px] bg-[#F8F2E6]/60 dark:bg-[#1B1114]/60 border border-[#FFC21A]/40 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-[12px] bg-gradient-to-br from-[#16A34A] to-[#15803D] text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Candidacy Dossier Registered!
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-bold text-foreground">{formData.studentName}</span>. Your enquiry has been balanced to our Senior Admissions Advisory faculty. You will receive course documentation and consultation via WhatsApp and email shortly.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    studentName: "",
                    email: "",
                    phone: "",
                    city: "",
                    courseId: courses[0]?.id || "",
                    leadSource: "Website",
                    message: "",
                  });
                }}
                className="px-5 py-2.5 rounded-[10px] border border-border bg-surface text-xs font-semibold text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] transition-colors shadow-xs"
              >
                Submit Another Enquiry
              </button>
              <Link
                href="/"
                className="btn-crimson-gradient btn-shimmer px-5 py-2.5 rounded-[10px] text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02]"
              >
                Return to Institutional Overview
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {duplicateWarning && (
              <div className="p-3.5 rounded-[10px] bg-[#FFC21A]/15 border border-[#FFC21A]/35 flex items-start gap-3 text-xs text-[#8A5A00] dark:text-[#FFD25A]">
                <AlertCircle className="w-4 h-4 text-[#FFC21A] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-heading font-bold">Existing Candidate Profile Identified</p>
                  <p>{duplicateWarning}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-[10px] bg-[#D62828]/10 border border-[#D62828]/25 text-xs text-[#D62828] dark:text-[#FF5A5F] font-medium">
                {errorMessage}
              </div>
            )}

            {/* Student Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Candidate Full Name <span className="text-[#D62828] dark:text-[#FF5A5F]">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-background/50 border border-border text-foreground placeholder:text-muted-foreground/60 focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 text-xs outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Email Address <span className="text-[#D62828] dark:text-[#FF5A5F]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-background/50 border border-border text-foreground placeholder:text-muted-foreground/60 focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 text-xs outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Mobile Contact (WhatsApp) <span className="text-[#D62828] dark:text-[#FF5A5F]">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-background/50 border border-border text-foreground placeholder:text-muted-foreground/60 focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 text-xs outline-none transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            {/* City & Course */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Domicile City / State <span className="text-[#D62828] dark:text-[#FF5A5F]">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bangalore, Karnataka"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-background/50 border border-border text-foreground placeholder:text-muted-foreground/60 focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 text-xs outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Academic Program <span className="text-[#D62828] dark:text-[#FF5A5F]">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-background/50 border border-border text-foreground focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 text-xs outline-none transition-colors"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.degree})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Lead Source */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Discovery Channel
              </label>
              <select
                value={formData.leadSource}
                onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                className="w-full px-3 py-2.5 rounded-[10px] bg-background/50 border border-border text-foreground focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 text-xs outline-none transition-colors font-mono text-[11px]"
              >
                <option value="Website">Official College Website</option>
                <option value="Instagram">Instagram Campaign</option>
                <option value="Facebook">Facebook Campaign</option>
                <option value="Google Ads">Search Engine Discovery</option>
                <option value="Education Fair">Academic Exposition / Fair</option>
                <option value="Referral">Alumni / Peer Referral</option>
                <option value="Walk-in">Direct Campus Reception Walk-in</option>
                <option value="WhatsApp">Institutional WhatsApp Community</option>
              </select>
            </div>

            {/* Message / Questions */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Specific Questions &amp; Area of Focus (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Inquire regarding merit scholarships, residential quarters, research laboratories, or placement records..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 rounded-[10px] bg-background/50 border border-border text-foreground placeholder:text-muted-foreground/60 focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 text-xs outline-none resize-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-crimson-gradient btn-shimmer w-full flex items-center justify-center gap-2 py-3.5 rounded-[10px] text-white font-bold text-xs shadow-md transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#FFC21A]" />
                  <span>Transmitting Candidacy Dossier...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#FFC21A]" />
                  <span>Transmit Admissions Enquiry</span>
                </>
              )}
            </button>

            <div className="text-center pt-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Candidate particulars are encrypted and governed under institutional privacy statutes.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

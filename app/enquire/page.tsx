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
  HelpCircle,
  ShieldCheck,
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

      // Success
      setSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      setErrorMessage("Network error submitting enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 flex items-center justify-center text-slate-900 dark:text-slate-100">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admissions Portal & Enquiry Desk</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
            Apply / Enquire for Admissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Submit your details below to receive comprehensive course brochures, fee structures, and scholarship eligibility criteria.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-50 to-teal-50/50 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-500/30 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-emerald-900 dark:text-emerald-200">
                Enquiry Successfully Received!
              </h2>
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-bold">{formData.studentName}</span>! Your profile has been assigned to our
                Senior Admissions Counselor. We will reach out on WhatsApp and email with course brochures and scholarship criteria.
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
                className="px-6 py-2.5 rounded-xl border border-emerald-500/30 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
              >
                Submit Another Enquiry
              </button>
              <Link
                href="/"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {duplicateWarning && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Duplicate Enquiry Detected</p>
                  <p>{duplicateWarning}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400">
                {errorMessage}
              </div>
            )}

            {/* Student Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Student Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-xs outline-none"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="student@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mobile Number (WhatsApp) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* City & Course */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Current City / State <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bangalore, Karnataka"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Degree Program of Interest <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-xs outline-none"
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
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                How did you hear about us?
              </label>
              <select
                value={formData.leadSource}
                onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-xs outline-none"
              >
                <option value="Website">Official College Website</option>
                <option value="Instagram">Instagram Ad / Post</option>
                <option value="Facebook">Facebook</option>
                <option value="Google Ads">Google Search</option>
                <option value="Education Fair">Education Fair / Expo</option>
                <option value="Referral">Friend or Senior Referral</option>
                <option value="Walk-in">Direct Campus Walk-in</option>
                <option value="WhatsApp">WhatsApp Community</option>
              </select>
            </div>

            {/* Message / Questions */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Specific Questions / Interests (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Ask about merit scholarships, hostel accommodation, lab facilities, or placement records..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-xs outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xl shadow-indigo-500/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Enquiry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Student Enquiry</span>
                </>
              )}
            </button>

            <div className="text-center pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Your contact details are encrypted and kept confidential. Zero spam guarantee.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

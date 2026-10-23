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
    <div className="min-h-screen bg-[#F6F2EA] dark:bg-[#0F1412] py-12 px-4 sm:px-6 flex items-center justify-center text-[#1B1A17] dark:text-[#ECE8DF] font-sans">
      <div className="max-w-2xl w-full bg-white dark:bg-[#171D1A] rounded-xl p-6 sm:p-10 border border-[#E4DDD0] dark:border-[#26302B] shadow-xs space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FAF7F0] dark:bg-[#131916] text-[#0F3D33] dark:text-[#4FB89A] text-[11px] font-mono uppercase tracking-wider border border-[#E4DDD0] dark:border-[#26302B]">
            <Compass className="w-3.5 h-3.5 text-[#E0A030]" />
            <span>Admissions Portal &amp; Candidate Registry</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1B1A17] dark:text-[#ECE8DF]">
            Admissions Candidacy Enquiry
          </h1>
          <p className="text-xs sm:text-sm text-[#6B665C] dark:text-[#959187] max-w-lg mx-auto font-sans leading-relaxed">
            Submit your particulars to receive official syllabus prospectuses, fee schedule disclosures, and merit scholarship eligibility criteria.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-xl bg-[#FAF7F0] dark:bg-[#131916] border border-[#0F3D33]/30 dark:border-[#4FB89A]/30 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-lg bg-[#0F3D33] dark:bg-[#4FB89A] text-[#F6F2EA] dark:text-[#0F1412] flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#0F3D33] dark:text-[#4FB89A]">
                Candidacy Dossier Registered
              </h2>
              <p className="text-xs sm:text-sm text-[#6B665C] dark:text-[#959187] max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-[#1B1A17] dark:text-[#ECE8DF]">{formData.studentName}</span>. Your enquiry has been balanced to our Senior Admissions Advisory faculty. You will receive course documentation and consultation via WhatsApp and email shortly.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5">
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
                className="px-5 py-2.5 rounded-lg border border-[#E4DDD0] dark:border-[#26302B] bg-white dark:bg-[#171D1A] text-xs font-medium text-[#1B1A17] dark:text-[#ECE8DF] hover:bg-[#FAF7F0] dark:hover:bg-[#1E2622] transition-colors"
              >
                Submit Another Enquiry
              </button>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-lg bg-[#0F3D33] hover:bg-[#165447] dark:bg-[#4FB89A] dark:hover:bg-[#3ea688] text-[#F6F2EA] dark:text-[#0F1412] text-xs font-medium shadow-2xs transition-colors"
              >
                Return to Institutional Overview
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {duplicateWarning && (
              <div className="p-3.5 rounded-lg bg-[#E0A030]/10 border border-[#E0A030]/30 flex items-start gap-3 text-xs text-[#B87A14] dark:text-[#E0A030]">
                <AlertCircle className="w-4 h-4 text-[#E0A030] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-serif font-bold">Existing Candidate Profile Identified</p>
                  <p className="font-sans">{duplicateWarning}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-lg bg-[#C4552F]/10 border border-[#C4552F]/25 text-xs text-[#C4552F]">
                {errorMessage}
              </div>
            )}

            {/* Student Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1B1A17] dark:text-[#ECE8DF]">
                Candidate Full Name <span className="text-[#C4552F]">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B665C] dark:text-[#959187]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#0F1412] border border-[#E4DDD0] dark:border-[#26302B] text-[#1B1A17] dark:text-[#ECE8DF] placeholder-[#6B665C]/60 dark:placeholder-[#959187]/60 focus:border-[#0F3D33] dark:focus:border-[#4FB89A] text-xs outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1B1A17] dark:text-[#ECE8DF]">
                  Email Address <span className="text-[#C4552F]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B665C] dark:text-[#959187]" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#0F1412] border border-[#E4DDD0] dark:border-[#26302B] text-[#1B1A17] dark:text-[#ECE8DF] placeholder-[#6B665C]/60 dark:placeholder-[#959187]/60 focus:border-[#0F3D33] dark:focus:border-[#4FB89A] text-xs outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1B1A17] dark:text-[#ECE8DF]">
                  Mobile Contact (WhatsApp) <span className="text-[#C4552F]">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B665C] dark:text-[#959187]" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#0F1412] border border-[#E4DDD0] dark:border-[#26302B] text-[#1B1A17] dark:text-[#ECE8DF] placeholder-[#6B665C]/60 dark:placeholder-[#959187]/60 focus:border-[#0F3D33] dark:focus:border-[#4FB89A] text-xs outline-none transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            {/* City & Course */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1B1A17] dark:text-[#ECE8DF]">
                  Domicile City / State <span className="text-[#C4552F]">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B665C] dark:text-[#959187]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bangalore, Karnataka"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#0F1412] border border-[#E4DDD0] dark:border-[#26302B] text-[#1B1A17] dark:text-[#ECE8DF] placeholder-[#6B665C]/60 dark:placeholder-[#959187]/60 focus:border-[#0F3D33] dark:focus:border-[#4FB89A] text-xs outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1B1A17] dark:text-[#ECE8DF]">
                  Academic Program <span className="text-[#C4552F]">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B665C] dark:text-[#959187]" />
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#0F1412] border border-[#E4DDD0] dark:border-[#26302B] text-[#1B1A17] dark:text-[#ECE8DF] focus:border-[#0F3D33] dark:focus:border-[#4FB89A] text-xs outline-none transition-colors"
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
              <label className="text-xs font-semibold text-[#1B1A17] dark:text-[#ECE8DF]">
                Discovery Channel
              </label>
              <select
                value={formData.leadSource}
                onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#0F1412] border border-[#E4DDD0] dark:border-[#26302B] text-[#1B1A17] dark:text-[#ECE8DF] focus:border-[#0F3D33] dark:focus:border-[#4FB89A] text-xs outline-none transition-colors font-mono text-[11px]"
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
              <label className="text-xs font-semibold text-[#1B1A17] dark:text-[#ECE8DF]">
                Specific Questions &amp; Area of Focus (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Inquire regarding merit scholarships, residential quarters, research laboratories, or placement records..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 rounded-lg bg-[#FAF7F0] dark:bg-[#0F1412] border border-[#E4DDD0] dark:border-[#26302B] text-[#1B1A17] dark:text-[#ECE8DF] placeholder-[#6B665C]/60 dark:placeholder-[#959187]/60 focus:border-[#0F3D33] dark:focus:border-[#4FB89A] text-xs outline-none resize-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#0F3D33] hover:bg-[#165447] dark:bg-[#4FB89A] dark:hover:bg-[#3ea688] text-[#F6F2EA] dark:text-[#0F1412] font-semibold text-xs shadow-xs transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting Candidacy Dossier...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Transmit Admissions Enquiry</span>
                </>
              )}
            </button>

            <div className="text-center pt-2 flex items-center justify-center gap-2 text-[11px] text-[#6B665C] dark:text-[#959187]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0F3D33] dark:text-[#4FB89A]" />
              <span>Candidate particulars are encrypted and governed under institutional privacy statutes.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/toast-context";

export default function ForgotPasswordPage() {
  const { success, error } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        success("Password reset instructions dispatched.", "Email Sent");
      } else {
        error(data.error || "Failed to process request");
      }
    } catch {
      error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="max-w-md w-full bg-white dark:bg-[#1B1114] rounded-[16px] p-7 sm:p-8 border border-[#F0E6D6] dark:border-[#2E1D21] shadow-card space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#D62828] to-[#8F1218] flex items-center justify-center text-white shadow-xs border border-[#FFC21A]/30">
              <GraduationCap className="w-5 h-5 text-[#FFC21A] stroke-[1.75]" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              LeadTrack AI
            </span>
          </Link>
          <h1 className="font-heading text-2xl font-extrabold text-foreground tracking-tight title-gold-accent pb-1">Reset Password</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Enter your registered institutional email to receive a secure recovery link.
          </p>
        </div>

        {submitted ? (
          <div className="p-5 rounded-[10px] bg-background border border-border text-center space-y-3">
            <div className="w-10 h-10 rounded-[8px] bg-[#D62828]/10 text-[#D62828] dark:text-[#FF5A5F] border border-[#D62828]/25 rounded-[10px] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-medium text-foreground">
                Recovery Instructions Dispatched
              </h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                If an account exists for <span className="font-medium text-foreground">{email}</span>, a secure reset link valid for 2 hours has been dispatched.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#D62828] dark:text-[#FF5A5F] hover:underline pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground stroke-[1.5]" />
                <input
                  type="email"
                  required
                  placeholder="counselor@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-[8px] bg-surface border border-border focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-xs text-foreground transition-colors placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[8px] btn-crimson-gradient btn-shimmer text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching link...</span>
                </>
              ) : (
                <>
                  <span>Send Recovery Link</span>
                  <ArrowRight className="w-4 h-4 stroke-[1.5]" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


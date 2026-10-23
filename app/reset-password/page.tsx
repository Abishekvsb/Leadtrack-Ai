"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/toast-context";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { success, error } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!token) {
      setValidationError("Missing or invalid reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setCompleted(true);
        success("Password updated successfully! You may now sign in.", "Success");
      } else {
        setValidationError(data.error || "Reset failed");
        error(data.error || "Reset failed");
      }
    } catch {
      setValidationError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-card rounded-[12px] p-7 sm:p-8 border border-border shadow-academic-floating space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-[8px] bg-[#0F3D33] dark:bg-[#4FB89A] flex items-center justify-center text-[#F6F2EA] dark:text-[#0F1412] shadow-xs">
            <GraduationCap className="w-5 h-5 stroke-[1.5]" />
          </div>
          <span className="font-serif text-xl font-normal tracking-tight text-foreground">
            LeadTrack AI
          </span>
        </Link>
        <h1 className="font-serif text-2xl font-normal text-foreground tracking-tight">Set New Password</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Enter your updated institutional password below.
        </p>
      </div>

      {validationError && (
        <div className="p-3.5 rounded-[8px] bg-[#C4552F]/10 border border-[#C4552F]/30 text-[#C4552F] text-xs font-medium">
          {validationError}
        </div>
      )}

      {completed ? (
        <div className="p-5 rounded-[10px] bg-background border border-border text-center space-y-3">
          <div className="w-10 h-10 rounded-[8px] bg-[#0F3D33]/10 dark:bg-[#4FB89A]/15 text-[#0F3D33] dark:text-[#4FB89A] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <h2 className="font-serif text-sm font-medium text-foreground">
              Password Reset Complete
            </h2>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Your password has been securely updated. You can now access your counselor workspace.
            </p>
          </div>
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-[8px] bg-[#0F3D33] hover:bg-[#165447] dark:bg-[#4FB89A] dark:hover:bg-[#63C7AA] text-[#F6F2EA] dark:text-[#0F1412] font-medium text-xs shadow-xs transition-colors"
          >
            Sign In with New Password →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground stroke-[1.5]" />
              <input
                type="password"
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-[8px] bg-surface border border-border focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-xs text-foreground transition-colors placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground stroke-[1.5]" />
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-[8px] bg-surface border border-border focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-xs text-foreground transition-colors placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[8px] bg-[#0F3D33] hover:bg-[#165447] dark:bg-[#4FB89A] dark:hover:bg-[#63C7AA] text-[#F6F2EA] dark:text-[#0F1412] font-medium text-xs shadow-xs transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 text-foreground">
      <Suspense fallback={<div className="text-xs text-muted-foreground">Loading form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/components/toast-context";

export default function LoginPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!email || !password) {
      setValidationError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setValidationError(data.error || "Authentication failed");
        error(data.error || "Invalid credentials", "Login Failed");
      } else {
        success(`Welcome back, ${data.data.user.name}!`, "Signed In");
        router.push("/dashboard");
      }
    } catch {
      setValidationError("Network error. Please try again.");
      error("Network error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Left Column: Full-height deep green panel with serif quote and SDG 4 mark */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 lg:p-16 bg-[#0F3D33] text-[#F6F2EA] relative border-r border-[#0A2B24] select-none">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[8px] bg-[#F6F2EA] text-[#0F3D33] flex items-center justify-center font-serif text-lg font-bold shadow-xs">
            <GraduationCap className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <span className="font-serif text-xl tracking-tight text-[#F6F2EA] block">
              LeadTrack AI
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#A7C8C0]">
              Admissions Intelligence
            </span>
          </div>
        </Link>

        {/* Center Quote / Academic Editorial Statement */}
        <div className="space-y-8 max-w-lg my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#165447] text-[#E0A030] text-[11px] font-semibold border border-[#1F6B5B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E0A030]" />
            <span className="uppercase tracking-wider">Institutional Integrity</span>
          </div>

          <blockquote className="font-serif text-3xl sm:text-4xl leading-tight font-normal text-[#F6F2EA] tracking-tight">
            &ldquo;Admissions is not a mechanism of exclusion, but the deliberate stewardship of human potential.&rdquo;
          </blockquote>

          <p className="text-sm text-[#D1E3DF] leading-relaxed font-sans">
            LeadTrack AI unifies inquiry response cadences, scores student engagement through transparent indicators, and empowers counselors with dignity and precision.
          </p>

          <div className="space-y-3 pt-2 text-xs text-[#D1E3DF] font-sans">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#E0A030] shrink-0 stroke-[1.5]" />
              <span>Predictive lead qualification without biased black-box algorithms</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#E0A030] shrink-0 stroke-[1.5]" />
              <span>Role-governed admissions pipelines for counselors & deans</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#E0A030] shrink-0 stroke-[1.5]" />
              <span>Full compliance logging and auditable counselor workflows</span>
            </div>
          </div>
        </div>

        {/* UN SDG 4 Mark */}
        <div className="pt-8 border-t border-[#165447] flex items-center justify-between text-xs text-[#A7C8C0]">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-[4px] bg-[#E0A030] text-[#0F3D33] font-bold text-[10px] flex items-center justify-center font-mono">
              4
            </div>
            <span className="tracking-tight">UN Sustainable Development Goal 4: Quality Education</span>
          </div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#E0A030]">Confidential</span>
        </div>
      </div>

      {/* Right Column: Clean Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="max-w-md w-full mx-auto space-y-7">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Sign In
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
              Access Admissions
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Enter your institutional credentials to open your counselor command workspace.
            </p>
          </div>

          {validationError && (
            <div className="p-3.5 rounded-[8px] bg-[#C4552F]/10 border border-[#C4552F]/30 text-[#C4552F] text-xs font-medium">
              {validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Institutional Email
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

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#0F3D33] dark:text-[#4FB89A] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground stroke-[1.5]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-[8px] bg-surface border border-border focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-xs text-foreground transition-colors placeholder:text-muted-foreground/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 stroke-[1.5]" /> : <Eye className="w-4 h-4 stroke-[1.5]" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-[4px] border-border text-[#0F3D33] focus:ring-accent"
                />
                <span>Remember this workstation for 7 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[8px] bg-[#0F3D33] hover:bg-[#165447] dark:bg-[#4FB89A] dark:hover:bg-[#63C7AA] text-[#F6F2EA] dark:text-[#0F1412] font-medium text-xs transition-colors shadow-xs disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4 stroke-[1.5]" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center text-xs text-muted-foreground pt-3 border-t border-border">
            <span>New educational institution? </span>
            <Link
              href="/register"
              className="font-medium text-[#0F3D33] dark:text-[#4FB89A] hover:underline"
            >
              Register institution
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


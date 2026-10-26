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
  Sparkles,
  Award,
  Users2,
  ShieldCheck,
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
      {/* Left Column: Full-height Royal Crimson Aurora panel with floating glass stat chips */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 lg:p-16 aurora-mesh text-white relative border-r border-[#8F1218] select-none overflow-hidden">
        {/* Decorative gold ambient glow */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-[#FFC21A]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#D62828]/40 blur-3xl pointer-events-none" />

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-[12px] bg-white text-[#D62828] flex items-center justify-center font-heading text-lg font-bold shadow-lg">
            <GraduationCap className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <span className="font-heading text-xl font-bold tracking-tight text-white block">
              LeadTrack AI
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFE08A]">
              Admissions Intelligence
            </span>
          </div>
        </Link>

        {/* Center Quote & Floating Glass Stat Chips */}
        <div className="space-y-8 max-w-lg my-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[8px] bg-white/10 backdrop-blur-md text-[#FFC21A] text-[11px] font-bold border border-white/15 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Royal Crimson Standard</span>
          </div>

          <blockquote className="font-heading text-3xl sm:text-4xl leading-tight font-extrabold text-white tracking-tight">
            &ldquo;Admissions is not a mechanism of exclusion, but the deliberate stewardship of human potential.&rdquo;
          </blockquote>

          <p className="text-sm text-white/85 leading-relaxed font-sans">
            LeadTrack AI unifies inquiry response cadences, scores student engagement through transparent indicators, and empowers counselors with dignity and precision.
          </p>

          {/* Three Floating Glass Stat Chips */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-[12px] bg-white/10 backdrop-blur-md border border-white/20 shadow-xs flex flex-col justify-between">
              <div className="w-8 h-8 rounded-[8px] bg-[#FFC21A] text-[#17141A] flex items-center justify-center font-bold mb-2 shadow-xs">
                <Award className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <p className="font-heading text-base sm:text-lg font-extrabold leading-tight text-white tabular-nums">99.4%</p>
                <p className="text-[9px] sm:text-[10px] text-white/75 uppercase tracking-wider font-semibold mt-0.5">SLA Speed</p>
              </div>
            </div>

            <div className="p-3.5 rounded-[12px] bg-white/10 backdrop-blur-md border border-white/20 shadow-xs flex flex-col justify-between">
              <div className="w-8 h-8 rounded-[8px] bg-white text-[#D62828] flex items-center justify-center font-bold mb-2 shadow-xs">
                <Users2 className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <p className="font-heading text-base sm:text-lg font-extrabold leading-tight text-white tabular-nums">3.4x</p>
                <p className="text-[9px] sm:text-[10px] text-white/75 uppercase tracking-wider font-semibold mt-0.5">Conversion</p>
              </div>
            </div>

            <div className="p-3.5 rounded-[12px] bg-white/10 backdrop-blur-md border border-white/20 shadow-xs flex flex-col justify-between">
              <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#FFE08A] to-[#FFC21A] text-[#17141A] flex items-center justify-center font-bold mb-2 shadow-xs">
                <Sparkles className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <p className="font-heading text-base sm:text-lg font-extrabold leading-tight text-white tabular-nums">&lt;12m</p>
                <p className="text-[9px] sm:text-[10px] text-white/75 uppercase tracking-wider font-semibold mt-0.5">AI Response</p>
              </div>
            </div>
          </div>
        </div>

        {/* UN SDG 4 Mark */}
        <div className="pt-8 border-t border-white/15 flex items-center justify-between text-xs text-white/80 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-[6px] bg-[#FFC21A] text-[#17141A] font-extrabold text-[11px] flex items-center justify-center font-mono shadow-xs">
              4
            </div>
            <span className="tracking-tight font-medium">UN Sustainable Development Goal 4: Quality Education</span>
          </div>
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#FFC21A]">Verified</span>
        </div>
      </div>

      {/* Right Column: Clean White Form with floating label feel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-surface">
        <div className="max-w-md w-full mx-auto space-y-7">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D62828] dark:text-[#FF5A5F]">
              Counselor Command Gateway
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight title-gold-accent pb-2">
              Access Admissions
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
              Enter your institutional credentials to open your admissions counselor workspace.
            </p>
          </div>

          {validationError && (
            <div className="p-3.5 rounded-[10px] bg-[#D62828]/10 border border-[#D62828]/30 text-[#D62828] dark:text-[#FF5A5F] text-xs font-bold">
              {validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-xs text-foreground transition-all placeholder:text-muted-foreground/60 shadow-xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#D62828] dark:text-[#FF5A5F] hover:underline"
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
                  className="w-full pl-10 pr-10 py-2.5 rounded-[10px] bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-xs text-foreground transition-all placeholder:text-muted-foreground/60 shadow-xs"
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
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground select-none font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-[4px] border-border text-[#D62828] focus:ring-accent"
                />
                <span>Remember this workstation for 7 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] btn-crimson-gradient btn-shimmer font-bold text-xs transition-all shadow-crimson-glow disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#FFC21A]" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
            <span>New educational institution? </span>
            <Link
              href="/register"
              className="font-bold text-[#D62828] dark:text-[#FF5A5F] hover:underline"
            >
              Register institution
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

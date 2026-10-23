"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Phone,
  Building,
  ArrowRight,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Award,
} from "lucide-react";
import { useToast } from "@/components/toast-context";

export default function RegisterPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isFirstRun, setIsFirstRun] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    institutionName: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/auth/register");
        const json = await res.json();
        if (json.success && json.data) {
          setIsFirstRun(json.data.isFirstRun);
        }
      } catch {
        // Fallback default
      } finally {
        setCheckingStatus(false);
      }
    }
    checkStatus();
  }, []);

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    if (!formData.terms) {
      setValidationError("You must accept the terms of service.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setValidationError(data.error || "Registration failed");
        error(data.error || "Could not register account");
      } else {
        success("Institution and Administrator account created successfully!", "Setup Complete");
        router.push("/dashboard");
      }
    } catch {
      setValidationError("Network error. Please try again.");
      error("Network error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="w-8 h-8 text-[#D62828] dark:text-[#FF5A5F] animate-spin" />
      </div>
    );
  }

  if (!isFirstRun) {
    return (
      <div className="min-h-screen flex bg-background text-foreground">
        {/* Left Column */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 lg:p-16 aurora-mesh text-white relative border-r border-[#8F1218] select-none">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-white text-[#D62828] flex items-center justify-center font-heading text-lg font-bold shadow-md">
              <GraduationCap className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <span className="font-heading text-xl font-bold tracking-tight text-white block">LeadTrack AI</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFE08A]">
                Institutional Security
              </span>
            </div>
          </Link>

          <div className="space-y-6 max-w-lg my-auto">
            <blockquote className="font-heading text-3xl sm:text-4xl leading-tight font-extrabold text-white tracking-tight">
              &ldquo;Security in education is the guardian of student trust and institutional honor.&rdquo;
            </blockquote>
            <p className="text-sm text-white/85 leading-relaxed font-sans">
              Institutional databases are restricted to verified admissions staff. Contact your Primary Administrator to generate a credentialed counselor invite.
            </p>
          </div>

          <div className="pt-8 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
            <span>UN SDG 4: Quality Higher Education</span>
            <span className="font-mono text-[11px] font-bold text-[#FFC21A]">SECURE GATEWAY</span>
          </div>
        </div>

        {/* Right Column: Closed Notice */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-surface">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="w-12 h-12 rounded-[12px] bg-[#FFC21A]/15 border border-[#FFC21A]/30 text-[#8A5A00] dark:text-[#FFD25A] flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D62828] dark:text-[#FF5A5F]">
                Institutional Access Policy
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight title-gold-accent pb-2">
                Public Registration Closed
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                This institution workspace has already been initialized. To protect institutional data, new counselors and staff are registered exclusively via Administrator invite links.
              </p>
            </div>

            <div className="p-4 rounded-[12px] bg-background border border-border text-left text-xs space-y-2">
              <span className="font-heading text-xs font-bold text-foreground block">How to join your campus workspace:</span>
              <p className="text-muted-foreground leading-relaxed">
                1. Contact your Admissions Dean or Primary Administrator.<br />
                2. Request an invite link dispatched from the Team management portal.<br />
                3. Open your unique token link to configure your counselor credentials.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] btn-crimson-gradient btn-shimmer font-bold text-xs transition-all shadow-crimson-glow"
              >
                <span>Return to Sign In</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Left Column: Full-height Royal Crimson panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 lg:p-16 aurora-mesh text-white relative border-r border-[#8F1218] select-none">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-white text-[#D62828] flex items-center justify-center font-heading text-lg font-bold shadow-md">
            <GraduationCap className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <span className="font-heading text-xl font-bold tracking-tight text-white block">LeadTrack AI</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFE08A]">
              Admissions Setup
            </span>
          </div>
        </Link>

        <div className="space-y-8 max-w-lg my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[8px] bg-white/10 backdrop-blur-md text-[#FFC21A] text-[11px] font-bold border border-white/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Foundation Protocol</span>
          </div>

          <blockquote className="font-heading text-3xl sm:text-4xl leading-tight font-extrabold text-white tracking-tight">
            &ldquo;An institution built upon clear insight guides each scholar toward true excellence.&rdquo;
          </blockquote>

          <p className="text-sm text-white/85 leading-relaxed font-sans">
            By initializing this workspace as Primary Administrator, you establish the admissions pipeline, configure team roles, and deploy autonomous SLA rules.
          </p>

          <div className="space-y-3 pt-2 text-xs text-white/85 font-sans">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#FFC21A] shrink-0 stroke-[2]" />
              <span>Full governance over institutional courses, intake cycles, and SLAs</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#FFC21A] shrink-0 stroke-[2]" />
              <span>Automated WhatsApp & Email templates with localized placeholders</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#FFC21A] shrink-0 stroke-[2]" />
              <span>Immutable audit trail tracking all counselor assignments and calls</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-[6px] bg-[#FFC21A] text-[#17141A] font-extrabold text-[11px] flex items-center justify-center font-mono">
              4
            </div>
            <span className="font-medium">UN SDG 4: Equitable &amp; Quality Higher Education</span>
          </div>
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#FFC21A]">Genesis Step</span>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-surface">
        <div className="max-w-lg w-full mx-auto space-y-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D62828] dark:text-[#FF5A5F]">
              Primary Administrator
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight title-gold-accent pb-2">
              Register Institution
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              Create your institution workspace. You will be assigned full Administrator credentials.
            </p>
          </div>

          {validationError && (
            <div className="p-3.5 rounded-[10px] bg-[#D62828]/10 border border-[#D62828]/30 text-[#D62828] dark:text-[#FF5A5F] text-xs font-bold">
              {validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Institution / University Name</label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground stroke-[1.5]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Cambridge Institute of Technology"
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2 text-xs rounded-[10px] bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Admin Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground stroke-[1.5]" />
                  <input
                    type="text"
                    required
                    placeholder="Dean / Director Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-[10px] bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 shadow-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Official Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground stroke-[1.5]" />
                  <input
                    type="tel"
                    inputMode="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-[10px] bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 shadow-xs"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Official Work Email (Admin Login)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground stroke-[1.5]" />
                <input
                  type="email"
                  inputMode="email"
                  required
                  placeholder="admin@institution.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2 text-xs rounded-[10px] bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 shadow-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground stroke-[1.5]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-9 py-2 text-xs rounded-[10px] bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5 stroke-[1.5]" /> : <Eye className="w-3.5 h-3.5 stroke-[1.5]" />}
                </button>
              </div>

              {formData.password && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength <= 1
                          ? "w-1/4 bg-[#D62828]"
                          : strength === 2
                          ? "w-2/4 bg-[#FFC21A]"
                          : strength === 3
                          ? "w-3/4 bg-[#E5A100]"
                          : "w-full bg-[#16A34A]"
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Strength: {strength <= 1 ? "Weak" : strength === 2 ? "Moderate" : strength === 3 ? "Strong" : "Excellent"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground stroke-[1.5]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2 text-xs rounded-[10px] bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 shadow-xs"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                className="mt-0.5 rounded-[4px] border-border text-[#D62828] focus:ring-accent"
              />
              <label htmlFor="terms" className="text-xs text-muted-foreground leading-tight select-none">
                I accept the LeadTrack AI Terms of Service, Privacy Policy, and campus data governance charters.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] btn-crimson-gradient btn-shimmer font-bold text-xs shadow-crimson-glow transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#FFC21A]" />
                  <span>Configuring workspace...</span>
                </>
              ) : (
                <>
                  <span>Initialize Institutional Workspace</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-muted-foreground pt-3 border-t border-border">
            Already registered?{" "}
            <Link href="/login" className="font-bold text-[#D62828] dark:text-[#FF5A5F] hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

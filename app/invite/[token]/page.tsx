"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  GraduationCap,
  Lock,
  User,
  Phone,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/components/toast-context";

export default function AcceptInvitePage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;
  const { success, error } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [inviteData, setInviteData] = useState<{
    email: string;
    role: string;
    institutionName: string;
    invitedByName: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function verifyInvite() {
      try {
        const res = await fetch(`/api/invite/${token}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          setErrorMessage(json.error || "This invitation is invalid or has expired.");
        } else {
          setInviteData(json.data);
        }
      } catch {
        setErrorMessage("Network error verifying your invitation.");
      } finally {
        setLoading(false);
      }
    }
    if (token) verifyInvite();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error("Please enter your name");
      return;
    }
    if (password.length < 8) {
      error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      error("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/invite/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        error(json.error || "Failed to set up account");
      } else {
        success("Welcome to the team! Your account is active.", "Account Activated");
        router.push("/dashboard");
      }
    } catch {
      error("Network error submitting password");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 text-[#D62828] dark:text-[#FF5A5F] animate-spin" />
      </div>
    );
  }

  if (errorMessage || !inviteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <div className="max-w-md w-full bg-card rounded-academic p-8 border border-border shadow-academic-floating text-center space-y-6">
          <div className="w-12 h-12 rounded-academic bg-[#C4552F]/10 border border-[#C4552F]/20 text-[#C4552F] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Invitation Unavailable
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {errorMessage || "This invitation link is not valid or has expired."}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-[10px] btn-crimson-gradient btn-shimmer text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.01]"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="max-w-md w-full bg-card rounded-academic p-8 border border-border shadow-academic-floating space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#D62828] to-[#8F1218] flex items-center justify-center text-white shadow-xs border border-[#FFC21A]/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-foreground">
              LeadTrack AI
            </span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFC21A]/15 border border-[#FFC21A]/35 text-[11px] font-bold text-[#8A5A00] dark:text-[#FFD25A]">
            <Sparkles className="w-3 h-3" />
            <span>Official Team Invitation</span>
          </div>

          <h2 className="font-heading text-2xl font-bold text-foreground">Complete Your Account Setup</h2>
          <p className="text-xs text-muted-foreground">
            You&apos;ve been invited by <span className="font-semibold text-foreground">{inviteData.invitedByName}</span> to join{" "}
            <span className="font-semibold text-[#D62828] dark:text-[#FF5A5F]">{inviteData.institutionName}</span> as an{" "}
            <span className="font-semibold text-foreground">{inviteData.role}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Email Address (Assigned)</label>
            <input
              type="email"
              disabled
              value={inviteData.email}
              className="w-full px-3 py-2 text-xs rounded-[10px] bg-muted border border-border text-muted-foreground cursor-not-allowed outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Your Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-[10px] bg-background border border-border focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 outline-none text-foreground"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                inputMode="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-[10px] bg-background border border-border focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 outline-none text-foreground"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Create Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-xs rounded-[10px] bg-background border border-border focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 outline-none text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-[10px] bg-background border border-border focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 outline-none text-foreground"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[10px] btn-crimson-gradient btn-shimmer text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.01] disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Activating Account...</span>
              </>
            ) : (
              <>
                <span>Set Password & Join Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

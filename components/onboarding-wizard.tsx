"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Building,
  GraduationCap,
  Users,
  Share2,
  Zap,
  ArrowRight,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/components/toast-context";

interface Step {
  id: string;
  title: string;
  description: string;
  href: string;
  isExternal?: boolean;
  completed: boolean;
}

interface OnboardingProps {
  onboarding: {
    steps: Step[];
    completedCount: number;
    totalSteps: number;
    progressPercent: number;
    isComplete: boolean;
    showOnboarding: boolean;
  };
}

const STEP_ICONS: Record<string, React.ElementType> = {
  institution: Building,
  courses: GraduationCap,
  counselors: Users,
  shareEnquiry: Share2,
  automations: Zap,
};

export function OnboardingWizard({ onboarding }: OnboardingProps) {
  const { success } = useToast();
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (!onboarding || !onboarding.showOnboarding) return null;

  const handleCopyEnquiryLink = () => {
    const base = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "https://leadtrack-ai.onrender.com");
    const url = `${base}/enquire`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    success("Public enquiry form link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="rounded-[14px] bg-card border border-border p-5 sm:p-6 royal-card shadow-card transition-all space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] bg-[#D62828]/10 dark:bg-[#FF5A5F]/15 border border-[#D62828]/25 text-[10px] font-bold uppercase tracking-wider text-[#D62828] dark:text-[#FF5A5F]">
            <Sparkles className="w-3 h-3 text-[#FFC21A] stroke-[2]" />
            <span>Institution Setup Checklist</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Admissions Workspace Preparation
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Complete these foundational steps to begin capturing, scoring, and converting student inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-foreground tabular-nums">
              {onboarding.completedCount} / {onboarding.totalSteps} Completed
            </span>
            <div className="w-36 h-2 rounded-full bg-muted mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D62828] to-[#FFC21A] transition-all duration-500 rounded-full"
                style={{ width: `${onboarding.progressPercent}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-[8px] text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
            title={collapsed ? "Expand checklist" : "Collapse checklist"}
          >
            {collapsed ? <ChevronDown className="w-4 h-4 stroke-[1.5]" /> : <ChevronUp className="w-4 h-4 stroke-[1.5]" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {onboarding.steps.map((step, idx) => {
            const Icon = STEP_ICONS[step.id] || Building;
            return (
              <div
                key={step.id}
                className={`p-4 rounded-[12px] border transition-all flex flex-col justify-between space-y-3.5 ${
                  step.completed
                    ? "bg-background/80 border-border"
                    : "bg-surface border-border hover:border-[#D62828]/40 dark:hover:border-[#FF5A5F]/40 shadow-xs"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-[8px] flex items-center justify-center font-bold text-xs ${
                          step.completed
                            ? "bg-[#D62828]/10 text-[#D62828] dark:bg-[#FF5A5F]/15 dark:text-[#FF5A5F]"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 stroke-[1.75]" />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider font-semibold">
                        0{idx + 1}
                      </span>
                    </div>

                    {step.completed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] dark:text-[#4ADE80]">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
                        <span>Done</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                        <Circle className="w-3 h-3 text-border stroke-[1.5]" />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-heading text-sm font-bold text-foreground tracking-tight">{step.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border">
                  {step.id === "shareEnquiry" ? (
                    <div className="flex items-center gap-2 w-full justify-between">
                      <button
                        onClick={handleCopyEnquiryLink}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-muted/60 hover:bg-muted text-foreground text-xs font-semibold transition-colors"
                      >
                        {copied ? <Check className="w-3 h-3 stroke-[2]" /> : <Copy className="w-3 h-3 stroke-[1.5]" />}
                        <span>{copied ? "Copied" : "Copy Form URL"}</span>
                      </button>
                      <Link
                        href="/enquire"
                        target="_blank"
                        className="text-xs font-bold text-[#D62828] dark:text-[#FF5A5F] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3 stroke-[2]" />
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={step.href}
                      className={`w-full inline-flex items-center justify-between text-xs font-bold py-0.5 transition-colors ${
                        step.completed
                          ? "text-muted-foreground hover:text-foreground"
                          : "text-[#D62828] dark:text-[#FF5A5F] hover:underline"
                      }`}
                    >
                      <span>{step.completed ? "Review configuration" : "Configure step"}</span>
                      <ArrowRight className="w-3 h-3 stroke-[2]" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

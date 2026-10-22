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
    <div className="rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-50/50 dark:to-slate-900/50 border border-indigo-200/80 dark:border-indigo-800/50 p-6 md:p-8 shadow-sm transition-all space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Institution Setup Checklist</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Get Your Admissions Workspace Ready
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Follow these 5 core steps to launch your lead pipeline and start capturing students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {onboarding.completedCount} of {onboarding.totalSteps} Completed
            </span>
            <div className="w-32 h-2 rounded-full bg-slate-200 dark:bg-slate-800 mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all duration-500"
                style={{ width: `${onboarding.progressPercent}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? "Expand checklist" : "Collapse checklist"}
          >
            {collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {onboarding.steps.map((step, idx) => {
            const Icon = STEP_ICONS[step.id] || Building;
            return (
              <div
                key={step.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  step.completed
                    ? "bg-white/80 dark:bg-slate-900/80 border-emerald-500/30 dark:border-emerald-500/20 shadow-xs"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          step.completed
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Step {idx + 1}
                      </span>
                    </div>

                    {step.completed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Done</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                        <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{step.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  {step.id === "shareEnquiry" ? (
                    <div className="flex items-center gap-2 w-full justify-between">
                      <button
                        onClick={handleCopyEnquiryLink}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold text-xs hover:bg-indigo-100 transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? "Link Copied" : "Copy Form Link"}</span>
                      </button>
                      <Link
                        href="/enquire"
                        target="_blank"
                        className="text-xs font-semibold text-slate-500 hover:text-indigo-600 inline-flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={step.href}
                      className={`w-full inline-flex items-center justify-between text-xs font-semibold py-1 transition-colors ${
                        step.completed
                          ? "text-slate-500 hover:text-indigo-600"
                          : "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-bold"
                      }`}
                    >
                      <span>{step.completed ? "Review configuration" : "Configure step"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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

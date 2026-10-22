"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  KanbanSquare,
  Bot,
  Zap,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Award,
} from "lucide-react";

const TOUR_STEPS = [
  {
    title: "Welcome to LeadTrack AI",
    badge: "Admissions Command Center",
    icon: Sparkles,
    content:
      "Your intelligent command deck tracks student inquiries, calculates predictive AI lead scores (0–100), and monitors counselor SLAs in real time.",
    link: "/dashboard",
  },
  {
    title: "Interactive Admissions Pipeline",
    badge: "Kanban Pipeline",
    icon: KanbanSquare,
    content:
      "Move students across 7 progressive stages—from New Enquiry through Campus Visit to Confirmed Admission. Drag cards or use the quick 'Move to' menu.",
    link: "/pipeline",
  },
  {
    title: "AI Counselor Copilot",
    badge: "Live Database Assistant",
    icon: Bot,
    content:
      "Click the floating AI button or press anywhere to ask: 'Which leads should I call today?', 'Show hot leads', or 'What is our conversion bottleneck?'",
    link: "/follow-ups",
  },
  {
    title: "Autonomous SLA Automations",
    badge: "UN SDG 4 Aligned",
    icon: Zap,
    content:
      "Never miss a student inquiry. Automated follow-up recipes dispatch WhatsApp brochures and escalate unresponsive inquiries before SLAs breach.",
    link: "/automation",
  },
];

export function ProductTourModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("leadtrack_tour_completed");
    if (!hasSeenTour) {
      // Show tour on first login after slight delay
      const timer = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("leadtrack_tour_completed", "true");
    setOpen(false);
  };

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleDismiss();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!open) return null;

  const current = TOUR_STEPS[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 uppercase tracking-wider">
              {current.badge}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Step {step + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            title="Skip Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Visual */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-50 dark:to-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/25">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{current.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {current.content}
            </p>
          </div>
        </div>

        {/* Stepper Dots & Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          {/* Dots */}
          <div className="flex gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  step === i ? "w-6 bg-indigo-600" : "w-2 bg-slate-200 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDismiss}
              className="px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 text-xs font-semibold"
            >
              Skip
            </button>

            {step > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-500/25"
            >
              <span>{step === TOUR_STEPS.length - 1 ? "Finish Tour" : "Next"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

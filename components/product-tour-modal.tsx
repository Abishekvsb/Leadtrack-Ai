"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  KanbanSquare,
  Bot,
  Zap,
  ArrowRight,
  ArrowLeft,
  X,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-up">
      <div className="w-full max-w-lg bg-card rounded-[14px] p-6 sm:p-7 shadow-floating border border-border space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-[6px] bg-[#D62828]/10 text-[#D62828] dark:text-[#FF5A5F] border border-[#D62828]/25 uppercase tracking-wider">
              {current.badge}
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              {step + 1} / {TOUR_STEPS.length}
            </span>
          </div>

          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground p-1 rounded-[4px]"
            title="Skip Tour"
          >
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {/* Step Visual */}
        <div className="p-5 rounded-[12px] bg-background/50 border border-border flex items-start gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#D62828] to-[#8F1218] text-white flex items-center justify-center shrink-0 shadow-xs border border-[#FFC21A]/30">
            <Icon className="w-5 h-5 text-[#FFC21A] stroke-[1.75]" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-foreground tracking-tight">{current.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {current.content}
            </p>
          </div>
        </div>

        {/* Stepper Dots & Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          {/* Dots */}
          <div className="flex gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  step === i ? "w-6 bg-[#FFC21A]" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-[8px] text-muted-foreground hover:text-foreground text-xs font-medium"
            >
              Skip
            </button>

            {step > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-[8px] border border-border hover:bg-muted text-xs font-semibold flex items-center gap-1 text-foreground transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="btn-crimson-gradient btn-shimmer px-4 py-1.5 rounded-[10px] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>{step === TOUR_STEPS.length - 1 ? "Get Started" : "Next"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FFC21A]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

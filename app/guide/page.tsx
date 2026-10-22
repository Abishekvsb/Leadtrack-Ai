"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  HelpCircle,
  GraduationCap,
  Sparkles,
  Users,
  PhoneCall,
  Calendar,
  FileCheck2,
  Award,
  ArrowRight,
  ChevronDown,
  Layers,
  Zap,
  CheckCircle2,
  ExternalLink,
  KanbanSquare,
  BarChart3,
  BookOpen,
} from "lucide-react";

export default function GuidePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const lifecycleSteps = [
    {
      step: 1,
      title: "Enquiry Captured Omnichannel",
      desc: "Prospective students submit queries via your college website (/enquire), social ads, WhatsApp, walk-in reception, or education fairs. Our deduplication engine standardizes phone numbers and checks emails to prevent duplicate lead profiles.",
      icon: Users,
      badge: "Inbound Capture",
      color: "from-blue-500 to-indigo-600",
      actions: [
        { label: "Preview Public Form", href: "/enquire", external: true },
        { label: "View Leads Queue", href: "/leads" },
      ],
    },
    {
      step: 2,
      title: "Real-time AI Lead Scoring (0–100)",
      desc: "Our AI engine computes a predictive intent score based on 4 weighted pillars: Acquisition channel quality (referrals and walk-ins carry higher organic intent), counselor engagement touches, inquiry recency, and verified profile completeness. Leads are graded as HOT (>=75), WARM (45–74), or COLD (<45).",
      icon: Sparkles,
      badge: "Predictive AI",
      color: "from-purple-500 to-indigo-600",
      actions: [{ label: "View Scoring Settings", href: "/settings?tab=scoring" }],
    },
    {
      step: 3,
      title: "Autonomous Counselor Assignment",
      desc: "Incoming inquiries are automatically balanced across your active counselors using fair round-robin scheduling. Counselors receive instant notifications on high-scoring candidates, ensuring rapid first response within the 2-hour SLA.",
      icon: Zap,
      badge: "Round-Robin Load Balancing",
      color: "from-amber-500 to-orange-600",
      actions: [{ label: "Manage Staff on Team", href: "/team" }],
    },
    {
      step: 4,
      title: "Personalized Multi-channel Follow-ups",
      desc: "Counselors log outbound calls, schedule campus tour meetings, and trigger pre-approved WhatsApp or Email templates directly from the lead's timeline. Automated recipes escalate leads that remain untouched for 2 days.",
      icon: PhoneCall,
      badge: "Omnichannel Engagement",
      color: "from-emerald-500 to-teal-600",
      actions: [
        { label: "Today's Follow-up Calls", href: "/follow-ups" },
        { label: "Communication Templates", href: "/templates" },
      ],
    },
    {
      step: 5,
      title: "Interactive Campus Walkthrough",
      desc: "Applicants and parents are scheduled for physical or virtual campus tours. Staff track laboratory demonstrations, interaction with faculty deans, and hostel facility inspections.",
      icon: Calendar,
      badge: "Experience Phase",
      color: "from-cyan-500 to-blue-600",
      actions: [{ label: "View Pipeline Stages", href: "/pipeline" }],
    },
    {
      step: 6,
      title: "Application & Document Verification",
      desc: "The student submits their formal application number, 10th/12th marks card, and entrance test scores. Counselors upload documents and verify eligibility requirements.",
      icon: FileCheck2,
      badge: "Formal Application",
      color: "from-violet-500 to-purple-600",
      actions: [{ label: "Pipeline Kanban", href: "/pipeline" }],
    },
    {
      step: 7,
      title: "Confirmed Admission & UN SDG 4 Impact",
      desc: "Seat is officially reserved! Merit scholarship discounts are verified, enrollment welcome packs are dispatched, and the seat is recorded against degree program intake quotas in support of UN SDG 4 (Quality Education).",
      icon: Award,
      badge: "Enrollment Finalized",
      color: "from-emerald-600 to-green-700",
      actions: [{ label: "Admissions ROI & Analytics", href: "/analytics" }],
    },
  ];

  const faqs = [
    {
      q: "How does the AI Lead Scoring Engine compute candidate grades?",
      a: "The scoring engine assigns a 0 to 100 score based on 4 pillars: Lead Source Quality (30%), Counselor Touchpoints & Engagement Level (25%), Recency of Inquiry (25%), and Profile Completeness (20%). High-intent leads scoring 75 or higher are tagged HOT, triggering instant counselor priority alerts.",
    },
    {
      q: "How do I invite additional counselors or admissions managers?",
      a: "As an Administrator, visit the Team page (/team) and click 'Invite Team Member'. Enter the staff email and role. The system generates a secure 7-day invite link. Send this link to your counselor to allow them to create their password and join your workspace.",
    },
    {
      q: "Can counselors see each other's leads?",
      a: "By default, counselors have a focused workspace showing only leads assigned to them and their daily scheduled calls. Deans and Admissions Managers have full visibility over the institutional pipeline and cross-counselor benchmarks.",
    },
    {
      q: "How do automated follow-up recipes work on Render?",
      a: "Automations are executed periodically via a secure cron route (/api/cron/run-automations). Render Cron or external monitors call this endpoint every 15 minutes with a secret authorization token. You can also trigger automations manually anytime via the 'Run Now' button on the Automations page.",
    },
    {
      q: "What happens if a prospective student submits the enquiry form twice?",
      a: "LeadTrack AI uses intelligent duplicate detection. It normalizes phone numbers (stripping country codes, dashes, and whitespace) and lowercases email addresses. If a matching candidate already exists, the new enquiry is linked to their profile as an activity touchpoint rather than creating a duplicate lead.",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-16 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Operational Architecture &amp; User Manual</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How LeadTrack AI Powers Admissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            A comprehensive blueprint of the 7-stage student recruitment lifecycle from initial discovery to confirmed enrollment.
          </p>
        </div>

        {/* 7-Stage Admissions Lifecycle */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>The 7-Stage Student Journey</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Lifecycle Blueprint</span>
          </div>

          <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
            {lifecycleSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative group">
                  {/* Step Dot Number */}
                  <div
                    className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-xl bg-gradient-to-tr ${step.color} text-white font-bold text-xs flex items-center justify-center shadow-md ring-4 ring-white dark:ring-slate-950`}
                  >
                    {step.step}
                  </div>

                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-indigo-500/40 transition-all space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 uppercase tracking-wider">
                          {step.badge}
                        </span>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">{step.title}</h3>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2">
                      {step.actions.map((act, i) => (
                        <Link
                          key={i}
                          href={act.href}
                          target={act.external ? "_blank" : undefined}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          <span>{act.label}</span>
                          {act.external ? <ExternalLink className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Everything you need to know about navigating the system</p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? "rotate-180" : ""}`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

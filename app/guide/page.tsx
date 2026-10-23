"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Users,
  PhoneCall,
  Calendar,
  FileCheck2,
  Award,
  ArrowRight,
  ChevronDown,
  Layers,
  Zap,
  ExternalLink,
  BookOpen,
  Sparkles,
} from "lucide-react";

export default function GuidePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const lifecycleSteps = [
    {
      step: "01",
      title: "Enquiry Captured Omnichannel",
      desc: "Prospective students submit queries via your college website (/enquire), social campaigns, WhatsApp, walk-in reception, or education fairs. Our deduplication engine standardizes phone numbers and verifies emails to prevent duplicate lead profiles.",
      icon: Users,
      badge: "Inbound Capture",
      actions: [
        { label: "Preview Public Form", href: "/enquire", external: true },
        { label: "View Leads Queue", href: "/leads" },
      ],
    },
    {
      step: "02",
      title: "Real-time AI Lead Scoring (0–100)",
      desc: "Our AI engine computes a predictive intent score based on 4 weighted pillars: Acquisition channel quality (referrals and walk-ins carry higher organic intent), counselor engagement touches, inquiry recency, and verified profile completeness. Leads are graded as Hot (≥75), Warm (45–74), or Cold (<45).",
      icon: Sparkles,
      badge: "Predictive AI",
      actions: [{ label: "View Scoring Settings", href: "/settings?tab=scoring" }],
    },
    {
      step: "03",
      title: "Autonomous Counselor Assignment",
      desc: "Incoming inquiries are automatically balanced across your active counselors using fair round-robin scheduling. Counselors receive instant notifications on high-scoring candidates, ensuring rapid first response within the 2-hour SLA.",
      icon: Zap,
      badge: "Round-Robin Balancing",
      actions: [{ label: "Manage Staff on Team", href: "/team" }],
    },
    {
      step: "04",
      title: "Personalized Multi-channel Follow-ups",
      desc: "Counselors log outbound calls, schedule campus tour meetings, and trigger pre-approved WhatsApp or Email templates directly from the lead's timeline. Automated recipes escalate leads that remain untouched for 2 days.",
      icon: PhoneCall,
      badge: "Omnichannel Engagement",
      actions: [
        { label: "Today's Follow-up Calls", href: "/follow-ups" },
        { label: "Communication Templates", href: "/templates" },
      ],
    },
    {
      step: "05",
      title: "Interactive Campus Walkthrough",
      desc: "Applicants and parents are scheduled for physical or virtual campus tours. Staff track laboratory demonstrations, interaction with faculty deans, and hostel facility inspections.",
      icon: Calendar,
      badge: "Experience Phase",
      actions: [{ label: "View Pipeline Stages", href: "/pipeline" }],
    },
    {
      step: "06",
      title: "Application & Document Verification",
      desc: "The student submits their formal application number, 10th/12th marks card, and entrance test scores. Counselors upload documents and verify eligibility requirements.",
      icon: FileCheck2,
      badge: "Formal Application",
      actions: [{ label: "Pipeline Kanban", href: "/pipeline" }],
    },
    {
      step: "07",
      title: "Confirmed Admission & UN SDG 4 Impact",
      desc: "Seat is officially reserved! Merit scholarship discounts are verified, enrollment welcome packs are dispatched, and the seat is recorded against degree program intake quotas in support of UN SDG 4 (Quality Education).",
      icon: Award,
      badge: "Enrollment Finalized",
      actions: [{ label: "Admissions ROI & Analytics", href: "/analytics" }],
    },
  ];

  const faqs = [
    {
      q: "How does the AI Lead Scoring Engine compute candidate grades?",
      a: "The scoring engine assigns a 0 to 100 score based on 4 pillars: Lead Source Quality (30%), Counselor Touchpoints & Engagement Level (25%), Recency of Inquiry (25%), and Profile Completeness (20%). High-intent leads scoring 75 or higher are tagged Hot, triggering priority counselor notifications.",
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
      <div className="space-y-12 pb-16 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-[#E4DDD0] dark:border-[#26302B] pb-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FAF7F0] dark:bg-[#171D1A] border border-[#E4DDD0] dark:border-[#26302B] text-[11px] font-mono uppercase tracking-wider text-[#0F3D33] dark:text-[#4FB89A]">
            <BookOpen className="w-3.5 h-3.5 text-[#E0A030]" />
            <span>Admissions Operations Manual • Standard Operating Procedures</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1B1A17] dark:text-[#ECE8DF]">
            The Admissions Lifecycle Handbook
          </h1>
          <p className="text-xs sm:text-sm text-[#6B665C] dark:text-[#959187] max-w-xl mx-auto leading-relaxed font-sans">
            A comprehensive operational blueprint covering the 7-stage student recruitment lifecycle from initial enquiry to confirmed matriculation.
          </p>
        </div>

        {/* 7-Stage Admissions Lifecycle */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E4DDD0] dark:border-[#26302B] pb-3">
            <h2 className="font-serif text-lg font-bold text-[#1B1A17] dark:text-[#ECE8DF] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0F3D33] dark:text-[#4FB89A]" />
              <span>Standard 7-Stage Trajectory</span>
            </h2>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B665C] dark:text-[#959187]">
              Admissions Protocol
            </span>
          </div>

          <div className="relative border-l border-[#E4DDD0] dark:border-[#26302B] ml-3.5 sm:ml-5 pl-6 sm:pl-8 space-y-6">
            {lifecycleSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative group">
                  {/* Step Dot Number */}
                  <div className="absolute -left-[37px] sm:-left-[45px] top-1.5 w-7 h-7 rounded-lg bg-[#FAF7F0] dark:bg-[#171D1A] border border-[#E4DDD0] dark:border-[#26302B] text-[#0F3D33] dark:text-[#4FB89A] font-mono font-bold text-[11px] flex items-center justify-center shadow-2xs">
                    {step.step}
                  </div>

                  <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#171D1A] border border-[#E4DDD0] dark:border-[#26302B] shadow-xs hover:border-[#0F3D33]/40 dark:hover:border-[#4FB89A]/40 transition-colors space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#FAF7F0] dark:bg-[#131916] text-[#0F3D33] dark:text-[#4FB89A] border border-[#E4DDD0] dark:border-[#26302B] uppercase tracking-wider">
                          {step.badge}
                        </span>
                        <h3 className="font-serif font-bold text-base text-[#1B1A17] dark:text-[#ECE8DF]">
                          {step.title}
                        </h3>
                      </div>
                      <Icon className="w-4 h-4 text-[#6B665C] dark:text-[#959187] hidden sm:block" />
                    </div>

                    <p className="text-xs sm:text-sm text-[#6B665C] dark:text-[#959187] leading-relaxed font-sans">
                      {step.desc}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2">
                      {step.actions.map((act, i) => (
                        <Link
                          key={i}
                          href={act.href}
                          target={act.external ? "_blank" : undefined}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#131916] hover:bg-[#E4DDD0]/60 dark:hover:bg-[#26302B] text-[#1B1A17] dark:text-[#ECE8DF] font-medium text-xs border border-[#E4DDD0] dark:border-[#26302B] transition-colors"
                        >
                          <span>{act.label}</span>
                          {act.external ? <ExternalLink className="w-3 h-3 text-[#6B665C]" /> : <ArrowRight className="w-3 h-3 text-[#6B665C]" />}
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
        <div className="space-y-6 pt-6 border-t border-[#E4DDD0] dark:border-[#26302B]">
          <div className="text-center space-y-1">
            <h2 className="font-serif text-xl font-bold text-[#1B1A17] dark:text-[#ECE8DF]">
              Frequently Consulted Guidance
            </h2>
            <p className="text-xs text-[#6B665C] dark:text-[#959187] font-sans">
              Operational clarification for faculty advisors, deans, and admissions administrators
            </p>
          </div>

          <div className="space-y-2.5 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#E4DDD0] dark:border-[#26302B] bg-white dark:bg-[#171D1A] overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-[#1B1A17] dark:text-[#ECE8DF] hover:text-[#0F3D33] dark:hover:text-[#4FB89A] transition-colors font-serif"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B665C] transition-transform duration-200 shrink-0 ml-2 ${
                      activeFaq === idx ? "rotate-180 text-[#0F3D33] dark:text-[#4FB89A]" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-[#6B665C] dark:text-[#959187] leading-relaxed border-t border-[#E4DDD0]/60 dark:border-[#26302B] pt-3 font-sans">
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

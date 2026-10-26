"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  KanbanSquare,
  Users2,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Globe,
  Award,
  Bot,
  ExternalLink,
  Laptop,
  Compass,
  FileText,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/design-system";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { label: "Predictive Scoring", value: "AI Math", sub: "Transparent 4-pillar qualification" },
    { label: "Admission Pipeline", value: "7 Stages", sub: "From initial enquiry to matriculation" },
    { label: "Counselor Automations", value: "SLA Rules", sub: "Instant follow-up queue dispatch" },
    { label: "Equitable Access", value: "SDG 4", sub: "Non-discriminatory institutional admissions" },
  ];

  const features = [
    {
      icon: Sparkles,
      title: "Predictive Lead Scoring (0–100)",
      description:
        "Transparent 4-pillar predictive algorithm analyzing source quality, counselor touchpoint recency, engagement velocity, and program demand to rank candidates as Hot, Warm, or Cold.",
    },
    {
      icon: KanbanSquare,
      title: "Interactive Admissions Pipeline",
      description:
        "7-stage drag-and-drop Kanban carrying candidates from initial enquiry through campus walkthrough to formal application, scholarship review, and confirmed matriculation.",
    },
    {
      icon: Zap,
      title: "Autonomous SLA Automations",
      description:
        "Ensure zero student slips through the cracks. Auto-dispatch prospectus brochures, schedule reminder calls, and escalate inactive leads after 48 hours to team leads.",
    },
    {
      icon: BarChart3,
      title: "Source Yield & Counselor Analytics",
      description:
        "Measure acquisition ROI across search, Instagram, walk-ins, and education fairs. Benchmark individual counselor conversion velocities and course fill rates.",
    },
    {
      icon: Users2,
      title: "Omnichannel Inbound Capture",
      description:
        "Embeddable public inquiry portals, WhatsApp connectors, and bulk registry imports with intelligent deduplication and E.164 phone normalization.",
    },
    {
      icon: Bot,
      title: "Admissions Advisory Copilot",
      description:
        "Integrated AI admissions assistant answering counselor queries: 'Identify today's urgent callbacks', 'Analyze computer science demand', and diagnosing drop-offs.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Capture Enquiries Omnichannel",
      desc: "Centralize prospective applicant inquiries from your portal, social campaigns, campus walk-ins, and education fairs without duplicate records.",
    },
    {
      step: "02",
      title: "Score & Prioritize with AI",
      desc: "The predictive engine grades student intent mathematically as Hot, Warm, or Cold, recommending the exact next outreach action for faculty counselors.",
    },
    {
      step: "03",
      title: "Coordinate Consultations & Visits",
      desc: "Trigger pre-approved WhatsApp and email correspondence, schedule campus laboratory tours, and keep parents updated at every milestone.",
    },
    {
      step: "04",
      title: "Confirm Enrollment & Intake",
      desc: "Verify academic documents, track scholarship discounts, and confirm admissions while updating degree program intake capacity in real-time.",
    },
  ];

  const faqs = [
    {
      q: "How does LeadTrack AI support UN Sustainable Development Goal 4 (SDG 4)?",
      a: "LeadTrack AI champions UN SDG 4 (Quality Education) by eliminating operational bottlenecks in admissions, preventing dropped inquiries, accelerating merit scholarship dispatches to deserving candidates, and ensuring every student receives timely academic counseling regardless of background.",
    },
    {
      q: "Can we embed the enquiry portal on our institutional college website?",
      a: "Yes. LeadTrack AI provides a public, shareable enquiry portal (/enquire) with duplicate phone/email detection, responsive layout, and immediate intent scoring that can be integrated via iframe or linked from recruitment campaigns.",
    },
    {
      q: "How does the AI Lead Scoring Engine compute student grades?",
      a: "The engine scores leads from 0 to 100 based on 4 transparent pillars: source channel intent (30%), counselor engagement touches (25%), inquiry recency (25%), and profile completeness (20%). Counselors can inspect the mathematical breakdown on any candidate dossier.",
    },
    {
      q: "Does LeadTrack AI support role-based permissions for faculty?",
      a: "Yes. Administrators hold institutional oversight and financial analytics access; Admissions Managers supervise counseling queues and team distribution; Counselors work within a focused workspace displaying their assigned applicants and daily consultation schedule.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9EE] dark:bg-[#120A0C] text-[#17141A] dark:text-[#F7EFE6] selection:bg-[#FFC21A]/30 selection:text-[#17141A] font-sans relative overflow-x-hidden">
      {/* Aurora Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-[640px] pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#D62828]/15 via-[#FFC21A]/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[80px] -left-[100px] w-[450px] h-[350px] bg-[#D62828]/10 blur-[100px] rounded-full" />
        <div className="absolute top-[120px] -right-[100px] w-[450px] h-[350px] bg-[#FFC21A]/15 blur-[100px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full border-b border-border/70 bg-[#FFF9EE]/90 dark:bg-[#120A0C]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#D62828] to-[#8F1218] flex items-center justify-center text-white shadow-xs border border-[#FFC21A]/30">
              <GraduationCap className="w-5 h-5 text-[#FFC21A]" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg tracking-tight text-foreground block">
                LeadTrack <span className="text-[#D62828] dark:text-[#FF5A5F]">AI</span>
              </span>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Royal Admissions Intelligence
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Platform Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              Lifecycle Blueprint
            </a>
            <a href="#sdg4" className="hover:text-foreground transition-colors">
              UN SDG 4 Mandate
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              Governance FAQ
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/enquire"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] border border-border bg-surface text-xs font-medium text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Candidate Portal</span>
            </Link>
            <Link href="/login">
              <button className="btn-crimson-gradient btn-shimmer px-4 py-2 rounded-[10px] text-white font-semibold text-xs shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]">
                Faculty Sign In →
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Aurora */}
      <section className="relative pt-16 sm:pt-20 pb-20 px-4 sm:px-6 z-10">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9EE] dark:bg-[#1B1114] border border-[#FFC21A]/40 dark:border-[#FFD25A]/30 text-[11px] font-mono uppercase tracking-wider text-[#8A5A00] dark:text-[#FFD25A] shadow-xs">
            <Award className="w-3.5 h-3.5 text-[#FFC21A]" />
            <span>Advancing UN SDG 4 • Quality &amp; Equitable Education</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08] max-w-4xl mx-auto">
            Admissions intelligence,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D62828] via-[#FF5A5F] to-[#FFC21A]">
              authored for higher ed.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-muted-foreground font-normal leading-relaxed">
            The predictive admissions operating system built for colleges and universities. Grade candidate intent with transparent AI, enforce counselor response SLAs, and fill cohorts with precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/login" className="w-full sm:w-auto">
              <button className="btn-crimson-gradient btn-shimmer w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] text-white font-bold text-sm transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]">
                <span>Access Admissions Workspace</span>
                <ArrowRight className="w-4 h-4 text-[#FFC21A]" />
              </button>
            </Link>
            <Link
              href="/enquire"
              target="_blank"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[10px] border border-border bg-surface hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] text-foreground font-medium text-xs sm:text-sm transition-colors shadow-xs"
            >
              <Laptop className="w-4 h-4 text-[#D62828] dark:text-[#FF5A5F]" />
              <span>Public Enquiry Portal Preview</span>
            </Link>
          </div>
        </div>

        {/* 3D Dashboard Mockup */}
        <div className="max-w-5xl mx-auto mt-12 sm:mt-16 [perspective:1200px]">
          <div className="rounded-[16px] border border-[#FFC21A]/30 dark:border-[#FFD25A]/25 bg-surface shadow-2xl overflow-hidden transition-transform duration-500 hover:[transform:rotateX(0deg)] [transform:rotateX(4deg)]">
            {/* Browser Header */}
            <div className="px-4 py-3 border-b border-border/80 bg-[#F8F2E6] dark:bg-[#1B1114] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#D62828]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#FFC21A]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#16A34A]/80 inline-block" />
                <span className="ml-3 font-mono text-[11px] text-muted-foreground hidden sm:inline">
                  leadtrack.edu / dashboard / admissions-command
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span className="font-bold text-foreground">LIVE ADMISSIONS ENGINE</span>
              </div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="p-5 sm:p-7 space-y-6 bg-gradient-to-b from-surface to-background/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D62828] dark:text-[#FF5A5F] font-bold">
                    Institutional Candidate Registry &amp; Cohort Yield
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground mt-0.5">
                    Admissions Command Center
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-[6px] font-mono text-[10px] font-bold bg-[#D62828]/10 text-[#D62828] dark:text-[#FF5A5F] border border-[#D62828]/25">
                    Real-Time Scoring Active
                  </span>
                  <span className="px-2.5 py-1 rounded-[6px] font-mono text-[10px] font-bold bg-[#FFC21A]/15 text-[#8A5A00] dark:text-[#FFD25A] border border-[#FFC21A]/35">
                    SLA Engine: &lt; 2h
                  </span>
                </div>
              </div>

              {/* 4 Feature Metric Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-[12px] bg-card border border-border shadow-xs hover:border-[#FFC21A]/50 transition-colors">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Intent Tiers</span>
                  <p className="font-heading text-xl font-bold text-foreground mt-1 tabular-nums">Score 0–100</p>
                  <span className="text-[10px] font-bold text-[#D62828] dark:text-[#FF5A5F] mt-1 block">Hot, Warm &amp; Cold</span>
                </div>
                <div className="p-4 rounded-[12px] bg-card border border-border shadow-xs hover:border-[#FFC21A]/50 transition-colors">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Pipeline Velocity</span>
                  <p className="font-heading text-xl font-bold text-foreground mt-1 tabular-nums">7 Stages</p>
                  <span className="text-[10px] font-bold text-[#8A5A00] dark:text-[#FFD25A] mt-1 block">Enquiry to Intake</span>
                </div>
                <div className="p-4 rounded-[12px] bg-card border border-border shadow-xs hover:border-[#FFC21A]/50 transition-colors">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">First Touch SLA</span>
                  <p className="font-heading text-xl font-bold text-foreground mt-1 tabular-nums">&lt; 2 Hours</p>
                  <span className="text-[10px] font-bold text-[#16A34A] dark:text-[#4ADE80] mt-1 block">Automated Dispatch</span>
                </div>
                <div className="p-4 rounded-[12px] bg-card border border-border shadow-xs hover:border-[#FFC21A]/50 transition-colors">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Governance</span>
                  <p className="font-heading text-xl font-bold text-foreground mt-1">Role-Based</p>
                  <span className="text-[10px] font-bold text-muted-foreground mt-1 block">Archival Audit Trail</span>
                </div>
              </div>

              {/* Mockup Row Item Preview */}
              <div className="p-4 rounded-[12px] bg-[#F8F2E6]/60 dark:bg-[#1B1114]/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D62828] text-white flex items-center justify-center font-bold text-xs">
                    AR
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">Aarav Sharma</span>
                    <span className="text-muted-foreground text-[11px]">B.Tech Computer Science &amp; Engineering • Web Enquiry</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] text-[11px] font-bold bg-[#D62828]/10 text-[#D62828] dark:text-[#FF5A5F] border border-[#D62828]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D62828] animate-ping" />
                    AI SCORE 92 • HOT
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">Assigned: Counselor Priya</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, idx) => (
            <div key={idx} className="flex flex-col text-center sm:text-left">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-[#D62828] dark:text-[#FF5A5F] tracking-tight tabular-nums">
                {s.value}
              </span>
              <span className="text-xs font-bold text-foreground mt-1 font-heading">
                {s.label}
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                {s.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#D62828] dark:text-[#FF5A5F] font-bold">
            Capabilities &amp; Architecture
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Engineered for Academic Admissions
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            Eliminate disorganized spreadsheets, dropped calls, and disconnected marketing channels. Provide counseling faculty with an authoritative command center.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="royal-card royal-card-interactive p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-[10px] bg-[#D62828]/10 dark:bg-[#FF5A5F]/15 border border-[#D62828]/25 text-[#D62828] dark:text-[#FF5A5F] flex items-center justify-center mb-4 shadow-xs">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-foreground mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-[#F8F2E6]/60 dark:bg-[#1B1114]/40 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#D62828] dark:text-[#FF5A5F] font-bold">
              Standard Operating Flow
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              From Candidacy to Enrolled in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((st, i) => (
              <div
                key={i}
                className="royal-card p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="font-heading text-3xl font-extrabold text-[#FFC21A] block">
                    {st.step}
                  </span>
                  <h3 className="font-heading text-base font-bold text-foreground mt-3 mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UN SDG 4 Section */}
      <section id="sdg4" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="rounded-[16px] p-8 md:p-12 bg-gradient-to-br from-[#8F1218] via-[#D62828] to-[#B81E1E] text-white shadow-xl relative overflow-hidden border border-[#FFC21A]/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFC21A]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-mono uppercase tracking-wider text-[#FFC21A] font-bold">
              <Award className="w-3.5 h-3.5 text-[#FFC21A]" />
              <span>United Nations SDG 4 Commitment</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Championing Quality Education &amp; Equitable Access for Every Candidate
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
              Target 4.3 guarantees equal access for all women and men to affordable, quality tertiary and technical education. LeadTrack AI provides institutions with non-discriminatory scoring models, automated scholarship outreach, and rapid counselor response so that no qualified candidate is excluded by administrative friction.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              <div className="px-3 py-1.5 rounded-[8px] bg-white/10 border border-white/20 text-xs font-mono font-semibold">
                ✓ Merit Scholarship Dispatches
              </div>
              <div className="px-3 py-1.5 rounded-[8px] bg-white/10 border border-white/20 text-xs font-mono font-semibold">
                ✓ Non-Discriminatory AI Scoring
              </div>
              <div className="px-3 py-1.5 rounded-[8px] bg-white/10 border border-white/20 text-xs font-mono font-semibold">
                ✓ 2-Hour Response SLA Guarantee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="text-center mb-10 space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#D62828] dark:text-[#FF5A5F] font-bold">
            Guidance &amp; Verification
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="royal-card overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-foreground hover:text-[#D62828] dark:hover:text-[#FF5A5F] transition-colors font-heading"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${
                    activeFaq === i ? "rotate-180 text-[#D62828] dark:text-[#FF5A5F]" : ""
                  }`}
                />
              </button>
              {activeFaq === i && (
                <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/70 pt-3 font-sans">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="p-10 md:p-14 rounded-[16px] bg-surface border border-border shadow-card space-y-5 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D62828] via-[#FFC21A] to-[#D62828]" />
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Ready to upgrade your institutional admissions?
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-muted-foreground">
            Empower counseling deans, accelerate response velocity, and achieve full cohort yield with LeadTrack AI.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <button className="btn-crimson-gradient btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 rounded-[10px] text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]">
                <span>Launch Institution Portal Now</span>
                <ArrowRight className="w-4 h-4 text-[#FFC21A]" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4 sm:px-6 bg-[#F8F2E6] dark:bg-[#120A0C] text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[#D62828] to-[#8F1218] text-white flex items-center justify-center font-bold shadow-xs">
              <GraduationCap className="w-4 h-4 text-[#FFC21A]" />
            </div>
            <span className="font-heading font-bold text-foreground text-sm">
              LeadTrack AI
            </span>
          </div>
          <p className="text-center md:text-left text-[11px] font-sans">
            © {new Date().getFullYear()} LeadTrack AI. Authored for colleges and universities. Supporting UN SDG 4.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/login" className="hover:text-[#D62828] dark:hover:text-[#FF5A5F] transition-colors">
              Faculty Access
            </Link>
            <Link href="/enquire" target="_blank" className="hover:text-[#D62828] dark:hover:text-[#FF5A5F] transition-colors">
              Candidate Form
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

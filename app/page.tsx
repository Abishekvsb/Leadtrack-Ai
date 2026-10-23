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
} from "lucide-react";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { label: "Admissions Conversion Lift", value: "3.4×", sub: "measured against manual spreadsheets" },
    { label: "Student Enquiries Processed", value: "250K+", sub: "across colleges & degree institutions" },
    { label: "Counselor Response SLA", value: "< 2 Hrs", sub: "automated instant WhatsApp & email dispatch" },
    { label: "Aligned with UN SDG 4", value: "100%", sub: "Quality Education & Equal Access" },
  ];

  const features = [
    {
      icon: Sparkles,
      title: "Predictive Lead Scoring (0–100)",
      description:
        "Transparent multi-pillar scoring model analyzing source quality, response latency, engagement touches, and program demand to rank candidates as Hot, Warm, or Cold.",
    },
    {
      icon: KanbanSquare,
      title: "Interactive Admissions Pipeline",
      description:
        "7-stage drag-and-drop Kanban carrying candidates from initial enquiry through campus walkthrough to formal application and confirmed matriculation.",
    },
    {
      icon: Zap,
      title: "Autonomous SLA Automations",
      description:
        "Ensure zero student falls through the cracks. Auto-dispatch prospectus brochures, schedule reminder calls, and escalate inactive leads after 48 hours.",
    },
    {
      icon: BarChart3,
      title: "Source Yield & Counselor Analytics",
      description:
        "Measure acquisition ROI across search, Instagram, campus walk-ins, and education fairs. Benchmark individual counselor conversion velocities.",
    },
    {
      icon: Users2,
      title: "Omnichannel Inbound Capture",
      description:
        "Embeddable public inquiry portals, WhatsApp business connectors, and bulk registry imports with intelligent deduplication and phone normalization.",
    },
    {
      icon: Bot,
      title: "Admissions Advisory Copilot",
      description:
        "Integrated AI assistant answering counselor queries: 'Identify today's urgent callbacks', 'Analyze computer science demand', and diagnosing drop-offs.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Capture Enquiries Omnichannel",
      desc: "Centralize prospective applicant inquiries from your portal, social campaigns, campus walk-ins, and education expositions without duplicate records.",
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
    <div className="min-h-screen bg-[#F6F2EA] dark:bg-[#0F1412] text-[#1B1A17] dark:text-[#ECE8DF] selection:bg-[#E0A030]/30 selection:text-[#1B1A17] font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full border-b border-[#E4DDD0] dark:border-[#26302B] bg-[#F6F2EA]/90 dark:bg-[#0F1412]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F3D33] dark:bg-[#4FB89A] flex items-center justify-center text-[#F6F2EA] dark:text-[#0F1412] shadow-2xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg tracking-tight text-[#1B1A17] dark:text-[#ECE8DF] block">
                LeadTrack AI
              </span>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-[#6B665C] dark:text-[#959187]">
                Admissions Operating System
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-[#6B665C] dark:text-[#959187]">
            <a href="#features" className="hover:text-[#1B1A17] dark:hover:text-[#ECE8DF] transition-colors">
              Platform Features
            </a>
            <a href="#how-it-works" className="hover:text-[#1B1A17] dark:hover:text-[#ECE8DF] transition-colors">
              Lifecycle Blueprint
            </a>
            <a href="#sdg4" className="hover:text-[#1B1A17] dark:hover:text-[#ECE8DF] transition-colors">
              UN SDG 4 Mandate
            </a>
            <a href="#faq" className="hover:text-[#1B1A17] dark:hover:text-[#ECE8DF] transition-colors">
              Governance FAQ
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/enquire"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E4DDD0] dark:border-[#26302B] bg-white dark:bg-[#171D1A] text-xs font-medium text-[#1B1A17] dark:text-[#ECE8DF] hover:bg-[#FAF7F0] dark:hover:bg-[#1E2622] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#6B665C]" />
              <span>Candidate Portal</span>
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-[#0F3D33] hover:bg-[#165447] dark:bg-[#4FB89A] dark:hover:bg-[#3ea688] text-[#F6F2EA] dark:text-[#0F1412] font-semibold text-xs shadow-2xs transition-colors"
            >
              Faculty Sign In →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-18 pb-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FAF7F0] dark:bg-[#171D1A] border border-[#E4DDD0] dark:border-[#26302B] text-[11px] font-mono uppercase tracking-wider text-[#0F3D33] dark:text-[#4FB89A]">
            <Award className="w-3.5 h-3.5 text-[#E0A030]" />
            <span>Advancing UN SDG 4: Quality &amp; Equitable Education</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#1B1A17] dark:text-[#ECE8DF] leading-[1.08] max-w-4xl mx-auto">
            Admissions intelligence, authored for higher ed.
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#6B665C] dark:text-[#959187] font-normal leading-relaxed">
            The predictive admissions operating system built for colleges and universities. Grade applicant intent with transparent AI, enforce counselor response SLAs, and fill cohorts with precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#0F3D33] hover:bg-[#165447] dark:bg-[#4FB89A] dark:hover:bg-[#3ea688] text-[#F6F2EA] dark:text-[#0F1412] font-semibold text-xs transition-colors shadow-xs"
            >
              <span>Access Admissions Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/enquire"
              target="_blank"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-[#E4DDD0] dark:border-[#26302B] bg-white dark:bg-[#171D1A] hover:bg-[#FAF7F0] dark:hover:bg-[#1E2622] text-[#1B1A17] dark:text-[#ECE8DF] font-medium text-xs transition-colors"
            >
              <Laptop className="w-4 h-4 text-[#0F3D33] dark:text-[#4FB89A]" />
              <span>Public Enquiry Portal Preview</span>
            </Link>
          </div>
        </div>

        {/* Browser Frame Showcase */}
        <div className="max-w-5xl mx-auto mt-14 rounded-xl border border-[#E4DDD0] dark:border-[#26302B] bg-white dark:bg-[#171D1A] shadow-lg overflow-hidden">
          {/* Browser Chrome Header */}
          <div className="px-4 py-3 border-b border-[#E4DDD0] dark:border-[#26302B] bg-[#FAF7F0] dark:bg-[#131916] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E4DDD0] dark:bg-[#26302B]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E4DDD0] dark:bg-[#26302B]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E4DDD0] dark:bg-[#26302B]" />
              <span className="ml-3 font-mono text-[11px] text-[#6B665C] dark:text-[#959187]">
                leadtrack.institute / dashboard / admissions-registry
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#6B665C] dark:text-[#959187]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F3D33] dark:bg-[#4FB89A]" />
              <span>LIVE REGISTRY</span>
            </div>
          </div>

          {/* Browser Frame Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E4DDD0] dark:border-[#26302B] gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B665C] dark:text-[#959187]">
                  Admissions Intelligence Engine
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1B1A17] dark:text-[#ECE8DF]">
                  Institutional Candidate Registry &amp; Cohort Yield
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded font-mono text-[10px] bg-[#0F3D33]/10 dark:bg-[#4FB89A]/15 text-[#0F3D33] dark:text-[#4FB89A] border border-[#0F3D33]/25 dark:border-[#4FB89A]/30">
                  Real-Time Scoring Active
                </span>
                <span className="px-2.5 py-1 rounded font-mono text-[10px] bg-[#E0A030]/10 text-[#B87A14] dark:text-[#E0A030] border border-[#E0A030]/30">
                  SLA Engine: &lt; 2h
                </span>
              </div>
            </div>

            {/* Feature metric highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="p-3.5 rounded-lg bg-[#FAF7F0] dark:bg-[#131916] border border-[#E4DDD0] dark:border-[#26302B]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B665C] dark:text-[#959187]">Intent Tiers</span>
                <p className="font-serif text-lg font-bold text-[#1B1A17] dark:text-[#ECE8DF] mt-1">Score 0–100</p>
                <span className="text-[10px] font-mono text-[#0F3D33] dark:text-[#4FB89A] mt-1 block">Hot, Warm &amp; Cold</span>
              </div>
              <div className="p-3.5 rounded-lg bg-[#FAF7F0] dark:bg-[#131916] border border-[#E4DDD0] dark:border-[#26302B]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B665C] dark:text-[#959187]">Pipeline Velocity</span>
                <p className="font-mono text-lg font-bold text-[#0F3D33] dark:text-[#4FB89A] mt-1">7 Stages</p>
                <span className="text-[10px] font-mono text-[#6B665C] dark:text-[#959187] mt-1 block">Enquiry to Intake</span>
              </div>
              <div className="p-3.5 rounded-lg bg-[#FAF7F0] dark:bg-[#131916] border border-[#E4DDD0] dark:border-[#26302B]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B665C] dark:text-[#959187]">First Touch SLA</span>
                <p className="font-mono text-lg font-bold text-[#B87A14] dark:text-[#E0A030] mt-1">&lt; 2 Hours</p>
                <span className="text-[10px] font-mono text-[#6B665C] dark:text-[#959187] mt-1 block">Automated Dispatch</span>
              </div>
              <div className="p-3.5 rounded-lg bg-[#FAF7F0] dark:bg-[#131916] border border-[#E4DDD0] dark:border-[#26302B]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B665C] dark:text-[#959187]">Governance</span>
                <p className="font-serif text-lg font-bold text-[#1B1A17] dark:text-[#ECE8DF] mt-1">Role-Based</p>
                <span className="text-[10px] font-mono text-[#6B665C] dark:text-[#959187] mt-1 block">Archival Audit Trail</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-[#171D1A] border-y border-[#E4DDD0] dark:border-[#26302B]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, idx) => (
            <div key={idx} className="flex flex-col text-center sm:text-left">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-[#0F3D33] dark:text-[#4FB89A] tracking-tight">
                {s.value}
              </span>
              <span className="text-xs font-semibold text-[#1B1A17] dark:text-[#ECE8DF] mt-1 font-serif">
                {s.label}
              </span>
              <span className="text-[11px] text-[#6B665C] dark:text-[#959187] mt-0.5">
                {s.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#0F3D33] dark:text-[#4FB89A]">
            Capabilities &amp; Architecture
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1B1A17] dark:text-[#ECE8DF]">
            Engineered for Academic Admissions
          </h2>
          <p className="text-[#6B665C] dark:text-[#959187] text-xs sm:text-sm leading-relaxed">
            Eliminate disorganized spreadsheets, dropped calls, and disconnected marketing channels. Provide counseling staff with an authoritative command center.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-xl bg-white dark:bg-[#171D1A] border border-[#E4DDD0] dark:border-[#26302B] hover:border-[#0F3D33]/40 dark:hover:border-[#4FB89A]/40 transition-colors shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#FAF7F0] dark:bg-[#131916] border border-[#E4DDD0] dark:border-[#26302B] text-[#0F3D33] dark:text-[#4FB89A] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#1B1A17] dark:text-[#ECE8DF] mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs text-[#6B665C] dark:text-[#959187] leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-[#FAF7F0] dark:bg-[#131916] border-y border-[#E4DDD0] dark:border-[#26302B]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#0F3D33] dark:text-[#4FB89A]">
              Standard Operating Flow
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1B1A17] dark:text-[#ECE8DF]">
              From Candidacy to Enrolled in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((st, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white dark:bg-[#171D1A] border border-[#E4DDD0] dark:border-[#26302B] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-serif text-3xl font-bold text-[#E0A030] block">
                    {st.step}
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#1B1A17] dark:text-[#ECE8DF] mt-3 mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[#6B665C] dark:text-[#959187] leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UN SDG 4 Section */}
      <section id="sdg4" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="rounded-xl p-8 md:p-12 bg-[#0F3D33] text-[#F6F2EA] dark:bg-[#171D1A] dark:border dark:border-[#26302B] shadow-lg relative overflow-hidden">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F6F2EA]/10 border border-[#F6F2EA]/20 text-[11px] font-mono uppercase tracking-wider text-[#E0A030]">
              <Award className="w-3.5 h-3.5" />
              <span>United Nations SDG 4 Commitment</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-[#F6F2EA]">
              Championing Quality Education &amp; Equitable Access for Every Candidate
            </h2>
            <p className="text-xs sm:text-sm text-[#F6F2EA]/80 leading-relaxed font-sans">
              Target 4.3 guarantees equal access for all women and men to affordable, quality tertiary and technical education. LeadTrack AI provides institutions with non-discriminatory scoring models, automated scholarship outreach, and rapid counselor response so that no qualified candidate is excluded by administrative inertia.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              <div className="px-3 py-1.5 rounded-md bg-[#F6F2EA]/10 border border-[#F6F2EA]/15 text-xs font-mono">
                ✓ Merit Scholarship Dispatches
              </div>
              <div className="px-3 py-1.5 rounded-md bg-[#F6F2EA]/10 border border-[#F6F2EA]/15 text-xs font-mono">
                ✓ Non-Discriminatory AI Scoring
              </div>
              <div className="px-3 py-1.5 rounded-md bg-[#F6F2EA]/10 border border-[#F6F2EA]/15 text-xs font-mono">
                ✓ 2-Hour Response SLA Guarantee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-16 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-10 space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#0F3D33] dark:text-[#4FB89A]">
            Guidance &amp; Verification
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1B1A17] dark:text-[#ECE8DF]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#E4DDD0] dark:border-[#26302B] bg-white dark:bg-[#171D1A] overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-[#1B1A17] dark:text-[#ECE8DF] hover:text-[#0F3D33] dark:hover:text-[#4FB89A] transition-colors font-serif"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#6B665C] transition-transform duration-200 shrink-0 ml-2 ${
                    activeFaq === i ? "rotate-180 text-[#0F3D33] dark:text-[#4FB89A]" : ""
                  }`}
                />
              </button>
              {activeFaq === i && (
                <div className="px-4 pb-4 text-xs text-[#6B665C] dark:text-[#959187] leading-relaxed border-t border-[#E4DDD0]/60 dark:border-[#26302B] pt-3 font-sans">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <div className="p-10 md:p-14 rounded-xl bg-white dark:bg-[#171D1A] border border-[#E4DDD0] dark:border-[#26302B] shadow-xs space-y-5">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#1B1A17] dark:text-[#ECE8DF]">
            Ready to upgrade your institutional admissions?
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#6B665C] dark:text-[#959187]">
            Empower counseling deans, accelerate response velocity, and achieve full cohort yield with LeadTrack AI.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0F3D33] hover:bg-[#165447] dark:bg-[#4FB89A] dark:hover:bg-[#3ea688] text-[#F6F2EA] dark:text-[#0F1412] font-semibold text-xs shadow-xs transition-colors"
            >
              <span>Launch Institution Portal Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E4DDD0] dark:border-[#26302B] py-10 px-6 bg-[#FAF7F0] dark:bg-[#0F1412] text-xs text-[#6B665C] dark:text-[#959187]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#0F3D33] dark:bg-[#4FB89A] text-[#F6F2EA] dark:text-[#0F1412] flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-[#1B1A17] dark:text-[#ECE8DF] text-sm">
              LeadTrack AI
            </span>
          </div>
          <p className="text-center md:text-left text-[11px] font-sans">
            © {new Date().getFullYear()} LeadTrack AI. Authored for colleges and universities. Supporting UN SDG 4.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/login" className="hover:text-[#0F3D33] dark:hover:text-[#4FB89A] transition-colors">
              Faculty Access
            </Link>
            <Link href="/enquire" target="_blank" className="hover:text-[#0F3D33] dark:hover:text-[#4FB89A] transition-colors">
              Candidate Form
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

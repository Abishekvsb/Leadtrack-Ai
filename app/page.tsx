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
  HeartHandshake,
  Bot,
  ExternalLink,
  Laptop,
} from "lucide-react";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { label: "Admissions Conversion Lift", value: "3.4x", sub: "compared to legacy CRM spreadsheets" },
    { label: "Student Enquiries Processed", value: "250K+", sub: "across colleges & universities" },
    { label: "Counselor Response SLA", value: "< 2 Hrs", sub: "automated instant WhatsApp & email" },
    { label: "Aligned with UN SDG 4", value: "100%", sub: "Quality Education & Equal Access" },
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Lead Scoring (0-100)",
      description:
        "Automatically identifies high-intent candidates using weighted models on source quality, response latency, engagement touches, and program demand.",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: KanbanSquare,
      title: "Interactive Admissions Pipeline",
      description:
        "Smooth drag-and-drop Kanban moving applicants from New Enquiry through Campus Visit to Confirmed Admission with live DB synchronization.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Autonomous SLA Automations",
      description:
        "Never miss a student. Auto-trigger personalized WhatsApp check-ins, send prospectus brochures, and escalate inactive leads to senior deans.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: BarChart3,
      title: "Source ROI & Counselor Analytics",
      description:
        "Track acquisition costs across Google Ads, Instagram, Walk-ins, and Education Expos. Measure individual counselor conversion benchmarks.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Users2,
      title: "Omnichannel Enquiry Capture",
      description:
        "Public embeddable enquiry widgets, WhatsApp bot connectors, Facebook Lead Ads, and bulk CSV imports with intelligent duplicate detection.",
      color: "from-rose-500 to-pink-500",
    },
    {
      icon: Bot,
      title: "AI Admissions Advisor Chat",
      description:
        "Interactive assistant answering counselor questions: 'Which leads should I call today?', 'Analyze B.Tech CS demand', and diagnosing drop-offs.",
      color: "from-violet-500 to-indigo-600",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Capture Enquiries Omnichannel",
      desc: "Centralize incoming students from your website, social media campaigns, campus walk-ins, and education fairs without duplicates.",
    },
    {
      step: "02",
      title: "Score & Prioritize with AI",
      desc: "Our machine learning engine grades candidates as Hot, Warm, or Cold, recommending the exact next best action for counselors.",
    },
    {
      step: "03",
      title: "Automate Follow-ups & Visits",
      desc: "Trigger tailored email & WhatsApp templates, schedule campus walkthroughs, and keep parents updated at every milestone.",
    },
    {
      step: "04",
      title: "Convert to Enrolled Students",
      desc: "Track application documents, fee submissions, and confirm admissions while generating deep ROI and seat-occupancy reports.",
    },
  ];

  const faqs = [
    {
      q: "How does LeadTrack AI support UN Sustainable Development Goal 4 (SDG 4)?",
      a: "LeadTrack AI champions UN SDG 4 (Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all) by helping institutions remove barriers to admission, eliminate lost queries, provide merit scholarship alerts to deserving students, and offer timely career counseling regardless of background.",
    },
    {
      q: "Can we embed the enquiry form on our official college website?",
      a: "Yes! LeadTrack AI includes a public, shareable enquiry portal (/enquire) with duplicate phone/email prevention, responsive design, and instantaneous lead scoring that can be directly embedded in an iframe or linked from promotional campaigns.",
    },
    {
      q: "How does the AI Lead Scoring Engine work?",
      a: "The engine scores leads from 0 to 100 based on weighted dimensions: source quality (referrals and walk-ins carry higher organic intent), counselor interaction count, profile completeness, program demand, and recency of enquiry. Counselors can click 'Why this score' on any lead to see the transparent mathematical breakdown.",
    },
    {
      q: "Does LeadTrack AI support role-based permissions?",
      a: "Absolutely. Administrators have full system and financial reporting access; Admissions Managers supervise counselors and team distribution; Counselors have a dedicated, focused workspace showing only their assigned applicants and daily call tasks.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                LeadTrack AI
              </span>
              <span className="block text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                Admissions CRM Platform
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              How It Works
            </a>
            <a href="#sdg4" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              UN SDG 4
            </a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/enquire"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Public Form Demo
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              Sign In Portal →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        {/* Soft Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-cyan-500/10 blur-[130px] -z-10 rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* SDG 4 Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-semibold backdrop-blur-md">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Empowering Institutions in Service of UN SDG 4: Quality Education</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Turn Student Inquiries Into{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              Confirmed Admissions
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            The intelligent admissions CRM built for higher education institutions. Score student intent with AI,
            automate multi-channel follow-ups, eliminate lost queries, and fill every cohort with clarity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Live Institution Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/enquire"
              target="_blank"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm backdrop-blur-md transition-all"
            >
              <Laptop className="w-4 h-4 text-indigo-500" />
              <span>Test Public Student Form</span>
            </Link>
          </div>

          {/* Quick Demo Credentials Info */}
          <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Instant Demo Login:</span>
            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
              admin@leadtrack.ai
            </code>
            <span>/</span>
            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
              Admin@123
            </code>
          </div>
        </div>

        {/* Live UI Showcase Glass Card */}
        <div className="max-w-6xl mx-auto mt-16 rounded-3xl p-3 bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent border border-white/40 dark:border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
              <div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Live Operations Deck
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Apex Institute of Technology & Management
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  155 Active Leads Tracked
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
                  8 Degree Programs
                </span>
              </div>
            </div>

            {/* Mock mini dashboard preview grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400 font-medium">Total Enquiries</span>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">155</p>
                <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-block">+14.2% this month</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400 font-medium">Hot Leads</span>
                <p className="text-2xl font-bold text-emerald-600 mt-1">42</p>
                <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-block">Score &gt;= 75 / 100</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400 font-medium">Admissions Confirmed</span>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">15</p>
                <span className="text-[11px] font-semibold text-indigo-600 mt-1 inline-block">10.3% Conversion</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400 font-medium">AI Automation Health</span>
                <p className="text-2xl font-bold text-purple-600 mt-1">99.8%</p>
                <span className="text-[11px] font-semibold text-purple-600 mt-1 inline-block">Zero SLA Breaches</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-16 bg-white/60 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, idx) => (
            <div key={idx} className="flex flex-col text-center sm:text-left">
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {s.value}
              </span>
              <span className="text-base font-semibold text-slate-800 dark:text-slate-100 mt-2">{s.label}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            Complete Feature Matrix
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
            Designed for Modern Academic Admissions
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Eliminate chaotic spreadsheets, missed calls, and disconnected channels. Everything your team needs to guide
            students from discovery to enrollment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Execution Architecture
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
              From Inquiry to Student in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((st, i) => (
              <div
                key={i}
                className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {st.step}
                  </span>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mt-4 mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UN SDG 4 Section */}
      <section id="sdg4" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl p-8 md:p-14 bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>United Nations SDG 4 Commitment</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Championing Quality Education & Equitable Access for Every Aspirant
            </h2>
            <p className="text-emerald-50 text-sm sm:text-base leading-relaxed">
              Target 4.3 seeks to ensure equal access for all women and men to affordable and quality technical, vocational
              and tertiary education. LeadTrack AI provides colleges with transparent scoring models, automated scholarship
              outreach, and responsive counseling so no student is left behind due to operational bottlenecks.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium">
                ✓ Merit Scholarship Dispatches
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium">
                ✓ Non-Discriminatory AI Scoring
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium">
                ✓ Rapid Inquiry Response Guarantee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            Have Questions?
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              {activeFaq === i && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <div className="p-12 md:p-16 rounded-3xl bg-gradient-to-b from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-xl space-y-6">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Supercharge Your Academic Admissions?
          </h2>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Join premier universities and colleges accelerating their admissions pipeline with LeadTrack AI.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xl shadow-indigo-500/30 transition-all hover:scale-105"
            >
              <span>Launch Institution Portal Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-6 bg-white dark:bg-slate-950 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-slate-900 dark:text-white text-sm">
              LeadTrack AI
            </span>
          </div>
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} LeadTrack AI. Built with pride for colleges and universities. Supporting UN SDG 4.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-indigo-600 transition-colors">
              Counselor Login
            </Link>
            <Link href="/enquire" target="_blank" className="hover:text-indigo-600 transition-colors">
              Public Enquiry
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

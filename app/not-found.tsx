"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9EE] dark:bg-[#120A0C] px-6 py-12 text-foreground">
      <div className="max-w-md w-full bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] rounded-[16px] p-8 sm:p-10 shadow-card text-center space-y-6">
        <div className="w-14 h-14 rounded-lg bg-[#D62828]/10 border border-[#D62828]/25 text-[#D62828] dark:text-[#FF5A5F] flex items-center justify-center mx-auto shadow-2xs">
          <GraduationCap className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-4xl sm:text-5xl font-bold text-[#D62828] dark:text-[#FF5A5F] tracking-tight">
            404
          </span>
          <h1 className="font-heading text-2xl font-extrabold text-foreground title-gold-accent pb-1">
            Document Not Found
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto font-sans">
            The candidate dossier, admissions ledger, or institutional report you requested does not exist or has been archived.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 font-sans">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg btn-crimson-gradient btn-shimmer text-white font-bold text-xs transition-all shadow-xs hover:scale-[1.02]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Workspace</span>
          </Link>
          <Link
            href="/leads"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-surface text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] font-semibold font-medium text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-[#6B665C]" />
            <span>Search Registry</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

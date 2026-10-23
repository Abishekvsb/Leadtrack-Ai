"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F2EA] dark:bg-[#0F1412] px-6 py-12 text-[#1B1A17] dark:text-[#ECE8DF]">
      <div className="max-w-md w-full bg-white dark:bg-[#171D1A] border border-[#E4DDD0] dark:border-[#26302B] rounded-xl p-8 sm:p-10 shadow-xs text-center space-y-6">
        <div className="w-14 h-14 rounded-lg bg-[#FAF7F0] dark:bg-[#131916] border border-[#E4DDD0] dark:border-[#26302B] text-[#0F3D33] dark:text-[#4FB89A] flex items-center justify-center mx-auto shadow-2xs">
          <GraduationCap className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-4xl sm:text-5xl font-bold text-[#0F3D33] dark:text-[#4FB89A] tracking-tight">
            404
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#1B1A17] dark:text-[#ECE8DF]">
            Document Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#6B665C] dark:text-[#959187] leading-relaxed max-w-sm mx-auto font-sans">
            The candidate dossier, admissions ledger, or institutional report you requested does not exist or has been archived.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 font-sans">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F3D33] hover:bg-[#165447] dark:bg-[#4FB89A] dark:hover:bg-[#3ea688] text-[#F6F2EA] dark:text-[#0F1412] font-medium text-xs transition-colors shadow-2xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Workspace</span>
          </Link>
          <Link
            href="/leads"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[#E4DDD0] dark:border-[#26302B] bg-[#FAF7F0] dark:bg-[#1E2622] text-[#1B1A17] dark:text-[#ECE8DF] hover:bg-[#E4DDD0]/60 dark:hover:bg-[#26302B] font-medium text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-[#6B665C]" />
            <span>Search Registry</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

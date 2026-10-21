"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12 text-slate-900 dark:text-slate-100">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/10">
          <GraduationCap className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">404</span>
          <h1 className="font-display text-2xl font-bold">Page Not Found</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            The student record, report, or institution page you requested does not exist or has been relocated.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            href="/leads"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Leads</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

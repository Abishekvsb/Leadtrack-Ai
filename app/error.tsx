"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9EE] dark:bg-[#120A0C] px-6 py-12 text-foreground">
      <div className="max-w-md w-full bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] rounded-[16px] p-8 sm:p-10 shadow-card text-center space-y-6">
        <div className="w-14 h-14 rounded-lg bg-[#C4552F]/10 border border-[#C4552F]/25 text-[#C4552F] flex items-center justify-center mx-auto shadow-2xs">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-4xl sm:text-5xl font-bold text-[#C4552F] tracking-tight">500</span>
          <h1 className="font-heading text-2xl font-extrabold text-foreground title-gold-accent pb-1">Execution Disruption</h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto font-sans">
            An unexpected error occurred during request processing. This incident has been logged into the institutional audit ledger.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 font-sans">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg btn-crimson-gradient btn-shimmer text-white font-bold text-xs transition-all shadow-xs hover:scale-[1.02]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Transaction</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-surface text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] font-semibold font-medium text-xs transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-[#6B665C]" />
            <span>Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

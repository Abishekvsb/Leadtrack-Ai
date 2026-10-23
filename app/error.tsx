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
    <div className="min-h-screen flex items-center justify-center bg-[#F6F2EA] dark:bg-[#0F1412] px-6 py-12 text-[#1B1A17] dark:text-[#ECE8DF]">
      <div className="max-w-md w-full bg-white dark:bg-[#171D1A] border border-[#E4DDD0] dark:border-[#26302B] rounded-xl p-8 sm:p-10 shadow-xs text-center space-y-6">
        <div className="w-14 h-14 rounded-lg bg-[#C4552F]/10 border border-[#C4552F]/25 text-[#C4552F] flex items-center justify-center mx-auto shadow-2xs">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-4xl sm:text-5xl font-bold text-[#C4552F] tracking-tight">500</span>
          <h1 className="font-serif text-2xl font-bold text-[#1B1A17] dark:text-[#ECE8DF]">Execution Disruption</h1>
          <p className="text-xs sm:text-sm text-[#6B665C] dark:text-[#959187] leading-relaxed max-w-sm mx-auto font-sans">
            An unexpected error occurred during request processing. This incident has been logged into the institutional audit ledger.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 font-sans">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F3D33] hover:bg-[#165447] dark:bg-[#4FB89A] dark:hover:bg-[#3ea688] text-[#F6F2EA] dark:text-[#0F1412] font-medium text-xs transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Transaction</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[#E4DDD0] dark:border-[#26302B] bg-[#FAF7F0] dark:bg-[#1E2622] text-[#1B1A17] dark:text-[#ECE8DF] hover:bg-[#E4DDD0]/60 dark:hover:bg-[#26302B] font-medium text-xs transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-[#6B665C]" />
            <span>Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

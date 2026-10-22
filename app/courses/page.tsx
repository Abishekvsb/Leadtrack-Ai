"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CoursesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/settings?tab=courses");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-xs text-slate-400">
      Loading Academic Programs & Courses...
    </div>
  );
}

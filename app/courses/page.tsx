"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CoursesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/settings?tab=courses");
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-[#FFC21A]" />
      <span className="font-heading font-medium text-xs text-muted-foreground">
        Loading Academic Programs &amp; Courses...
      </span>
    </div>
  );
}

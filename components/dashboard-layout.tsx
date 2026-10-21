"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { AiAssistantModal } from "@/components/ai-assistant-modal";
import { Bot, Sparkles, Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (data.success && data.data?.user) {
          setUser(data.data.user);
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Loading LeadTrack AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50/60 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar
        userRole={user?.role}
        institutionName={user?.institution?.name || "Apex Institute"}
        onOpenAiChat={() => setAiModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>

      {/* Floating AI Assistant Action Trigger */}
      <button
        onClick={() => setAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-medium text-xs shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
        title="Open AI Counselor Advisor"
      >
        <Bot className="w-4 h-4 animate-bounce" />
        <span className="hidden sm:inline">Ask AI Advisor</span>
      </button>

      {/* AI Assistant Modal */}
      <AiAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}

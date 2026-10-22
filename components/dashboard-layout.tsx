"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { AiAssistantModal } from "@/components/ai-assistant-modal";
import { ProductTourModal } from "@/components/product-tour-modal";
import {
  LayoutDashboard,
  Users2,
  KanbanSquare,
  PhoneCall,
  Menu,
  X,
  Sparkles,
  MessageSquareShare,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Bot,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { getInitials } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

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

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

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

  const mobileNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Leads", href: "/leads", icon: Users2 },
    { label: "Pipeline", href: "/pipeline", icon: KanbanSquare },
    { label: "Calls", href: "/follow-ups", icon: PhoneCall },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar (Hidden on mobile) */}
      <Sidebar
        userRole={user?.role}
        institutionName={user?.institution?.name || "LeadTrack AI"}
        onOpenAiChat={() => setAiModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (md:hidden, min 44px tap targets) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around h-16 px-1 safe-area-pb">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl text-[10px] font-semibold transition-colors ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}

        {/* Mobile AI Quick Trigger */}
        <button
          onClick={() => setAiModalOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl text-[10px] font-semibold text-indigo-600 dark:text-indigo-400"
          title="Open AI Copilot"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="mt-1">Copilot</span>
        </button>

        {/* More Menu Drawer Trigger */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          title="More navigation"
        >
          <Menu className="w-5 h-5" />
          <span className="mt-1">More</span>
        </button>
      </nav>

      {/* Mobile Slide-Over Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full p-6 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-250">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {user?.institution?.name || "LeadTrack AI"}
                  </h3>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
                    {user?.role} Workspace
                  </span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <Link
                  href="/automation"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Automation Rules</span>
                </Link>

                <Link
                  href="/templates"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
                >
                  <MessageSquareShare className="w-4 h-4 text-blue-500" />
                  <span>Communication Templates</span>
                </Link>

                <Link
                  href="/analytics"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
                >
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  <span>Analytics &amp; ROI</span>
                </Link>

                {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                  <Link
                    href="/team"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
                  >
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span>Counselor Team</span>
                  </Link>
                )}

                <Link
                  href="/settings"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings &amp; Courses</span>
                </Link>

                <Link
                  href="/guide"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
                >
                  <HelpCircle className="w-4 h-4 text-purple-500" />
                  <span>How App Works (Guide)</span>
                </Link>

                <Link
                  href="/enquire"
                  target="_blank"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors min-h-[44px]"
                >
                  <span>Public Enquiry Form</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3 px-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center">
                  {getInitials(user?.name || "User")}
                </div>
                <div className="truncate">
                  <p className="font-bold text-xs truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Floating AI Trigger (hidden on mobile, mobile uses bottom nav trigger) */}
      <button
        onClick={() => setAiModalOpen(true)}
        className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-medium text-xs shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
        title="Open AI Counselor Advisor"
      >
        <Bot className="w-4 h-4 animate-bounce" />
        <span>Ask AI Advisor</span>
      </button>

      {/* AI Assistant Modal */}
      <AiAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />

      {/* First-login Product Tour Modal */}
      <ProductTourModal />
    </div>
  );
}

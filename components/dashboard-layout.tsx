"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { AnnouncementTicker } from "@/components/ui/design-system";
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
  GraduationCap,
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
  const [tickerStats, setTickerStats] = useState<Array<{ label: string; value: string | number }>>([
    { label: "Admissions Window", value: "Active Cycle 2026/27" },
    { label: "UN SDG 4", value: "Quality Education" },
    { label: "AI Lead Scoring", value: "Realtime" },
  ]);

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

  // Load ticker live indicators
  useEffect(() => {
    async function loadTickerData() {
      try {
        const res = await fetch("/api/dashboard?range=today");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.kpis) {
            const k = json.data.kpis;
            const items = [
              { label: "Today's Enquiries", value: k.newToday?.value ?? 0 },
              { label: "Hot Leads Qualified", value: k.hotLeads?.value ?? 0 },
              { label: "Follow-ups Due Today", value: k.followUpsDue?.value ?? 0 },
              { label: "Confirmed Admissions", value: k.admissionsConfirmed?.value ?? 0 },
              { label: "UN SDG 4", value: "Quality Higher Education" },
            ];
            setTickerStats(items);
          }
        }
      } catch {}
    }
    loadTickerData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-[#D62828] to-[#8F1218] flex items-center justify-center text-[#FFC21A] shadow-crimson-glow animate-pulse">
            <GraduationCap className="w-6 h-6 stroke-[1.75]" />
          </div>
          <p className="text-xs font-heading font-bold text-muted-foreground tracking-tight">
            LeadTrack AI Admissions Workspace...
          </p>
        </div>
      </div>
    );
  }

  const mobileNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Leads", href: "/leads", icon: Users2 },
    { label: "Pipeline", href: "/pipeline", icon: KanbanSquare },
    { label: "Follow-ups", href: "/follow-ups", icon: PhoneCall },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Announcement Ticker in Royal Crimson & Gold */}
      <AnnouncementTicker items={tickerStats} />

      <div className="flex flex-1 min-h-[calc(100vh-32px)]">
        {/* Desktop Sidebar (Hidden on mobile) */}
        <Sidebar
          userRole={user?.role}
          institutionName={user?.institution?.name || "LeadTrack AI"}
          institutionLogo={user?.institution?.logo}
          onOpenAiChat={() => setAiModalOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar user={user} />
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1280px] w-full mx-auto animate-fade-up pb-24 md:pb-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (md:hidden, min 44px tap targets) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border flex items-center justify-around h-16 px-1 safe-area-pb shadow-floating">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-[8px] text-[10px] font-medium transition-all ${
                isActive
                  ? "text-[#D62828] dark:text-[#FF5A5F] font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`w-4 h-4 stroke-[1.75] ${
                  isActive ? "text-[#D62828] dark:text-[#FF5A5F]" : ""
                }`}
              />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}

        {/* Mobile AI Quick Trigger */}
        <button
          onClick={() => setAiModalOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-[8px] text-[10px] font-medium text-[#D62828] dark:text-[#FF5A5F]"
          title="Open AI Copilot"
        >
          <div className="w-6 h-6 rounded-[8px] bg-gradient-to-br from-[#D62828] to-[#8F1218] text-[#FFC21A] flex items-center justify-center shadow-xs">
            <Bot className="w-3.5 h-3.5 stroke-[1.75]" />
          </div>
          <span className="mt-1 font-bold">Copilot</span>
        </button>

        {/* More Menu Drawer Trigger */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-[8px] text-[10px] font-medium text-muted-foreground hover:text-foreground"
          title="More navigation"
        >
          <Menu className="w-4 h-4 stroke-[1.5]" />
          <span className="mt-1">More</span>
        </button>
      </nav>

      {/* Mobile Slide-Over Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden bg-black/50 backdrop-blur-xs animate-fade-up">
          <div className="w-4/5 max-w-xs bg-card h-full p-6 shadow-floating flex flex-col justify-between border-l border-border">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    {user?.institution?.name || "LeadTrack AI"}
                  </h3>
                  <span className="text-[10px] text-[#D62828] dark:text-[#FF5A5F] font-bold uppercase tracking-wider">
                    {user?.role} Workspace
                  </span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-[8px] text-muted-foreground hover:text-foreground hover:bg-muted/60"
                >
                  <X className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>

              <div className="space-y-1">
                <Link
                  href="/automation"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-xs font-medium text-foreground hover:bg-muted/60 transition-colors min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 text-[#FFC21A] stroke-[1.5]" />
                  <span>Automation Rules</span>
                </Link>

                <Link
                  href="/templates"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-xs font-medium text-foreground hover:bg-muted/60 transition-colors min-h-[44px]"
                >
                  <MessageSquareShare className="w-4 h-4 text-[#64748B] stroke-[1.5]" />
                  <span>Communication Templates</span>
                </Link>

                <Link
                  href="/analytics"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-xs font-medium text-foreground hover:bg-muted/60 transition-colors min-h-[44px]"
                >
                  <BarChart3 className="w-4 h-4 text-[#D62828] dark:text-[#FF5A5F] stroke-[1.5]" />
                  <span>Analytics &amp; ROI</span>
                </Link>

                {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                  <Link
                    href="/team"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-xs font-medium text-foreground hover:bg-muted/60 transition-colors min-h-[44px]"
                  >
                    <Users className="w-4 h-4 text-[#64748B] stroke-[1.5]" />
                    <span>Counselor Team</span>
                  </Link>
                )}

                <Link
                  href="/settings"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-xs font-medium text-foreground hover:bg-muted/60 transition-colors min-h-[44px]"
                >
                  <Settings className="w-4 h-4 text-muted-foreground stroke-[1.5]" />
                  <span>Settings &amp; Courses</span>
                </Link>

                <Link
                  href="/guide"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-xs font-medium text-foreground hover:bg-muted/60 transition-colors min-h-[44px]"
                >
                  <HelpCircle className="w-4 h-4 text-muted-foreground stroke-[1.5]" />
                  <span>Admissions Guide</span>
                </Link>

                <Link
                  href="/enquire"
                  target="_blank"
                  className="flex items-center justify-between px-3 py-2.5 rounded-[8px] text-xs font-medium text-[#D62828] dark:text-[#FF5A5F] hover:bg-muted/60 transition-colors min-h-[44px]"
                >
                  <span>Public Enquiry Form</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[1.5]" />
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center gap-3 px-1">
                <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#D62828] to-[#8F1218] text-white font-bold text-xs flex items-center justify-center border border-[#FFC21A]/30">
                  {getInitials(user?.name || "User")}
                </div>
                <div className="truncate">
                  <p className="font-bold text-xs text-foreground truncate">{user?.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[8px] text-xs font-bold text-[#D62828] dark:text-[#FF5A5F] hover:bg-[#D62828]/10 transition-colors min-h-[44px]"
              >
                <LogOut className="w-4 h-4 stroke-[1.5]" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Floating AI Copilot Orb Trigger */}
      <button
        onClick={() => setAiModalOpen(true)}
        className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 px-4 py-2.5 rounded-[12px] btn-crimson-gradient font-bold text-xs shadow-crimson-glow hover:-translate-y-1 transition-all group"
        title="Open AI Counselor Copilot"
      >
        <div className="w-5 h-5 rounded-full bg-[#FFC21A] text-[#17141A] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
          <Bot className="w-3.5 h-3.5 stroke-[2]" />
        </div>
        <span>Counselor Copilot</span>
        <span className="w-2 h-2 rounded-full bg-[#FFC21A] animate-ping" />
      </button>

      {/* AI Assistant Modal */}
      <AiAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />

      {/* First-login Product Tour Modal */}
      <ProductTourModal />
    </div>
  );
}

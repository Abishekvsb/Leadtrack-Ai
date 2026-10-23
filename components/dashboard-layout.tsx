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
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-[#0F3D33] dark:bg-[#4FB89A] flex items-center justify-center text-[#F6F2EA] dark:text-[#0F1412] shadow-xs">
            <GraduationCap className="w-5 h-5 stroke-[1.5]" />
          </div>
          <p className="text-xs font-medium text-muted-foreground font-serif tracking-tight">
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
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar (Hidden on mobile) */}
      <Sidebar
        userRole={user?.role}
        institutionName={user?.institution?.name || "LeadTrack AI"}
        onOpenAiChat={() => setAiModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1280px] w-full mx-auto animate-fade-up pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (md:hidden, min 44px tap targets) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex items-center justify-around h-16 px-1 safe-area-pb">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-[6px] text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-[#0F3D33] dark:text-[#4FB89A] font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`w-4 h-4 stroke-[1.5] ${
                  isActive ? "text-[#0F3D33] dark:text-[#4FB89A]" : ""
                }`}
              />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}

        {/* Mobile AI Quick Trigger */}
        <button
          onClick={() => setAiModalOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-[6px] text-[10px] font-medium text-[#0F3D33] dark:text-[#4FB89A]"
          title="Open AI Copilot"
        >
          <div className="w-5 h-5 rounded-[6px] bg-[#0F3D33] dark:bg-[#4FB89A] text-[#F6F2EA] dark:text-[#0F1412] flex items-center justify-center shadow-xs">
            <Bot className="w-3.5 h-3.5 stroke-[1.5]" />
          </div>
          <span className="mt-1">Copilot</span>
        </button>

        {/* More Menu Drawer Trigger */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-[6px] text-[10px] font-medium text-muted-foreground hover:text-foreground"
          title="More navigation"
        >
          <Menu className="w-4 h-4 stroke-[1.5]" />
          <span className="mt-1">More</span>
        </button>
      </nav>

      {/* Mobile Slide-Over Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden bg-black/40 animate-fade-up">
          <div className="w-4/5 max-w-xs bg-card h-full p-6 shadow-academic-floating flex flex-col justify-between border-l border-border">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="font-serif text-sm font-normal text-foreground">
                    {user?.institution?.name || "LeadTrack AI"}
                  </h3>
                  <span className="text-[10px] text-[#0F3D33] dark:text-[#4FB89A] font-semibold uppercase tracking-wider">
                    {user?.role} Workspace
                  </span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-[6px] text-muted-foreground hover:text-foreground hover:bg-muted/60"
                >
                  <X className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>

              <div className="space-y-1">
                <Link
                  href="/automation"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-xs font-medium text-foreground hover:bg-muted/60 transition-colors min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 text-[#E0A030] stroke-[1.5]" />
                  <span>Automation Rules</span>
                </Link>

                <Link
                  href="/templates"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-xs font-medium text-foreground hover:bg-muted/60 transition-colors min-h-[44px]"
                >
                  <MessageSquareShare className="w-4 h-4 text-[#5B7083] stroke-[1.5]" />
                  <span>Communication Templates</span>
                </Link>

                <Link
                  href="/analytics"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-xs font-medium text-foreground hover:bg-muted/60 transition-colors min-h-[44px]"
                >
                  <BarChart3 className="w-4 h-4 text-[#0F3D33] dark:text-[#4FB89A] stroke-[1.5]" />
                  <span>Analytics &amp; ROI</span>
                </Link>

                {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                  <Link
                    href="/team"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-xs font-medium text-foreground hover:bg-muted/60 transition-colors min-h-[44px]"
                  >
                    <Users className="w-4 h-4 text-[#5B7083] stroke-[1.5]" />
                    <span>Counselor Team</span>
                  </Link>
                )}

                <Link
                  href="/settings"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-xs font-medium text-foreground hover:bg-muted/60 transition-colors min-h-[44px]"
                >
                  <Settings className="w-4 h-4 text-muted-foreground stroke-[1.5]" />
                  <span>Settings &amp; Courses</span>
                </Link>

                <Link
                  href="/guide"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-xs font-medium text-foreground hover:bg-muted/60 transition-colors min-h-[44px]"
                >
                  <HelpCircle className="w-4 h-4 text-muted-foreground stroke-[1.5]" />
                  <span>Admissions Guide</span>
                </Link>

                <Link
                  href="/enquire"
                  target="_blank"
                  className="flex items-center justify-between px-3 py-2.5 rounded-[6px] text-xs font-medium text-[#0F3D33] dark:text-[#4FB89A] hover:bg-muted/60 transition-colors min-h-[44px]"
                >
                  <span>Public Enquiry Form</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[1.5]" />
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center gap-3 px-1">
                <div className="w-8 h-8 rounded-[6px] bg-[#0F3D33] dark:bg-[#4FB89A] text-[#F6F2EA] dark:text-[#0F1412] font-semibold text-xs flex items-center justify-center">
                  {getInitials(user?.name || "User")}
                </div>
                <div className="truncate">
                  <p className="font-medium text-xs text-foreground truncate">{user?.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[6px] text-xs font-medium text-[#C4552F] hover:bg-[#C4552F]/10 transition-colors min-h-[44px]"
              >
                <LogOut className="w-4 h-4 stroke-[1.5]" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Floating AI Trigger (hidden on mobile, mobile uses bottom nav trigger) */}
      <button
        onClick={() => setAiModalOpen(true)}
        className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 px-4 py-2.5 rounded-[8px] bg-[#0F3D33] hover:bg-[#165447] dark:bg-[#4FB89A] dark:hover:bg-[#63C7AA] text-[#F6F2EA] dark:text-[#0F1412] font-medium text-xs shadow-academic-floating border border-[#0F3D33] dark:border-[#4FB89A] hover:-translate-y-0.5 transition-all"
        title="Open AI Counselor Copilot"
      >
        <Bot className="w-4 h-4 stroke-[1.5]" />
        <span>Counselor Copilot</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#E0A030]" />
      </button>

      {/* AI Assistant Modal */}
      <AiAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />

      {/* First-login Product Tour Modal */}
      <ProductTourModal />
    </div>
  );
}


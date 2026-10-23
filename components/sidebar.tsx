"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users2,
  KanbanSquare,
  CalendarCheck2,
  Sparkles,
  MessageSquareShare,
  BarChart3,
  Users,
  Settings,
  ShieldCheck,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BotMessageSquare,
} from "lucide-react";

interface SidebarProps {
  userRole?: string;
  institutionName?: string;
  onOpenAiChat?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export function Sidebar({ userRole = "ADMIN", institutionName = "LeadTrack AI", onOpenAiChat }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const sections: NavSection[] = [
    {
      label: "Admissions",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Leads", href: "/leads", icon: Users2 },
        { name: "Pipeline", href: "/pipeline", icon: KanbanSquare },
        { name: "Follow-ups", href: "/follow-ups", icon: CalendarCheck2 },
      ],
    },
    {
      label: "Insights",
      items: [
        { name: "Analytics & ROI", href: "/analytics", icon: BarChart3 },
      ],
    },
    {
      label: "Workspace",
      items: [
        { name: "Automations", href: "/automation", icon: Sparkles },
        { name: "Templates", href: "/templates", icon: MessageSquareShare },
      ],
    },
    {
      label: "Admin",
      items: [
        ...(userRole === "ADMIN" || userRole === "MANAGER"
          ? [{ name: "Counselor Team", href: "/team", icon: Users }]
          : []),
        { name: "Settings", href: "/settings", icon: Settings },
        ...(userRole === "ADMIN"
          ? [{ name: "Audit Trail", href: "/audit-logs", icon: ShieldCheck }]
          : []),
      ],
    },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-border bg-card transition-all duration-200 z-30 shrink-0 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border/70">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden select-none">
          <div className="w-8 h-8 rounded-[8px] bg-[#0F3D33] dark:bg-[#4FB89A] flex items-center justify-center text-[#F6F2EA] dark:text-[#0F1412] shrink-0 shadow-xs">
            <GraduationCap className="w-4 h-4 stroke-[1.5]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-base font-normal tracking-tight text-foreground truncate">
                LeadTrack AI
              </span>
              <span className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">
                {institutionName}
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-[6px] text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
          title={collapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
        {sections.map((section) => {
          if (section.items.length === 0) return null;
          return (
            <div key={section.label} className="space-y-0.5">
              {!collapsed && (
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {section.label}
                </div>
              )}
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[6px] text-xs font-medium transition-colors select-none ${
                      isActive
                        ? "border-l-2 border-[#0F3D33] dark:border-[#4FB89A] bg-[#0F3D33]/10 dark:bg-[#4FB89A]/15 text-[#0F3D33] dark:text-[#4FB89A] font-semibold pl-2"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 stroke-[1.5] ${
                        isActive ? "text-[#0F3D33] dark:text-[#4FB89A]" : "text-muted-foreground"
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* AI Assistant Quick Trigger */}
      {onOpenAiChat && (
        <div className="p-2 border-t border-border/70">
          <button
            onClick={onOpenAiChat}
            className="w-full flex items-center justify-center gap-2 py-2 px-2.5 rounded-[8px] bg-muted/60 hover:bg-muted text-foreground border border-border text-xs font-medium transition-colors"
            title="Open AI Counselor Copilot"
          >
            <BotMessageSquare className="w-4 h-4 text-[#0F3D33] dark:text-[#4FB89A] stroke-[1.5] shrink-0" />
            {!collapsed && <span>Counselor Copilot</span>}
          </button>
        </div>
      )}

      {/* SDG 4 Badge & Public Form Link */}
      <div className="p-2 border-t border-border/70 space-y-1.5">
        <Link
          href="/enquire"
          target="_blank"
          className="flex items-center justify-between px-2.5 py-1.5 text-xs rounded-[6px] text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          title="Open Public Student Enquiry Form"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 stroke-[1.5]" />
            {!collapsed && "Public Form"}
          </span>
          {!collapsed && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#E0A030]">Live</span>
          )}
        </Link>

        {!collapsed && (
          <div className="px-2.5 py-1.5 bg-muted/40 rounded-[6px] border border-border text-[10px] text-muted-foreground flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F3D33] dark:bg-[#4FB89A] shrink-0" />
            <span className="tracking-tight">UN SDG 4: Quality Education</span>
          </div>
        )}
      </div>
    </aside>
  );
}


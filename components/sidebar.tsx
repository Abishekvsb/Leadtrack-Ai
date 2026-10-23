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
  institutionLogo?: string | null;
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

export function Sidebar({
  userRole = "ADMIN",
  institutionName = "LeadTrack AI",
  institutionLogo,
  onOpenAiChat,
}: SidebarProps) {
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
          {/* Logo with Fallback = crimson rounded square with gold graduation cap mark */}
          {institutionLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={institutionLogo}
              alt={institutionName}
              className="w-9 h-9 rounded-[10px] object-cover shrink-0 border border-border shadow-xs"
            />
          ) : (
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#D62828] to-[#8F1218] flex items-center justify-center text-[#FFC21A] shrink-0 shadow-xs border border-white/10">
              <GraduationCap className="w-5 h-5 stroke-[1.75]" />
            </div>
          )}
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-heading text-base font-bold tracking-tight text-foreground truncate">
                LeadTrack AI
              </span>
              <span className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-semibold">
                {institutionName}
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-[8px] text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
          title={collapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4 stroke-[1.5]" /> : <ChevronLeft className="w-4 h-4 stroke-[1.5]" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
        {sections.map((section) => {
          if (section.items.length === 0) return null;
          return (
            <div key={section.label} className="space-y-0.5">
              {!collapsed && (
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
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
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-xs font-medium transition-all select-none ${
                      isActive
                        ? "border-l-3 border-[#FFC21A] bg-[#D62828]/10 text-[#D62828] dark:text-[#FF5A5F] font-bold pl-2 shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 stroke-[1.5] ${
                        isActive ? "text-[#D62828] dark:text-[#FF5A5F]" : "text-muted-foreground"
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
            className="w-full flex items-center justify-center gap-2 py-2 px-2.5 rounded-[10px] bg-gradient-to-r from-[#D62828]/10 via-[#FFC21A]/10 to-transparent hover:from-[#D62828]/15 hover:via-[#FFC21A]/20 text-foreground border border-border text-xs font-semibold transition-all group"
            title="Open AI Counselor Copilot"
          >
            <BotMessageSquare className="w-4 h-4 text-[#D62828] dark:text-[#FF5A5F] stroke-[1.5] shrink-0 group-hover:scale-110 transition-transform" />
            {!collapsed && <span>Counselor Copilot</span>}
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC21A] shrink-0" />
          </button>
        </div>
      )}

      {/* SDG 4 Badge & Public Form Link */}
      <div className="p-2 border-t border-border/70 space-y-1.5">
        <Link
          href="/enquire"
          target="_blank"
          className="flex items-center justify-between px-2.5 py-1.5 text-xs rounded-[8px] text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          title="Open Public Student Enquiry Form"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 stroke-[1.5]" />
            {!collapsed && "Public Form"}
          </span>
          {!collapsed && (
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#FFC21A]">Live</span>
          )}
        </Link>

        {!collapsed && (
          <div className="px-2.5 py-1.5 bg-muted/40 rounded-[8px] border border-border text-[10px] text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D62828] shrink-0 shadow-xs" />
            <span className="tracking-tight font-medium">UN SDG 4: Quality Education</span>
          </div>
        )}
      </div>
    </aside>
  );
}

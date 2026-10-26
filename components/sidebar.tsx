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
  LogOut,
} from "lucide-react";

interface SidebarProps {
  userRole?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string | null;
  institutionName?: string;
  institutionLogo?: string | null;
  onOpenAiChat?: () => void;
  onLogout?: () => void;
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
  userName = "Counselor",
  userEmail = "counselor@institution.edu",
  userAvatar,
  institutionName = "LeadTrack AI",
  institutionLogo,
  onOpenAiChat,
  onLogout,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const sections: NavSection[] = [
    {
      label: "ADMISSIONS",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Leads", href: "/leads", icon: Users2 },
        { name: "Pipeline", href: "/pipeline", icon: KanbanSquare },
        { name: "Follow-ups", href: "/follow-ups", icon: CalendarCheck2 },
      ],
    },
    {
      label: "INSIGHTS",
      items: [
        { name: "Analytics & ROI", href: "/analytics", icon: BarChart3 },
      ],
    },
    {
      label: "ADMIN",
      items: [
        { name: "Automations", href: "/automation", icon: Sparkles },
        { name: "Templates", href: "/templates", icon: MessageSquareShare },
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

  const getInitials = (nameStr: string) => {
    return nameStr
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <aside
      className={`relative flex flex-col border-r border-border bg-white dark:bg-[#1B1114] transition-all duration-200 z-30 shrink-0 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border/70 bg-white dark:bg-[#1B1114]">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden select-none">
          {institutionLogo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={institutionLogo}
              alt={institutionName}
              className="w-9 h-9 rounded-[10px] object-cover shrink-0 border border-border shadow-xs"
            />
          ) : (
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#E63946] via-[#D62828] to-[#8F1218] flex items-center justify-center text-[#FFC21A] shrink-0 shadow-xs border border-white/15">
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
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 font-heading">
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
                        ? "border-l-[3.5px] border-[#FFC21A] bg-[#D62828]/10 text-[#D62828] dark:text-[#FF5A5F] font-bold pl-2.5 shadow-xs"
                        : "text-[#6B6470] dark:text-[#9E9296] hover:text-[#17141A] dark:hover:text-white hover:bg-[#FFF9EE] dark:hover:bg-[#27191E]/60"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 stroke-[1.5] ${
                        isActive ? "text-[#D62828] dark:text-[#FF5A5F]" : "text-[#6B6470] dark:text-[#9E9296]"
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

      {/* Counselor Copilot AI Trigger */}
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

      {/* User Card at the Bottom */}
      <div className="p-2 border-t border-border/70 bg-[#FFF9EE]/40 dark:bg-[#170E11]/40">
        {!collapsed ? (
          <div className="flex items-center justify-between p-2 rounded-[10px] bg-white dark:bg-[#1B1114] border border-border shadow-xs">
            <Link href="/settings" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity">
              {userAvatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-8 h-8 rounded-[8px] object-cover shrink-0 border border-border"
                />
              ) : (
                <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#E63946] to-[#8F1218] text-white font-bold text-xs flex items-center justify-center shrink-0 border border-[#FFC21A]/35 shadow-xs">
                  {getInitials(userName || "User")}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-foreground truncate leading-tight">
                  {userName}
                </span>
                <span className="text-[10px] text-muted-foreground truncate uppercase font-medium tracking-wider">
                  {userRole}
                </span>
              </div>
            </Link>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 rounded-[6px] text-muted-foreground hover:text-[#D62828] hover:bg-[#D62828]/10 transition-colors ml-1 shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center py-1">
            <Link
              href="/settings"
              title={`${userName} (${userRole})`}
              className="w-9 h-9 rounded-[8px] bg-gradient-to-br from-[#E63946] to-[#8F1218] text-white font-bold text-xs flex items-center justify-center border border-[#FFC21A]/35 shadow-xs hover:scale-105 transition-transform"
            >
              {getInitials(userName || "User")}
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

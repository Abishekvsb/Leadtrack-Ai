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

export function Sidebar({ userRole = "ADMIN", institutionName = "Apex Institute", onOpenAiChat }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leads", href: "/leads", icon: Users2 },
    { name: "Admissions Pipeline", href: "/pipeline", icon: KanbanSquare },
    { name: "Follow-ups", href: "/follow-ups", icon: CalendarCheck2 },
    { name: "Automation Rules", href: "/automation", icon: Sparkles },
    { name: "Templates", href: "/templates", icon: MessageSquareShare },
    { name: "Analytics & ROI", href: "/analytics", icon: BarChart3 },
    ...(userRole === "ADMIN" || userRole === "MANAGER"
      ? [{ name: "Counselor Team", href: "/team", icon: Users }]
      : []),
    { name: "Settings", href: "/settings", icon: Settings },
    ...(userRole === "ADMIN"
      ? [{ name: "Audit Trail", href: "/audit-logs", icon: ShieldCheck }]
      : []),
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl transition-all duration-300 z-30 shrink-0 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-base tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
                LeadTrack AI
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                {institutionName}
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* AI Assistant Quick Trigger */}
      {onOpenAiChat && (
        <div className="p-3">
          <button
            onClick={onOpenAiChat}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all font-medium text-xs shadow-sm`}
          >
            <BotMessageSquare className="w-4 h-4 shrink-0" />
            {!collapsed && <span>AI Advisor Chat</span>}
          </button>
        </div>
      )}

      {/* SDG 4 Badge & Public Form Link */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
        <Link
          href="/enquire"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Open Public Student Enquiry Form"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            {!collapsed && "Public Form"}
          </span>
          {!collapsed && <span className="text-[10px] uppercase font-semibold text-indigo-500">Live</span>}
        </Link>

        {!collapsed && (
          <div className="px-3 py-2 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>UN SDG 4: Quality Education</span>
          </div>
        )}
      </div>
    </aside>
  );
}

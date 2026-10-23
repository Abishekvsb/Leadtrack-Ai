"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell,
  Sun,
  Moon,
  Search,
  LogOut,
  Settings,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/components/toast-context";
import { getInitials } from "@/lib/utils";

interface TopbarProps {
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
  } | null;
}

export function Topbar({ user }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications
  useEffect(() => {
    async function loadNotifs() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setNotifications(data.data.notifications || []);
            setUnreadCount(data.data.unreadCount || 0);
          }
        }
      } catch {
        // quiet
      }
    }
    loadNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/leads?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    success("Logged out successfully");
    router.push("/login");
  };

  // Generate breadcrumb title
  const pathParts = pathname?.split("/").filter(Boolean) || [];
  const currentTitle =
    pathParts.length > 0
      ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1).replace("-", " ")
      : "Dashboard";

  return (
    <header className="sticky top-0 z-20 h-16 w-full border-b border-border bg-card flex items-center justify-between px-4 sm:px-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs select-none">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          LeadTrack
        </span>
        <span className="text-border">/</span>
        <span className="font-serif text-sm font-medium text-foreground tracking-tight">
          {currentTitle}
        </span>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground stroke-[1.5]" />
          <input
            type="text"
            placeholder="Search leads by name, email, phone... (Enter)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-[8px] bg-background border border-border focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-foreground transition-colors placeholder:text-muted-foreground/70"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Help & In-App Guide */}
        <Link
          href="/guide"
          className="min-h-[38px] min-w-[38px] flex items-center justify-center p-2 rounded-[6px] text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
          title="In-App Admissions Guide"
        >
          <HelpCircle className="w-4 h-4 stroke-[1.5]" />
        </Link>

        {/* Dark/Light Mode Switcher */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="min-h-[38px] min-w-[38px] flex items-center justify-center p-2 rounded-[6px] text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
          title="Toggle Light / Dark mode"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-[#E0A030] stroke-[1.5]" />
          ) : (
            <Moon className="w-4 h-4 text-[#0F3D33] stroke-[1.5]" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative min-h-[38px] min-w-[38px] flex items-center justify-center p-2 rounded-[6px] text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[1.5]" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E0A030]" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-24px)] rounded-[12px] bg-card border border-border shadow-academic-floating p-4 z-50 animate-fade-up">
              <div className="flex items-center justify-between pb-2.5 border-b border-border">
                <span className="font-serif text-sm font-medium text-foreground">
                  Notifications ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-[#0F3D33] dark:text-[#4FB89A] hover:underline flex items-center"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-border/60 py-1">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    No new notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className={`py-2.5 text-xs ${
                        !n.isRead ? "font-medium" : "text-muted-foreground"
                      }`}
                    >
                      <p className="font-medium text-foreground">{n.title}</p>
                      <p className="text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-2 border-t border-border text-center">
                <Link
                  href="/notifications"
                  onClick={() => setShowNotifs(false)}
                  className="text-xs text-[#0F3D33] dark:text-[#4FB89A] font-medium hover:underline"
                >
                  View full notifications center →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="min-h-[38px] flex items-center gap-2 p-1 rounded-[6px] hover:bg-muted/70 transition-colors"
          >
            <div className="w-7 h-7 rounded-[6px] bg-[#0F3D33] dark:bg-[#4FB89A] text-[#F6F2EA] dark:text-[#0F1412] font-semibold text-xs flex items-center justify-center shrink-0">
              {getInitials(user?.name || "User")}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-medium leading-tight text-foreground truncate max-w-[120px]">
                {user?.name || "Counselor"}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {user?.role || "COUNSELOR"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground stroke-[1.5]" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-52 rounded-[12px] bg-card border border-border shadow-academic-floating p-2 z-50 animate-fade-up">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs rounded-[6px] text-foreground hover:bg-muted/60 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-muted-foreground stroke-[1.5]" />
                  Account Settings
                </Link>
              </div>
              <div className="pt-1 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-[6px] text-[#C4552F] hover:bg-[#C4552F]/10 transition-colors font-medium text-left"
                >
                  <LogOut className="w-3.5 h-3.5 stroke-[1.5]" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


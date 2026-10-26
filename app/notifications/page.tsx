"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/components/toast-context";
import {
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { timeAgo } from "@/lib/utils";

export default function NotificationsPage() {
  const { success, error } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const json = await res.json();
        if (json.success) setNotifications(json.data.notifications || []);
      }
    } catch {
      error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true }),
      });
      if (res.ok) {
        success("All notifications marked as read");
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch {
      error("Action failed");
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch {}
  };

  const filtered = notifications.filter((n) => (filter === "UNREAD" ? !n.isRead : true));

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0E6D6] dark:border-[#2E1D21] pb-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#D62828] dark:text-[#FF5A5F] font-bold mb-1">
              Admissions Dispatch
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight title-gold-accent pb-2">
              Institutional Alerts &amp; Notices
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Real-time counselor task deadlines, high intent candidate alerts, and SLA notifications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 rounded-[10px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] shadow-xs">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-colors ${
                  filter === "ALL"
                    ? "btn-crimson-gradient text-white font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Notices
              </button>
              <button
                onClick={() => setFilter("UNREAD")}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-colors ${
                  filter === "UNREAD"
                    ? "btn-crimson-gradient text-white font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Unread Only
              </button>
            </div>

            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 min-h-[40px] rounded-[10px] border border-[#F0E6D6] dark:border-[#2E1D21] bg-white dark:bg-[#1B1114] text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#25171B] text-xs font-semibold transition-colors shadow-xs"
            >
              Mark All Read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#D62828] dark:text-[#FF5A5F] mx-auto" />
            <p className="font-heading italic text-xs text-muted-foreground">Checking institutional dispatch...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 rounded-[14px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] text-center space-y-3 shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-[#D62828] dark:text-[#FF5A5F] mx-auto stroke-[1.5]" />
            <h3 className="font-heading text-lg font-bold text-foreground">You are all caught up</h3>
            <p className="text-xs text-muted-foreground">No unread notices or pending alerts in your dispatch queue.</p>
          </div>
        ) : (
          <div className="rounded-[14px] bg-white dark:bg-[#1B1114] border border-[#F0E6D6] dark:border-[#2E1D21] shadow-xs divide-y divide-[#F0E6D6] dark:divide-[#2E1D21]">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMarkRead(item.id)}
                className={`p-5 flex items-start justify-between gap-4 hover:bg-[#FFF9EE]/70 dark:hover:bg-[#27191E]/60 transition-colors cursor-pointer ${
                  !item.isRead ? "bg-[#FFF9EE] dark:bg-[#1B1114] border-l-4 border-l-[#D62828]" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 border ${
                      item.type === "HIGH_SCORE"
                        ? "bg-[#C4552F]/10 text-[#C4552F] border-[#C4552F]/20"
                        : item.type === "FOLLOW_UP"
                        ? "bg-[#FFC21A]/15 text-[#8A5A00] dark:text-[#FFD25A] border-[#FFC21A]/35 font-bold"
                        : "bg-[#D62828]/10 text-[#D62828] dark:text-[#FF5A5F] border-[#D62828]/25 font-bold"
                    }`}
                  >
                    {item.type === "HIGH_SCORE" ? (
                      <Flame className="w-4 h-4 stroke-[1.5]" />
                    ) : item.type === "FOLLOW_UP" ? (
                      <Calendar className="w-4 h-4 stroke-[1.5]" />
                    ) : (
                      <Bell className="w-4 h-4 stroke-[1.5]" />
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading text-base font-normal text-foreground">{item.title}</h4>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-accent shrink-0" title="Unread notice" />
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-xl">
                      {item.message}
                    </p>
                    <span className="text-[10px] font-mono text-muted-foreground block pt-0.5">
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                </div>

                {item.link && (
                  <Link
                    href={item.link}
                    className="p-2 rounded-[8px] border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#1B1114] transition-colors shrink-0"
                    title="Open related record"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

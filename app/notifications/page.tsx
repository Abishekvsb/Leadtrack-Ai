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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Notifications &amp; Activity Alerts
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Urgent counselor tasks, hot lead alerts, and autonomous SLA triggers
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  filter === "ALL" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                All Alerts
              </button>
              <button
                onClick={() => setFilter("UNREAD")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  filter === "UNREAD" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Unread Only
              </button>
            </div>

            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
            >
              Mark All Read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="py-24 text-center text-xs text-slate-400">Loading notifications...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-sm">You are all caught up!</h3>
            <p className="text-xs text-slate-400">No unread notifications at this time.</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMarkRead(item.id)}
                className={`p-5 flex items-start justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors ${
                  !item.isRead ? "bg-indigo-50/30 dark:bg-indigo-950/15" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      item.type === "HIGH_SCORE"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : item.type === "FOLLOW_UP"
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-indigo-500/10 text-indigo-600"
                    }`}
                  >
                    {item.type === "HIGH_SCORE" ? (
                      <Flame className="w-5 h-5" />
                    ) : item.type === "FOLLOW_UP" ? (
                      <Calendar className="w-5 h-5" />
                    ) : (
                      <Bell className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                </div>

                {item.link && (
                  <Link
                    href={item.link}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                    title="View related lead"
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

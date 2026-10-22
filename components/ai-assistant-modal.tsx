"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  Sparkles,
  X,
  Square,
  Loader2,
  PhoneCall,
  ExternalLink,
  Calendar,
  User,
  ArrowRight,
} from "lucide-react";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: "assistant" | "user";
  content: string;
}

const SUGGESTED_CHIPS = [
  "Which leads should I call today?",
  "Show overdue follow-ups",
  "Which source gives the best leads?",
  "What is my conversion rate this month?",
  "How do I import leads?",
];

export function AiAssistantModal({ isOpen, onClose }: AiAssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hello! I am your **LeadTrack AI Counselor Copilot**. I can check your pipeline, identify today's calls, analyze drop-offs, and guide you through app workflows. What would you like to explore?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
    }
  };

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    const userMsg = text.trim();
    const updatedHistory = [...messages.slice(-9), { role: "user" as const, content: userMsg }];
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    if (!queryText) setInput("");
    setLoading(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMsg,
          history: updatedHistory,
          stream: true,
        }),
        signal: abortController.signal,
      });

      if (!res.ok) {
        throw new Error("API failed");
      }

      if (res.body) {
        // Stream reading
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantReply = "";

        // Push initial assistant slot
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assistantReply += chunk;

          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: "assistant", content: assistantReply };
            return copy;
          });
        }
      } else {
        const json = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: json.data?.response || "I could not analyze that request." },
        ]);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I encountered a network issue answering that query. Please try again.",
          },
        ]);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Render markdown-like links and bolding safely
  const renderMessageContent = (text: string) => {
    // Replace markdown links [Label](url) with interactive Next.js links or anchor tags
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const label = match[1];
      const url = match[2];
      parts.push(
        <Link
          key={match.index}
          href={url}
          onClick={onClose}
          className="text-indigo-600 dark:text-indigo-400 font-semibold underline underline-offset-2 hover:text-indigo-700"
        >
          {label}
        </Link>
      );
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return (
      <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
        {parts.map((p, idx) =>
          typeof p === "string" ? (
            <span key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(p) }} />
          ) : (
            p
          )
        )}
      </div>
    );
  };

  const formatInlineMarkdown = (str: string) => {
    return str
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code class='bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-[11px]'>$1</code>");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end bg-black/40 backdrop-blur-xs animate-in fade-in">
      {/* Mobile: Full-screen bottom sheet (rounded-t-3xl, h-[92vh]), Desktop: Right sidebar (max-w-lg, h-full) */}
      <div className="w-full sm:max-w-lg bg-white dark:bg-slate-900 h-[92vh] sm:h-full rounded-t-3xl sm:rounded-none shadow-2xl flex flex-col border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom sm:slide-in-from-right duration-300 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-slate-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Counselor Copilot</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  Live DB
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Grounded in your active admissions pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Question Chips */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {SUGGESTED_CHIPS.map((chip) => (
            <button
              key={chip}
              disabled={loading}
              onClick={() => handleSend(chip)}
              className="text-[11px] px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all whitespace-nowrap shrink-0 shadow-2xs font-medium disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-xs ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-xs"
                    : "bg-slate-100/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/50 dark:border-slate-700/50"
                }`}
              >
                {renderMessageContent(msg.content)}

                {/* Quick Action Chips when assistant provides actionable links */}
                {msg.role === "assistant" && (
                  <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-wrap gap-2 text-[11px]">
                    <Link
                      href="/follow-ups"
                      onClick={onClose}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 font-medium"
                    >
                      <PhoneCall className="w-3 h-3 text-indigo-500" />
                      <span>Today&apos;s Calls</span>
                    </Link>
                    <Link
                      href="/leads"
                      onClick={onClose}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 font-medium"
                    >
                      <User className="w-3 h-3 text-emerald-500" />
                      <span>All Leads</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Copilot is analyzing live database...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input & Stop Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 space-y-2">
          {loading && (
            <div className="flex justify-center">
              <button
                onClick={handleStop}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-rose-600 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Stop Generating</span>
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot about leads, calls, or app features..."
              className="flex-1 p-3 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 transition-all disabled:opacity-40 shrink-0"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

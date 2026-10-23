"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  Sparkles,
  X,
  Square,
  Loader2,
  PhoneCall,
  User,
  Compass,
  GraduationCap,
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
  "Which source yields the highest conversion?",
  "Analyze current admissions intake",
  "How do I import lead batches?",
];

export function AiAssistantModal({ isOpen, onClose }: AiAssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Greetings. I am your **Admissions Advisory Copilot**. I query the active database to review counselor queues, diagnose drop-offs, and recommend priority outreach. How may I assist your team today?",
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
            content: "A network exception occurred while querying the intelligence engine. Please retry.",
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
          className="text-[#0F3D33] dark:text-[#4FB89A] font-semibold underline underline-offset-2 hover:opacity-80"
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
      .replace(/\*\*([^*]+)\*\*/g, "<strong class='font-semibold'>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code class='bg-[#FAF7F0] dark:bg-[#1E2622] px-1 py-0.5 rounded font-mono text-[11px] border border-[#E4DDD0] dark:border-[#26302B]'>$1</code>");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end bg-black/40 backdrop-blur-2xs animate-in fade-in">
      {/* Side panel styled as an academic notebook docket */}
      <div className="w-full sm:max-w-md md:max-w-lg bg-[#FAF7F0] dark:bg-[#0F1412] h-[92vh] sm:h-full rounded-t-2xl sm:rounded-none shadow-2xl flex flex-col border-t sm:border-t-0 sm:border-l border-[#E4DDD0] dark:border-[#26302B] animate-in slide-in-from-bottom sm:slide-in-from-right duration-300 overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E4DDD0] dark:border-[#26302B] bg-white dark:bg-[#171D1A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0F3D33] dark:bg-[#4FB89A] flex items-center justify-center text-[#F6F2EA] dark:text-[#0F1412] shadow-2xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm text-[#1B1A17] dark:text-[#ECE8DF]">Admissions Copilot</h3>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase bg-[#0F3D33]/10 dark:bg-[#4FB89A]/15 text-[#0F3D33] dark:text-[#4FB89A] border border-[#0F3D33]/25 dark:border-[#4FB89A]/30 font-medium">
                  Live DB
                </span>
              </div>
              <p className="text-[11px] text-[#6B665C] dark:text-[#959187] font-sans">
                Synchronized with institutional recruitment pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 rounded-lg text-[#6B665C] hover:text-[#1B1A17] dark:text-[#959187] dark:hover:text-[#ECE8DF] hover:bg-[#FAF7F0] dark:hover:bg-[#1E2622] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Question Chips */}
        <div className="p-2.5 border-b border-[#E4DDD0] dark:border-[#26302B] bg-white/70 dark:bg-[#131916] flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {SUGGESTED_CHIPS.map((chip) => (
            <button
              key={chip}
              disabled={loading}
              onClick={() => handleSend(chip)}
              className="text-[11px] min-h-[34px] px-3 py-1 rounded-lg bg-[#FAF7F0] dark:bg-[#171D1A] border border-[#E4DDD0] dark:border-[#26302B] text-[#1B1A17] dark:text-[#ECE8DF] hover:border-[#0F3D33] dark:hover:border-[#4FB89A] hover:text-[#0F3D33] dark:hover:text-[#4FB89A] transition-colors whitespace-nowrap shrink-0 font-medium disabled:opacity-50 inline-flex items-center"
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
                <div className="w-6 h-6 rounded-md bg-[#FAF7F0] dark:bg-[#171D1A] border border-[#E4DDD0] dark:border-[#26302B] text-[#0F3D33] dark:text-[#4FB89A] flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 shadow-xs ${
                  msg.role === "user"
                    ? "bg-[#0F3D33] dark:bg-[#4FB89A] text-[#F6F2EA] dark:text-[#0F1412] font-medium"
                    : "bg-white dark:bg-[#171D1A] text-[#1B1A17] dark:text-[#ECE8DF] border border-[#E4DDD0] dark:border-[#26302B]"
                }`}
              >
                {renderMessageContent(msg.content)}

                {/* Quick Action Chips when assistant provides actionable links */}
                {msg.role === "assistant" && (
                  <div className="mt-3 pt-2 border-t border-[#E4DDD0]/60 dark:border-[#26302B] flex flex-wrap gap-2 text-[11px]">
                    <Link
                      href="/follow-ups"
                      onClick={onClose}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF7F0] dark:bg-[#0F1412] border border-[#E4DDD0] dark:border-[#26302B] text-[#1B1A17] dark:text-[#ECE8DF] hover:text-[#0F3D33] dark:hover:text-[#4FB89A] font-medium transition-colors"
                    >
                      <PhoneCall className="w-3 h-3 text-[#E0A030]" />
                      <span>Today&apos;s Calls</span>
                    </Link>
                    <Link
                      href="/leads"
                      onClick={onClose}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF7F0] dark:bg-[#0F1412] border border-[#E4DDD0] dark:border-[#26302B] text-[#1B1A17] dark:text-[#ECE8DF] hover:text-[#0F3D33] dark:hover:text-[#4FB89A] font-medium transition-colors"
                    >
                      <User className="w-3 h-3 text-[#0F3D33] dark:text-[#4FB89A]" />
                      <span>Admissions Queue</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 justify-start items-center">
              <div className="w-6 h-6 rounded-md bg-[#FAF7F0] dark:bg-[#171D1A] border border-[#E4DDD0] dark:border-[#26302B] text-[#0F3D33] dark:text-[#4FB89A] flex items-center justify-center shrink-0">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#171D1A] border border-[#E4DDD0] dark:border-[#26302B] flex items-center gap-2 text-xs text-[#6B665C] dark:text-[#959187]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0F3D33] dark:text-[#4FB89A]" />
                <span className="font-mono text-[11px]">Consulting repository indices...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input & Stop Button */}
        <div className="p-3.5 border-t border-[#E4DDD0] dark:border-[#26302B] bg-white dark:bg-[#171D1A] shrink-0 space-y-2">
          {loading && (
            <div className="flex justify-center">
              <button
                onClick={handleStop}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FAF7F0] dark:bg-[#1E2622] hover:bg-[#C4552F]/10 text-[#C4552F] text-xs font-mono border border-[#E4DDD0] dark:border-[#26302B] transition-colors"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Halt Generation</span>
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
              placeholder="Inquire regarding cohort yield, candidate logs, or app SOP..."
              className="flex-1 min-h-[42px] px-3.5 py-2 text-xs sm:text-sm rounded-lg bg-[#FAF7F0] dark:bg-[#0F1412] border border-[#E4DDD0] dark:border-[#26302B] text-[#1B1A17] dark:text-[#ECE8DF] placeholder-[#6B665C]/60 dark:placeholder-[#959187]/60 focus:border-[#0F3D33] dark:focus:border-[#4FB89A] outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="min-h-[42px] min-w-[42px] flex items-center justify-center p-2.5 rounded-lg bg-[#0F3D33] hover:bg-[#165447] dark:bg-[#4FB89A] dark:hover:bg-[#3ea688] text-[#F6F2EA] dark:text-[#0F1412] shadow-xs transition-colors disabled:opacity-40 shrink-0"
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

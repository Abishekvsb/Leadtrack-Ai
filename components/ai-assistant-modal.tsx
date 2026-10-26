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
  Bot,
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
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantReply = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.replace("data: ", "").trim();
              if (data === "[DONE]") {
                break;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  assistantReply += parsed.text;
                  setMessages((prev) => {
                    const copy = [...prev];
                    copy[copy.length - 1] = {
                      role: "assistant",
                      content: assistantReply,
                    };
                    return copy;
                  });
                }
              } catch {
                // partial chunk
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Apologies, I encountered a temporary operational exception. Please retry.",
          },
        ]);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

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
          className="text-[#D62828] dark:text-[#FF5A5F] font-bold underline underline-offset-2 hover:opacity-85"
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
      .replace(/\*\*([^*]+)\*\*/g, "<strong class='font-bold text-foreground'>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code class='bg-[#F8F2E6] dark:bg-[#1B1114] px-1 py-0.5 rounded-[4px] font-mono text-[11px] border border-border text-[#8A5A00] dark:text-[#FFD25A]'>$1</code>");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end bg-black/50 backdrop-blur-xs animate-in fade-in">
      {/* Side panel styled as a royal crimson & gold advisory docket */}
      <div className="w-full sm:max-w-md md:max-w-lg bg-[#FFF9EE] dark:bg-[#120A0C] h-[92vh] sm:h-full rounded-t-[20px] sm:rounded-none shadow-2xl flex flex-col border-t sm:border-t-0 sm:border-l border-border animate-in slide-in-from-bottom sm:slide-in-from-right duration-300 overflow-hidden font-sans">
        {/* Header with Radiant Gold Orb */}
        <div className="flex items-center justify-between p-4 border-b border-[#F0E6D6] dark:border-[#2E1D21] bg-white dark:bg-[#1B1114] shrink-0">
          <div className="flex items-center gap-3">
            {/* Radiant Gold Orb */}
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#FFC21A] to-[#E5A100] flex items-center justify-center text-[#17141A] shadow-md border border-[#FFD25A] shrink-0 animate-gold-pulse">
              <Sparkles className="w-4 h-4 text-[#17141A]" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#16A34A] ring-2 ring-card" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-foreground">Admissions Copilot</h3>
                <span className="text-[9px] px-1.5 py-0.5 rounded-[4px] font-mono uppercase bg-[#FFC21A]/15 text-[#8A5A00] dark:text-[#FFD25A] border border-[#FFC21A]/35 font-bold">
                  Live DB
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-sans">
                Synchronized with institutional recruitment pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 rounded-[8px] text-muted-foreground hover:text-foreground hover:bg-[#F8F2E6] dark:hover:bg-[#25171B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Question Chips */}
        <div className="p-2.5 border-b border-[#F0E6D6] dark:border-[#2E1D21] bg-white/70 dark:bg-[#1B1114]/70 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {SUGGESTED_CHIPS.map((chip) => (
            <button
              key={chip}
              disabled={loading}
              onClick={() => handleSend(chip)}
              className="text-[11px] min-h-[32px] px-3 py-1 rounded-[8px] bg-surface border border-border text-foreground hover:border-[#FFC21A] hover:text-[#D62828] dark:hover:text-[#FF5A5F] transition-colors whitespace-nowrap shrink-0 font-medium disabled:opacity-50 inline-flex items-center shadow-xs"
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
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FFC21A] to-[#E5A100] text-[#17141A] flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-[#FFD25A]">
                  <GraduationCap className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-[14px] p-3.5 shadow-xs ${
                  msg.role === "user"
                    ? "btn-crimson-gradient text-white font-medium rounded-br-[2px]"
                    : "bg-white dark:bg-[#1B1114] text-foreground border border-[#F0E6D6] dark:border-[#2E1D21] rounded-bl-[2px]"
                }`}
              >
                {renderMessageContent(msg.content)}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs py-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#FFC21A]" />
              <span className="font-heading italic">Copilot querying admissions database...</span>
              <button
                onClick={handleStop}
                className="ml-auto inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-[6px] border border-border text-muted-foreground hover:text-foreground"
              >
                <Square className="w-3 h-3 text-[#D62828]" />
                <span>Stop</span>
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Query Input Bar */}
        <div className="p-3 border-t border-border bg-card shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Copilot regarding callbacks, intake, drop-offs..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-[10px] bg-background/50 border border-border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-[#FFC21A] dark:focus:border-[#FFD25A] focus:ring-1 focus:ring-[#FFC21A]/35 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="btn-crimson-gradient btn-shimmer p-2.5 sm:px-4 rounded-[10px] text-white disabled:opacity-40 transition-all shadow-xs flex items-center justify-center shrink-0"
              title="Send prompt"
            >
              <Send className="w-4 h-4 text-[#FFC21A]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  createdAt: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = "info", title?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      const createdAt = Date.now();
      setToasts((prev) => [...prev, { id, type, message, title, createdAt }]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const contextValue: ToastContextType = {
    toast: addToast,
    success: (msg, title) => addToast(msg, "success", title),
    error: (msg, title) => addToast(msg, "error", title),
    info: (msg, title) => addToast(msg, "info", title),
    warning: (msg, title) => addToast(msg, "warning", title),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          let borderColor = "border-border";
          let progressBg = "bg-muted-foreground";
          let icon = <Info className="w-4 h-4 text-[#64748B] shrink-0 stroke-[1.5]" />;

          if (t.type === "success") {
            borderColor = "border-[#16A34A]/40";
            progressBg = "bg-[#16A34A]";
            icon = <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 stroke-[1.5]" />;
          } else if (t.type === "error") {
            borderColor = "border-[#D62828]/40";
            progressBg = "bg-[#D62828]";
            icon = <AlertCircle className="w-4 h-4 text-[#D62828] dark:text-[#FF5A5F] shrink-0 stroke-[1.5]" />;
          } else if (t.type === "warning") {
            borderColor = "border-[#FFC21A]/50";
            progressBg = "bg-[#FFC21A]";
            icon = <AlertTriangle className="w-4 h-4 text-[#8A5A00] dark:text-[#FFD25A] shrink-0 stroke-[1.5]" />;
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 p-4 rounded-[14px] glass-surface border text-card-foreground shadow-floating transition-all animate-fade-up ${borderColor}`}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 text-xs">
                {t.title && <p className="font-heading font-bold text-foreground">{t.title}</p>}
                <p className="text-muted-foreground leading-relaxed mt-0.5">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-[6px]"
              >
                <X className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/40">
                <div
                  className={`h-full ${progressBg} animate-[shimmer-sweep_4.5s_linear_forwards]`}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toast: (msg: string) => console.log("Toast:", msg),
      success: (msg: string) => console.log("Success:", msg),
      error: (msg: string) => console.error("Error:", msg),
      info: (msg: string) => console.log("Info:", msg),
      warning: (msg: string) => console.warn("Warning:", msg),
    };
  }
  return context;
};

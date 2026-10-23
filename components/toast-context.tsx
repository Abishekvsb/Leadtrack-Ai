"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
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
      setToasts((prev) => [...prev, { id, type, message, title }]);

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
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          let borderColor = "border-border";
          let icon = <Info className="w-4 h-4 text-[#5B7083] shrink-0 stroke-[1.5]" />;

          if (t.type === "success") {
            borderColor = "border-[#0F3D33]/40 dark:border-[#4FB89A]/40";
            icon = <CheckCircle2 className="w-4 h-4 text-[#0F3D33] dark:text-[#4FB89A] shrink-0 stroke-[1.5]" />;
          } else if (t.type === "error") {
            borderColor = "border-[#C4552F]/40";
            icon = <AlertCircle className="w-4 h-4 text-[#C4552F] shrink-0 stroke-[1.5]" />;
          } else if (t.type === "warning") {
            borderColor = "border-[#E0A030]/40";
            icon = <AlertTriangle className="w-4 h-4 text-[#E0A030] shrink-0 stroke-[1.5]" />;
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-[10px] shadow-academic-floating border bg-card text-card-foreground transition-all animate-fade-up ${borderColor}`}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 text-xs">
                {t.title && <p className="font-medium text-foreground">{t.title}</p>}
                <p className="text-muted-foreground leading-relaxed">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-[4px]"
              >
                <X className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
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

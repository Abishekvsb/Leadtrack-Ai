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
          let bg = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100";
          let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;

          if (t.type === "success") {
            bg = "bg-white dark:bg-slate-900 border-emerald-500/30 text-slate-900 dark:text-slate-100";
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
          } else if (t.type === "error") {
            bg = "bg-white dark:bg-slate-900 border-rose-500/30 text-slate-900 dark:text-slate-100";
            icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
          } else if (t.type === "warning") {
            bg = "bg-white dark:bg-slate-900 border-amber-500/30 text-slate-900 dark:text-slate-100";
            icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${bg}`}
            >
              {icon}
              <div className="flex-1 text-sm">
                {t.title && <p className="font-semibold">{t.title}</p>}
                <p className="text-slate-600 dark:text-slate-300">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
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

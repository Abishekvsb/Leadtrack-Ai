"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-up">
      <div className="w-full max-w-md bg-card rounded-[14px] p-6 shadow-floating border border-border">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0 border ${
              isDestructive
                ? "bg-[#D62828]/10 text-[#D62828] dark:text-[#FF5A5F] border-[#D62828]/25"
                : "bg-[#FFC21A]/15 text-[#8A5A00] dark:text-[#FFD25A] border-[#FFC21A]/35"
            }`}
          >
            <AlertTriangle className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-base text-foreground tracking-tight">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 text-xs font-semibold rounded-[10px] border border-border hover:bg-muted text-foreground transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-bold rounded-[10px] transition-colors shadow-xs ${
              isDestructive
                ? "bg-[#D62828] hover:bg-[#B81E1E] text-white"
                : "bg-[#FFC21A] hover:bg-[#E5A100] text-[#17141A]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-up">
      <div className="w-full max-w-md bg-card rounded-[12px] p-6 shadow-academic-floating border border-border">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0 border ${
              isDestructive
                ? "bg-[#C4552F]/10 text-[#C4552F] border-[#C4552F]/20"
                : "bg-[#0F3D33]/10 dark:bg-[#4FB89A]/15 text-[#0F3D33] dark:text-[#4FB89A] border-[#0F3D33]/20 dark:border-[#4FB89A]/30"
            }`}
          >
            <AlertTriangle className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-base font-normal text-foreground tracking-tight">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 text-xs font-medium rounded-[8px] border border-border hover:bg-muted/70 text-foreground transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-medium rounded-[8px] transition-colors ${
              isDestructive
                ? "bg-[#C4552F] hover:bg-[#B04724] text-white"
                : "bg-[#0F3D33] dark:bg-[#4FB89A] hover:bg-[#165447] dark:hover:bg-[#63C7AA] text-[#F6F2EA] dark:text-[#0F1412]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}


"use client";

import React, { createContext, useContext, forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Sparkles } from "lucide-react";

/* =========================================================================
   BUTTON COMPONENT
   Royal Crimson & Gold:
   Primary = Crimson gradient with inner highlight, gold shimmer sweep,
   magnetic hover, press scale 0.97, loading state with gold spinner.
   Radius 10px.
========================================================================= */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent" | "destructive" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-[10px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.97]";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 sm:h-10 px-4 text-xs sm:text-sm gap-2",
      lg: "h-11 sm:h-12 px-6 text-sm sm:text-base gap-2.5",
      icon: "h-9 w-9 p-0 shrink-0",
    };

    const variantStyles = {
      primary: "btn-crimson-gradient btn-shimmer font-semibold shadow-xs",
      secondary:
        "bg-[#F8F2E6] dark:bg-[#1B1114] text-[#17141A] dark:text-[#F7EFE6] hover:bg-[#F0E6D6] dark:hover:bg-[#2E1D21] border border-border",
      outline:
        "bg-transparent text-[#17141A] dark:text-[#F7EFE6] hover:bg-[#FFF9EE] dark:hover:bg-[#1B1114] border border-border hover:border-accent",
      ghost:
        "bg-transparent text-[#17141A] dark:text-[#F7EFE6] hover:bg-[#FFF9EE] dark:hover:bg-[#1B1114]",
      accent:
        "bg-[#FFC21A] text-[#17141A] hover:bg-[#E5A100] border border-[#FFC21A] font-bold shadow-xs",
      destructive:
        "bg-[#D62828] text-white hover:bg-[#B81E1E] border border-[#D62828] shadow-xs",
      link:
        "bg-transparent text-[#D62828] dark:text-[#FF5A5F] underline-offset-4 hover:underline p-0 h-auto font-medium",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-[#FFC21A]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

/* =========================================================================
   CARD COMPONENTS
   Radius 14px, white card surface, warm hairline border,
   hover top crimson-to-gold gradient hairline, subtle crimson shadow.
========================================================================= */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "royal-card",
        interactive && "royal-card-interactive cursor-pointer",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 sm:p-6 border-b border-border/70", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 sm:p-6", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4 sm:p-6 pt-0 border-t border-border/70 flex items-center", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

/* =========================================================================
   INPUT & TEXTAREA & SELECT
   Radius 10px, 1px warm border, Radiant Gold focus ring
========================================================================= */

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-[10px] border border-border bg-surface px-3.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[84px] w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-[10px] border border-border bg-surface px-3.5 py-2 text-xs sm:text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

/* =========================================================================
   BADGE COMPONENT
   Royal Crimson & Gold semantic badges:
   Hot = Crimson, Warm = Gold (deep gold text #8A5A00 for WCAG AA),
   Cold = Slate #64748B, Success = #16A34A
========================================================================= */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "hot" | "warm" | "cold" | "crimson" | "gold" | "success" | "neutral" | "outline";
  dot?: boolean;
}

export function Badge({ className, variant = "default", dot, children, ...props }: BadgeProps) {
  const variantStyles = {
    default:
      "bg-[#F8F2E6] dark:bg-[#27191E] text-[#17141A] dark:text-[#F7EFE6] border-border",
    hot:
      "bg-[#D62828]/10 dark:bg-[#FF5A5F]/15 text-[#D62828] dark:text-[#FF5A5F] border-[#D62828]/30 font-bold",
    warm:
      "bg-[#FFC21A]/15 dark:bg-[#FFD25A]/20 text-[#8A5A00] dark:text-[#FFD25A] border-[#FFC21A]/35 font-bold",
    cold:
      "bg-[#64748B]/10 dark:bg-[#64748B]/15 text-[#64748B] dark:text-[#94A3B8] border-[#64748B]/30",
    crimson:
      "bg-[#D62828] text-white border-[#D62828] font-bold shadow-xs",
    gold:
      "bg-[#FFC21A] text-[#17141A] border-[#FFC21A] font-bold shadow-xs",
    success:
      "bg-[#16A34A]/10 dark:bg-[#16A34A]/15 text-[#16A34A] dark:text-[#4ADE80] border-[#16A34A]/30 font-semibold",
    neutral:
      "bg-surface text-muted-foreground border-border tabular-nums",
    outline:
      "bg-transparent text-foreground border-border",
  };

  const dotColors = {
    default: "bg-muted-foreground",
    hot: "bg-[#D62828] dark:bg-[#FF5A5F]",
    warm: "bg-[#FFC21A]",
    cold: "bg-[#64748B]",
    crimson: "bg-white",
    gold: "bg-[#17141A]",
    success: "bg-[#16A34A]",
    neutral: "bg-muted-foreground",
    outline: "bg-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] text-[11px] font-medium border uppercase tracking-wider select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />}
      {children}
    </span>
  );
}

/* =========================================================================
   TABLE COMPONENTS
   Airy rows, hairline 1px separators, sticky header, small caps tracked labels
========================================================================= */

export const Table = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-xs sm:text-sm", className)} {...props} />
    </div>
  )
);
Table.displayName = "Table";

export const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("border-b border-border bg-[#FFF9EE]/90 dark:bg-[#1B1114]/90 sticky top-0 z-10", className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("divide-y divide-border/60", className)} {...props} />
  )
);
TableBody.displayName = "TableBody";

export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "transition-colors hover:bg-[#FFF9EE]/70 dark:hover:bg-[#27191E]/60 data-[state=selected]:bg-[#F8F2E6]",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

export const TableHead = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-10 px-4 text-left align-middle text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap",
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

export const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("p-4 align-middle text-foreground tabular-nums", className)}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

/* =========================================================================
   TABS COMPONENT
   Tabs with Gold Underline and Crimson Active indicator
========================================================================= */

interface TabsContextType {
  activeTab: string;
  setActiveTab: (val: string) => void;
}
const TabsContext = createContext<TabsContextType | null>(null);

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [internalTab, setInternalTab] = useState(defaultValue || "");
  const currentTab = value !== undefined ? value : internalTab;

  const handleTabChange = (val: string) => {
    if (value === undefined) setInternalTab(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ activeTab: currentTab, setActiveTab: handleTabChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 border-b border-border pb-px overflow-x-auto no-scrollbar",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  const isActive = ctx?.activeTab === value;

  return (
    <button
      type="button"
      onClick={() => ctx?.setActiveTab(value)}
      className={cn(
        "px-4 py-2.5 text-xs sm:text-sm font-medium transition-all relative border-b-2 whitespace-nowrap select-none",
        isActive
          ? "border-[#FFC21A] text-[#D62828] dark:text-[#FF5A5F] font-bold"
          : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (ctx?.activeTab !== value) return null;
  return <div className={cn("mt-4 animate-fade-up", className)}>{children}</div>;
}

/* =========================================================================
   SCORE DIAL / RING
   Animated semicircle dial sweeping to the value with
   crimson-to-gold gradient stroke, and pulse when Hot.
========================================================================= */

export function ScoreDial({
  score,
  size = 96,
  strokeWidth = 7,
  label = "AI Score",
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const arcLength = Math.PI * radius;
  const normalizedScore = Math.max(0, Math.min(100, score || 0));
  const offset = arcLength - (normalizedScore / 100) * arcLength;

  const isHot = normalizedScore >= 70;
  const isWarm = normalizedScore >= 40 && !isHot;

  const category = isHot ? "Hot" : isWarm ? "Warm" : "Cold";
  const categoryColor = isHot ? "#D62828" : isWarm ? "#FFC21A" : "#64748B";

  const gradientId = `score-dial-grad-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="flex flex-col items-center text-center">
      <div className={cn("relative", isHot && "animate-gold-pulse rounded-full")} style={{ width: size, height: size / 2 + 10 }}>
        <svg width={size} height={size / 2 + 10} className="overflow-visible">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D62828" />
              <stop offset="50%" stopColor="#FFC21A" />
              <stop offset="100%" stopColor="#FFE08A" />
            </linearGradient>
          </defs>
          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-border"
          />
          {/* Value arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center">
          <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {score}
          </span>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: categoryColor }} />
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {category} • {label}
        </span>
      </div>
    </div>
  );
}

/* =========================================================================
   EMPTY STATE COMPONENT
   Custom line illustrations in crimson & gold
========================================================================= */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border rounded-[14px] bg-card/60",
        className
      )}
    >
      <div className="w-12 h-12 rounded-[10px] bg-[#D62828]/10 dark:bg-[#FF5A5F]/15 border border-[#D62828]/20 dark:border-[#FF5A5F]/30 flex items-center justify-center text-[#D62828] dark:text-[#FF5A5F] mb-3 shadow-xs">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h4 className="font-heading text-lg font-bold text-foreground tracking-tight">{title}</h4>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mt-1.5 leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* =========================================================================
   SKELETON COMPONENT
   Shimmer loader with gold/warm-paper tint
========================================================================= */

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-[10px] bg-muted/80", className)}
      {...props}
    />
  );
}

/* =========================================================================
   DOSSIER LEAD SCORE STAMP
========================================================================= */

export function LeadScoreStamp({
  score,
  category = "WARM",
  className,
}: {
  score: number;
  category?: "HOT" | "WARM" | "COLD" | string;
  className?: string;
}) {
  const isHot = category === "HOT" || score >= 80;
  const isWarm = category === "WARM" || (score >= 50 && score < 80);

  const stampColor = isHot
    ? "border-[#D62828] text-[#D62828] bg-[#D62828]/5"
    : isWarm
    ? "border-[#FFC21A] text-[#8A5A00] dark:text-[#FFD25A] bg-[#FFC21A]/5"
    : "border-[#64748B] text-[#64748B] dark:text-[#94A3B8] bg-[#64748B]/5";

  return (
    <div
      className={cn(
        "relative inline-flex flex-col items-center justify-center p-3 rounded-full border-2 border-dashed aspect-square w-28 h-28 select-none rotate-[-4deg] transition-transform hover:rotate-0",
        stampColor,
        className
      )}
    >
      <div className="absolute inset-1 rounded-full border border-current pointer-events-none" />
      <span className="text-[9px] uppercase tracking-widest font-heading font-bold opacity-80">
        ROYAL • VERITAS
      </span>
      <span className="font-heading text-3xl font-extrabold tracking-tight leading-none my-0.5 tabular-nums">
        {score}
      </span>
      <span className="text-[10px] uppercase font-heading font-bold tracking-widest">
        {category}
      </span>
    </div>
  );
}

/* =========================================================================
   SIGNATURE ANNOUNCEMENT TICKER (MARQUEE)
   Top announcement marquee in crimson with gold bullet separators.
   Displays live info, pauses on hover.
========================================================================= */

export function AnnouncementTicker({
  items,
  className,
}: {
  items?: Array<{ label: string; value: string | number; link?: string }>;
  className?: string;
}) {
  const defaultItems = [
    { label: "Active Admissions Cycle", value: "2026/27" },
    { label: "UN SDG 4", value: "Quality Higher Education" },
    { label: "AI Copilot", value: "Online" },
  ];

  const displayItems = items && items.length > 0 ? items : defaultItems;

  return (
    <div
      className={cn(
        "w-full bg-[#D62828] text-white overflow-hidden py-1.5 px-4 select-none border-b border-[#B81E1E] marquee-container relative z-30",
        className
      )}
    >
      <div className="flex items-center whitespace-nowrap marquee-content animate-marquee-scroll">
        {[...displayItems, ...displayItems, ...displayItems].map((item, idx) => (
          <span key={idx} className="inline-flex items-center gap-2 mx-4 text-xs font-medium tracking-tight">
            <span className="text-[#FFC21A] text-sm">✦</span>
            <span className="text-white/80 uppercase tracking-wider text-[10px] font-bold">
              {item.label}:
            </span>
            <span className="text-white font-bold font-mono">
              {item.value}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

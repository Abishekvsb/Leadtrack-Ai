"use client";

import React, { createContext, useContext, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/* =========================================================================
   BUTTON COMPONENT
   Radius 8px, flat colors, no neon glow, no gradient, 1px hairline border
========================================================================= */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent" | "destructive" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-[8px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.99]";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 sm:h-10 px-4 text-xs sm:text-sm gap-2",
      lg: "h-11 sm:h-12 px-6 text-sm sm:text-base gap-2.5",
      icon: "h-9 w-9 p-0 shrink-0",
    };

    const variantStyles = {
      primary:
        "bg-[#0F3D33] dark:bg-[#4FB89A] text-[#F6F2EA] dark:text-[#0F1412] hover:bg-[#165447] dark:hover:bg-[#63C7AA] border border-[#0F3D33] dark:border-[#4FB89A] shadow-xs",
      secondary:
        "bg-[#EDE6DA] dark:bg-[#1F2723] text-[#1B1A17] dark:text-[#ECE8DF] hover:bg-[#E4DDD0] dark:hover:bg-[#26302B] border border-[#E4DDD0] dark:border-[#26302B]",
      outline:
        "bg-transparent text-[#1B1A17] dark:text-[#ECE8DF] hover:bg-[#EDE6DA]/60 dark:hover:bg-[#1F2723] border border-[#E4DDD0] dark:border-[#26302B]",
      ghost:
        "bg-transparent text-[#1B1A17] dark:text-[#ECE8DF] hover:bg-[#EDE6DA]/50 dark:hover:bg-[#1F2723]/60",
      accent:
        "bg-[#E0A030] text-[#1B1A17] hover:bg-[#C98B22] border border-[#E0A030] font-semibold shadow-xs",
      destructive:
        "bg-[#C4552F] text-white hover:bg-[#A94322] border border-[#C4552F] shadow-xs",
      link:
        "bg-transparent text-[#0F3D33] dark:text-[#4FB89A] underline-offset-4 hover:underline p-0 h-auto",
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
            className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current"
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
   Radius 10-12px, flat surface, 1px warm hairline border, no glassmorphism
========================================================================= */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-card text-card-foreground border border-border rounded-[12px]",
        interactive && "editorial-card-interactive cursor-pointer",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 sm:p-6 border-b border-border/60", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-serif text-lg sm:text-xl font-normal tracking-tight text-foreground", className)}
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
    <div ref={ref} className={cn("p-4 sm:p-6 pt-0 border-t border-border/60 flex items-center", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

/* =========================================================================
   INPUT & TEXTAREA & SELECT
   Radius 8px, 1px warm border, Saffron focus ring
========================================================================= */

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-[8px] border border-border bg-surface px-3.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
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
        "flex min-h-[80px] w-full rounded-[8px] border border-border bg-surface px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
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
        "flex h-10 w-full rounded-[8px] border border-border bg-surface px-3.5 py-2 text-xs sm:text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
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
   Warm academic editorial semantic labels: Hot = Terracotta, Warm = Saffron, Cold = Slate Blue
========================================================================= */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "hot" | "warm" | "cold" | "forest" | "neutral" | "outline";
  dot?: boolean;
}

export function Badge({ className, variant = "default", dot, children, ...props }: BadgeProps) {
  const variantStyles = {
    default:
      "bg-[#EDE6DA] dark:bg-[#1F2723] text-[#1B1A17] dark:text-[#ECE8DF] border-[#E4DDD0] dark:border-[#26302B]",
    hot:
      "bg-[#C4552F]/10 dark:bg-[#C4552F]/15 text-[#C4552F] dark:text-[#E27653] border-[#C4552F]/30",
    warm:
      "bg-[#E0A030]/10 dark:bg-[#E0A030]/15 text-[#9E6C16] dark:text-[#E0A030] border-[#E0A030]/30",
    cold:
      "bg-[#5B7083]/10 dark:bg-[#5B7083]/15 text-[#5B7083] dark:text-[#8AA2B6] border-[#5B7083]/30",
    forest:
      "bg-[#0F3D33]/10 dark:bg-[#4FB89A]/15 text-[#0F3D33] dark:text-[#4FB89A] border-[#0F3D33]/25 dark:border-[#4FB89A]/30",
    neutral:
      "bg-surface text-muted-foreground border-border tabular-nums",
    outline:
      "bg-transparent text-foreground border-border",
  };

  const dotColors = {
    default: "bg-muted-foreground",
    hot: "bg-[#C4552F]",
    warm: "bg-[#E0A030]",
    cold: "bg-[#5B7083]",
    forest: "bg-[#0F3D33] dark:bg-[#4FB89A]",
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
    <thead ref={ref} className={cn("border-b border-border bg-[#F6F2EA]/80 dark:bg-[#171D1A]/80 sticky top-0 z-10", className)} {...props} />
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
        "transition-colors hover:bg-[#EDE6DA]/40 dark:hover:bg-[#1F2723]/50 data-[state=selected]:bg-[#EDE6DA]/60",
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
        "h-10 px-4 text-left align-middle text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap",
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
   Academic ruled tabs
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
  const [internalTab, setInternalTab] = React.useState(defaultValue || "");
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
          ? "border-[#0F3D33] dark:border-[#4FB89A] text-[#0F3D33] dark:text-[#4FB89A] font-semibold"
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
   Terracotta / Saffron / Slate Blue with mono figures
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

  let color = "#5B7083"; // Cold: Slate Blue
  let category = "Cold";
  if (normalizedScore >= 70) {
    color = "#C4552F"; // Hot: Terracotta
    category = "Hot";
  } else if (normalizedScore >= 40) {
    color = "#E0A030"; // Warm: Saffron
    category = "Warm";
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative" style={{ width: size, height: size / 2 + 10 }}>
        <svg width={size} height={size / 2 + 10} className="overflow-visible">
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
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center">
          <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {score}
          </span>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {category} • {label}
        </span>
      </div>
    </div>
  );
}

/* =========================================================================
   EMPTY STATE COMPONENT
   Clean line illustrations in brand colors (no stock emoji)
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
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border rounded-[12px] bg-card/50",
        className
      )}
    >
      <div className="w-12 h-12 rounded-[10px] bg-[#0F3D33]/10 dark:bg-[#4FB89A]/15 border border-[#0F3D33]/20 dark:border-[#4FB89A]/30 flex items-center justify-center text-[#0F3D33] dark:text-[#4FB89A] mb-3">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h4 className="font-serif text-lg font-normal text-foreground tracking-tight">{title}</h4>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mt-1.5 leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* =========================================================================
   SKELETON COMPONENT
========================================================================= */

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-[8px] bg-muted/70", className)}
      {...props}
    />
  );
}

/* =========================================================================
   OFFICIAL DOSSIER LEAD SCORE STAMP
   Styled like an authentic academic seal / institutional stamp
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
    ? "border-[#C4552F] text-[#C4552F] bg-[#C4552F]/5"
    : isWarm
    ? "border-[#E0A030] text-[#9E6C16] dark:text-[#E0A030] bg-[#E0A030]/5"
    : "border-[#5B7083] text-[#5B7083] dark:text-[#8AA2B6] bg-[#5B7083]/5";

  return (
    <div
      className={cn(
        "relative inline-flex flex-col items-center justify-center p-3 rounded-full border-2 border-dashed aspect-square w-28 h-28 select-none rotate-[-4deg] transition-transform hover:rotate-0",
        stampColor,
        className
      )}
    >
      <div className="absolute inset-1 rounded-full border border-current pointer-events-none" />
      <span className="text-[9px] uppercase tracking-widest font-mono font-semibold opacity-80">
        VERITAS • AI
      </span>
      <span className="font-mono text-3xl font-bold tracking-tight leading-none my-0.5 tabular-nums">
        {score}
      </span>
      <span className="text-[10px] uppercase font-mono font-bold tracking-widest">
        {category}
      </span>
    </div>
  );
}


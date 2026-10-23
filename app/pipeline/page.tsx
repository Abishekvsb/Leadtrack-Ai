"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/components/toast-context";
import {
  KanbanSquare,
  Sparkles,
  Phone,
  Flame,
  ChevronRight,
  Loader2,
  Filter,
  Plus,
  MoveRight,
} from "lucide-react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { STATUS_COLORS, STATUS_LABELS, SCORE_COLORS, LeadStatus, ScoreCategory } from "@/lib/types";

const COLUMNS: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "CAMPUS_VISIT",
  "APPLICATION_SUBMITTED",
  "ADMITTED",
  "LOST",
];

// Draggable Lead Card Component
function KanbanCard({
  lead,
  isOverlay = false,
  onMoveStatus,
}: {
  lead: any;
  isOverlay?: boolean;
  onMoveStatus?: (leadId: string, status: LeadStatus) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  });

  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const scoreInfo = SCORE_COLORS[lead.scoreCategory as ScoreCategory] || SCORE_COLORS.WARM;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-3.5 rounded-[10px] bg-card border border-border shadow-xs hover:border-[#0F3D33]/40 dark:hover:border-[#4FB89A]/40 transition-all cursor-grab active:cursor-grabbing space-y-2.5 text-xs relative ${
        isDragging ? "opacity-30 border-dashed border-[#0F3D33] dark:border-[#4FB89A]" : ""
      } ${isOverlay ? "shadow-academic-floating ring-1 ring-[#0F3D33] dark:ring-[#4FB89A] scale-[1.02] bg-card" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/leads/${lead.id}`}
          onClick={(e) => e.stopPropagation()}
          className="font-serif text-sm font-normal text-foreground hover:text-[#0F3D33] dark:hover:text-[#4FB89A] transition-colors line-clamp-1 min-h-[22px] flex items-center"
        >
          {lead.studentName}
        </Link>
        <span
          className={`px-1.5 py-0.5 rounded-[4px] font-mono font-bold text-[10px] shrink-0 ${scoreInfo.badge}`}
        >
          {lead.score}
        </span>
      </div>

      <div className="space-y-0.5 text-muted-foreground text-[11px]">
        <p className="truncate font-medium text-foreground">
          {lead.course?.code || "GEN"} • {lead.city || "Unspecified"}
        </p>
        <p className="font-mono tabular-nums">{lead.phone}</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border text-[10px] text-muted-foreground">
        <span className="truncate max-w-[110px] font-medium">{lead.assignedTo?.name || "Unassigned"}</span>

        {/* Move To Quick Menu */}
        {!isOverlay && onMoveStatus && (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowMoveMenu(!showMoveMenu)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[36px] rounded-[6px] border border-border bg-card text-foreground hover:bg-[#EDE6DA]/50 dark:hover:bg-[#1F2723] font-medium transition-colors"
              title="Move to stage"
            >
              <span>Move</span>
              <MoveRight className="w-3 h-3 text-muted-foreground" />
            </button>

            {showMoveMenu && (
              <div className="absolute right-0 bottom-full mb-1.5 w-48 rounded-[10px] bg-card border border-border shadow-academic-floating py-1.5 z-30 animate-in fade-in">
                <p className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Move candidate to
                </p>
                {COLUMNS.filter((c) => c !== lead.status).map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => {
                      setShowMoveMenu(false);
                      onMoveStatus(lead.id, col);
                    }}
                    className="w-full text-left px-3 py-2 min-h-[40px] text-xs hover:bg-[#EDE6DA]/40 dark:hover:bg-[#1F2723] flex items-center gap-2 text-foreground"
                  >
                    <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[col]?.dot || "bg-muted-foreground"}`} />
                    <span>{STATUS_LABELS[col]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Droppable Kanban Column Component
function KanbanColumn({
  status,
  leads,
  onMoveQuick,
}: {
  status: LeadStatus;
  leads: any[];
  onMoveQuick: (id: string, newStatus: LeadStatus) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.NEW;

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-[12px] p-3 bg-[#EDE6DA]/20 dark:bg-[#171D1A]/40 border border-border w-[84vw] sm:w-72 shrink-0 max-h-[80vh] transition-colors snap-start ${
        isOver ? "bg-[#EDE6DA]/60 dark:bg-[#1F2723]/60 border-[#0F3D33] dark:border-[#4FB89A]" : ""
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-2 mb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
          <h3 className="font-serif text-xs font-normal text-foreground">
            {STATUS_LABELS[status]}
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-[4px] bg-card border border-border text-[10px] font-mono tabular-nums text-muted-foreground">
          {leads.length}
        </span>
      </div>

      {/* Leads Cards Container */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {leads.length === 0 ? (
          <div className="py-12 text-center text-[11px] text-muted-foreground border border-dashed border-border rounded-[8px] font-serif italic">
            Stage empty
          </div>
        ) : (
          leads.map((lead) => (
            <KanbanCard key={lead.id} lead={lead} onMoveStatus={onMoveQuick} />
          ))
        )}
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const { success, error } = useToast();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLead, setActiveLead] = useState<any | null>(null);

  // Setup DnD Sensors (Pointer + Touch with delay/tolerance for mobile dragging)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads?limit=150");
      if (res.ok) {
        const json = await res.json();
        if (json.success) setLeads(json.data.leads || []);
      }
    } catch {
      error("Failed to load pipeline leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragStart = (event: any) => {
    const lead = event.active.data.current?.lead;
    setActiveLead(lead || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const leadId = active.id as string;
    const targetStatus = over.id as LeadStatus;

    // Check if status actually changed
    const currentLead = leads.find((l) => l.id === leadId);
    if (!currentLead || currentLead.status === targetStatus) return;

    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: targetStatus } : l))
    );

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });
      const data = await res.json();
      if (data.success) {
        success(
          `${currentLead.studentName} advanced to ${STATUS_LABELS[targetStatus]}`
        );
      } else {
        error(data.error || "Failed to update pipeline status");
        fetchLeads();
      }
    } catch {
      error("Network error updating lead");
      fetchLeads();
    }
  };

  const handleMoveStatus = async (leadId: string, targetStatus: LeadStatus) => {
    const currentLead = leads.find((l) => l.id === leadId);
    if (!currentLead || currentLead.status === targetStatus) return;

    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: targetStatus } : l))
    );

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });
      const data = await res.json();
      if (data.success) {
        success(
          `${currentLead.studentName} advanced to ${STATUS_LABELS[targetStatus]}`
        );
      } else {
        error(data.error || "Failed to update pipeline status");
        fetchLeads();
      }
    } catch {
      error("Network error updating lead");
      fetchLeads();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
              Admissions Workflow
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-foreground tracking-tight">
              Kanban Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Drag and drop candidate files across admissions stages to update institutional records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/leads"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-[8px] border border-border bg-card text-foreground hover:bg-[#EDE6DA]/50 dark:hover:bg-[#1F2723] text-xs font-medium transition-colors"
            >
              <span>Table Registry View</span>
            </Link>
          </div>
        </div>

        {/* Kanban Board Container with Horizontal Scroll & Touch Snap */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#0F3D33] dark:text-[#4FB89A] mx-auto" />
            <p className="font-serif italic text-xs text-muted-foreground">Loading pipeline stages...</p>
          </div>
        ) : (
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth">
              {COLUMNS.map((col) => {
                const colLeads = leads.filter((l) => l.status === col);
                return (
                  <KanbanColumn
                    key={col}
                    status={col}
                    leads={colLeads}
                    onMoveQuick={handleMoveStatus}
                  />
                );
              })}
            </div>

            <DragOverlay>
              {activeLead ? <KanbanCard lead={activeLead} isOverlay /> : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </DashboardLayout>
  );
}

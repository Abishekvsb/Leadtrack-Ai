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
      className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing space-y-2.5 text-xs relative ${
        isDragging ? "opacity-30 border-dashed border-indigo-400" : ""
      } ${isOverlay ? "shadow-2xl ring-2 ring-indigo-500 scale-105" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/leads/${lead.id}`}
          onClick={(e) => e.stopPropagation()}
          className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1 min-h-[24px] flex items-center"
        >
          {lead.studentName}
        </Link>
        <span
          className={`px-2 py-0.5 rounded-md font-bold text-[10px] shrink-0 ${scoreInfo.badge}`}
        >
          {lead.score}
        </span>
      </div>

      <div className="space-y-0.5 text-slate-500 dark:text-slate-400 text-[11px]">
        <p className="truncate font-medium text-slate-700 dark:text-slate-300">
          {lead.course?.code || "GEN"} • {lead.city}
        </p>
        <p>{lead.phone}</p>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
        <span className="truncate max-w-[100px]">{lead.assignedTo?.name || "Unassigned"}</span>

        {/* Move To Quick Menu (Alternative to drag on mobile/touch) */}
        {!isOverlay && onMoveStatus && (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowMoveMenu(!showMoveMenu)}
              className="inline-flex items-center gap-1 px-3 py-2 min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors"
              title="Move to stage"
            >
              <span>Move</span>
              <MoveRight className="w-3.5 h-3.5" />
            </button>

            {showMoveMenu && (
              <div className="absolute right-0 bottom-full mb-1.5 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1.5 z-30 animate-in fade-in">
                <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Move lead to
                </p>
                {COLUMNS.filter((c) => c !== lead.status).map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => {
                      setShowMoveMenu(false);
                      onMoveStatus(lead.id, col);
                    }}
                    className="w-full text-left px-3 py-2 min-h-[44px] text-xs hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[col]?.dot || "bg-slate-400"}`} />
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
      className={`flex flex-col rounded-3xl p-3 bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 w-[84vw] sm:w-72 shrink-0 max-h-[80vh] transition-colors snap-start ${
        isOver ? "bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-500/50" : ""
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-2 mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${statusStyle.dot}`} />
          <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">
            {STATUS_LABELS[status]}
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300">
          {leads.length}
        </span>
      </div>

      {/* Leads Cards Container */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {leads.length === 0 ? (
          <div className="py-12 text-center text-[11px] text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            Drop leads here
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
          `${currentLead.studentName} moved to ${STATUS_LABELS[targetStatus]}`
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
          `${currentLead.studentName} moved to ${STATUS_LABELS[targetStatus]}`
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
      <div className="space-y-6 pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Admissions Kanban Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Drag and drop student candidates across stages to update status and trigger automations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/leads"
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs flex items-center justify-center"
            >
              Table View
            </Link>
          </div>
        </div>

        {/* Kanban Board Container with Horizontal Scroll & Touch Snap */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
            <p className="text-xs text-slate-400">Loading Kanban pipeline...</p>
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

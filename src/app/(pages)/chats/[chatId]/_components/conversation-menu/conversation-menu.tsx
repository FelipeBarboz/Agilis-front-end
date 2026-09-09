"use client";

import { useEffect, useRef } from "react";
import {
  X,
  CalendarDays,
  Flag,
  Ban,
  Trash2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConversationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Menu items ───────────────────────────────────────────────────────────────

const MENU_ITEMS = [
  {
    id: "schedule",
    label: "Ver agendamento",
    icon: CalendarDays,
    className: "text-foreground",
  },
  {
    id: "report",
    label: "Reportar prestador",
    icon: Flag,
    className: "text-orange-600",
  },
  {
    id: "block",
    label: "Bloquear prestador",
    icon: Ban,
    className: "text-destructive",
  },
  {
    id: "delete",
    label: "Excluir conversa",
    icon: Trash2,
    className: "text-destructive",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ConversationMenu({ isOpen, onClose }: ConversationMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="absolute right-2 top-14 z-50 min-w-[220px] rounded-2xl border bg-card shadow-xl ring-1 ring-foreground/10 overflow-hidden"
        role="menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Opções
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>

        {/* Items */}
        <div className="flex flex-col py-1">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/70 ${item.className}`}
            >
              <item.icon size={16} className="shrink-0" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

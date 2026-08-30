"use client";

import { motion } from "motion/react";
import { type HistoryStatus, STATUS_LABEL } from "../types";
import { cn } from "@/lib/utils";

export type HistoryFilterValue = "todos" | HistoryStatus;

const FILTERS: { value: HistoryFilterValue; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "agendado", label: STATUS_LABEL.agendado },
  { value: "em_andamento", label: STATUS_LABEL.em_andamento },
  { value: "concluido", label: STATUS_LABEL.concluido },
  { value: "cancelado", label: STATUS_LABEL.cancelado },
];

interface HistoryFiltersProps {
  value?: HistoryFilterValue;
  onChange?: (value: HistoryFilterValue) => void;
  counts?: Record<HistoryFilterValue, number>;
}

export function HistoryFilters({ value = "todos", onChange, counts }: HistoryFiltersProps) {
  return (
    <div className="flex w-fit max-w-full flex-wrap items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-xs">
      {FILTERS.map((filter) => {
        const isActive = filter.value === value;
        const count = counts?.[filter.value];

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange?.(filter.value)}
            className={cn(
              "relative flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="history-filter-pill"
                className="absolute inset-0 rounded-lg bg-primary shadow-xs"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{filter.label}</span>
            {count !== undefined && (
              <span
                className={cn(
                  "relative z-10 rounded-full px-1.5 py-0.2 text-[10px] font-semibold",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

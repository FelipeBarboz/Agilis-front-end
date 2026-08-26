"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { type HistoryStatus, STATUS_LABEL } from "../types";

export type HistoryFilterValue = "todos" | HistoryStatus;

const FILTERS: { value: HistoryFilterValue; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "em_andamento", label: STATUS_LABEL.em_andamento },
  { value: "agendado", label: STATUS_LABEL.agendado },
  { value: "concluido", label: STATUS_LABEL.concluido },
  { value: "cancelado", label: STATUS_LABEL.cancelado },
];

interface HistoryFiltersProps {
  value?: HistoryFilterValue;
  onChange?: (value: HistoryFilterValue) => void;
}

export function HistoryFilters({ value, onChange }: HistoryFiltersProps) {
  const [internalValue, setInternalValue] = useState<HistoryFilterValue>("todos");
  const activeValue = value ?? internalValue;

  function handleSelect(next: HistoryFilterValue) {
    setInternalValue(next);
    onChange?.(next);
  }

  return (
    <div className="flex w-fit items-center gap-1 rounded-lg border border-border bg-background p-1">
      {FILTERS.map((filter) => {
        const isActive = filter.value === activeValue;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => handleSelect(filter.value)}
            className="relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          >
            {isActive && (
              <motion.span
                layoutId="history-filter-pill"
                className="absolute inset-0 rounded-md bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span
              className={`relative z-10 ${
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

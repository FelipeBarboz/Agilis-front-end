"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const WEEKDAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export interface CalendarProps {
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function Calendar({
  selected,
  onSelect,
  disabled,
  className,
  minDate,
  maxDate,
}: CalendarProps) {
  const initialDate = selected ?? new Date();
  const [currentMonth, setCurrentMonth] = React.useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = React.useState(initialDate.getFullYear());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const days: { date: Date; isCurrentMonth: boolean; dayNumber: number }[] = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = daysInPrevMonth - i;
    const date = new Date(currentYear, currentMonth - 1, dayNumber);
    days.push({ date, isCurrentMonth: false, dayNumber });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear, currentMonth, i);
    days.push({ date, isCurrentMonth: true, dayNumber: i });
  }

  // Next month leading days
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(currentYear, currentMonth + 1, i);
    days.push({ date, isCurrentMonth: false, dayNumber: i });
  }

  return (
    <div className={cn("p-4 bg-background rounded-2xl border border-border shadow-xs w-full max-w-sm", className)}>
      {/* Header with Month / Year and Navigation */}
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-sm font-semibold text-foreground">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-sm" }),
              "h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            )}
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-sm" }),
              "h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            )}
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 text-center pb-2">
        {WEEKDAY_NAMES.map((d) => (
          <span
            key={d}
            className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(({ date, isCurrentMonth, dayNumber }, idx) => {
          const dateOnly = new Date(date);
          dateOnly.setHours(0, 0, 0, 0);

          const isSelected =
            selected &&
            selected.getFullYear() === date.getFullYear() &&
            selected.getMonth() === date.getMonth() &&
            selected.getDate() === date.getDate();

          const isToday =
            today.getFullYear() === date.getFullYear() &&
            today.getMonth() === date.getMonth() &&
            today.getDate() === date.getDate();

          let isDisabled = !isCurrentMonth;
          if (disabled && disabled(date)) isDisabled = true;
          if (minDate && dateOnly < minDate) isDisabled = true;
          if (maxDate && dateOnly > maxDate) isDisabled = true;

          return (
            <button
              key={idx}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect?.(date)}
              className={cn(
                "h-9 w-9 mx-auto flex items-center justify-center rounded-xl text-xs font-medium transition-colors",
                !isCurrentMonth && "text-muted-foreground/30",
                isCurrentMonth && !isSelected && "text-foreground hover:bg-muted",
                isToday && !isSelected && "border border-primary text-primary font-bold",
                isSelected && "bg-primary text-primary-foreground font-bold shadow-xs hover:bg-primary/90",
                isDisabled && "pointer-events-none opacity-25"
              )}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

export type NotificationFilter = "all" | "unread";

interface NotificationsFiltersProps {
  currentFilter: NotificationFilter;
  onChange: (filter: NotificationFilter) => void;
  totalCount: number;
  unreadCount: number;
}

export function NotificationsFilters({
  currentFilter,
  onChange,
  totalCount,
  unreadCount,
}: NotificationsFiltersProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-xs w-fit">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer",
          currentFilter === "all"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <span>Todas</span>
        <span
          className={cn(
            "rounded-full px-1.5 py-0.2 text-[10px] font-semibold",
            currentFilter === "all"
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {totalCount}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onChange("unread")}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer",
          currentFilter === "unread"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <span>Não lidas</span>
        {unreadCount > 0 && (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.2 text-[10px] font-semibold",
              currentFilter === "unread"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-primary/20 text-primary",
            )}
          >
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

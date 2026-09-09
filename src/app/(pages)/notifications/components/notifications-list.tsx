"use client";

import { NotificationItem } from "./notification-item";
import type { AppNotification } from "@/lib/mocks/notifications";

interface NotificationsListProps {
  notifications: AppNotification[];
  onItemClick: (id: string) => void;
  isLoading?: boolean;
}

export function NotificationsList({
  notifications,
  onItemClick,
  isLoading = false,
}: NotificationsListProps) {
  if (isLoading) {
    return <NotificationsPageSkeleton />;
  }

  const groups = groupByDate(notifications);

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(groups).map(([date, items]) => (
        <div key={date} className="flex flex-col gap-3">
          {/* Divisor de data estático no fluxo */}
          <div className="flex items-center gap-3 py-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {date}
            </span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <div className="flex flex-col gap-2.5">
            {items.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={onItemClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function groupByDate(notifications: AppNotification[]) {
  return notifications.reduce<Record<string, AppNotification[]>>((acc, notification) => {
    acc[notification.date] ??= [];
    acc[notification.date]!.push(notification);
    return acc;
  }, {});
}

function NotificationsPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2].map((section) => (
        <div key={section} className="space-y-3">
          {/* Header skeleton */}
          <div className="h-3 w-20 rounded-md bg-muted-foreground/20" />

          {/* Cards skeleton */}
          {[1, 2].map((card) => (
            <div
              key={card}
              className="flex items-start gap-4 rounded-2xl border border-border/40 bg-card p-4 shadow-xs"
            >
              {/* Avatar skeleton */}
              <div className="h-13 w-13 shrink-0 rounded-full bg-muted-foreground/20" />

              {/* Text skeleton */}
              <div className="flex flex-1 flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-44 rounded-md bg-muted-foreground/20" />
                  <div className="h-3 w-12 rounded-md bg-muted-foreground/20" />
                </div>
                <div className="h-3 w-32 rounded-md bg-muted-foreground/15" />
                <div className="h-3.5 w-full rounded-md bg-muted-foreground/10" />
                <div className="h-3.5 w-4/5 rounded-md bg-muted-foreground/10" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
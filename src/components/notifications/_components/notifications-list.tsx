import type { AppNotification } from "@/lib/mocks/notifications";
import { NotificationCard } from "./notification-card";

interface NotificationsListProps {
  grouped: Record<string, AppNotification[]>;
  onNotificationClick: (notification: AppNotification) => void;
}

export function NotificationsList({
  grouped,
  onNotificationClick,
}: NotificationsListProps) {
  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date} className="space-y-2.5">
          <div className="flex items-center gap-2 py-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {date}
            </span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <div className="space-y-2">
            {items.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={() => onNotificationClick(notification)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

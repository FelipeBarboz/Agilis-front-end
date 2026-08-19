import { NotificationItem } from "./notification-item";
import type { Notification } from "./types";

interface NotificationsListProps {
  notifications: Notification[];
  onItemClick: (id: string) => void;
}

export function NotificationsList({
  notifications,
  onItemClick,
}: NotificationsListProps) {
  const groups = groupByDate(notifications);

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {Object.entries(groups).map(([date, items]) => (
        <div key={date} className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {date}
          </span>
          <div className="flex flex-col gap-2">
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

function groupByDate(notifications: Notification[]) {
  return notifications.reduce<Record<string, Notification[]>>((acc, notification) => {
    acc[notification.date] ??= [];
    acc[notification.date]!.push(notification);
    return acc;
  }, {});
}
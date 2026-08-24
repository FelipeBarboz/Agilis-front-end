import { Calendar, Wallet, Tag, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "./types";

const TYPE_ICONS: Record<NotificationType, React.ElementType> = {
  appointment: Calendar,
  payment: Wallet,
  promotion: Tag,
  system: Info,
};

const TYPE_STYLES: Record<NotificationType, string> = {
  appointment: "bg-primary/10 text-primary",
  payment: "bg-amber-100 text-amber-700",
  promotion: "bg-purple-100 text-purple-700",
  system: "bg-muted text-muted-foreground",
};

interface NotificationItemProps {
  notification: Notification;
  onClick: (id: string) => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const Icon = TYPE_ICONS[notification.type];

  return (
    <button
      type="button"
      onClick={() => onClick(notification.id)}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors",
        notification.isRead ? "bg-background" : "bg-primary/5",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          TYPE_STYLES[notification.type],
        )}
      >
        <Icon className="h-4 w-4" />
      </span>

      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">
            {notification.title}
          </span>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {notification.time}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {notification.description}
        </p>
      </div>

      {!notification.isRead && (
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}
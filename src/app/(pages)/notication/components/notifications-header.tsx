interface NotificationsHeaderProps {
  hasUnread: boolean;
  onMarkAllAsRead: () => void;
}

export function NotificationsHeader({
  hasUnread,
  onMarkAllAsRead,
}: NotificationsHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-primary px-4 py-4 text-primary-foreground">
      <h1 className="text-lg font-semibold">Notificações</h1>
      {hasUnread && (
        <button
          type="button"
          onClick={onMarkAllAsRead}
          className="text-xs font-medium underline underline-offset-2"
        >
          Marcar todas como lidas
        </button>
      )}
    </div>
  );
}
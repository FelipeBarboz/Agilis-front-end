import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          aria-label="Voltar"
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/20"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-semibold">Notificações</h1>
      </div>
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
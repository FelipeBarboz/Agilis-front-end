import { Bell, CheckCheck, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationsHeaderProps {
  unreadCount: number;
  totalCount: number;
  filter: "all" | "unread";
  isRefreshing: boolean;
  onFilterChange: (filter: "all" | "unread") => void;
  onMarkAllAsRead: () => void;
  onRefresh: () => void;
  onClose: () => void;
}

export function NotificationsHeader({
  unreadCount,
  totalCount,
  filter,
  isRefreshing,
  onFilterChange,
  onMarkAllAsRead,
  onRefresh,
  onClose,
}: NotificationsHeaderProps) {
  return (
    <div className="flex flex-col border-b border-border bg-background/95 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                id="notifications-modal-title"
                className="text-lg font-bold text-foreground"
              >
                Notificações
              </h2>
              {unreadCount > 0 && (
                <span className="flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  {unreadCount} nova{unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Fique por dentro das atualizações dos seus serviços e lojas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onRefresh}
            title="Recarregar notificações"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
          </button>

          <button
            type="button"
            onClick={onClose}
            title="Fechar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filtros e Ações secundárias */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-muted/60 p-1">
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all",
              filter === "all"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span>Todas</span>
            <span className="rounded-full bg-muted px-1.5 py-0.2 text-[10px] text-muted-foreground">
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange("unread")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all",
              filter === "unread"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span>Não lidas</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/20 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Marcar todas como lidas</span>
          </button>
        )}
      </div>
    </div>
  );
}

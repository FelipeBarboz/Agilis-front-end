"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, CheckCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationsHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function NotificationsHeader({
  unreadCount,
  onMarkAllAsRead,
  onRefresh,
  isRefreshing = false,
}: NotificationsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Voltar"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-xs transition-all hover:bg-muted hover:border-primary/40 cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bell className="h-6 w-6" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Notificações</h1>
            {unreadCount > 0 && (
              <span className="flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                {unreadCount} nova{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Acompanhe as atualizações dos seus serviços, agendamentos e novidades
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            title="Recarregar notificações"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </button>
        )}

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1.5 border-border bg-background text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
          >
            <CheckCheck className="h-4 w-4 text-primary" />
            <span>Marcar todas como lidas</span>
          </Button>
        )}
      </div>
    </div>
  );
}
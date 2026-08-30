"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  BellOff,
  CheckCheck,
  RefreshCw,
  X,
  Calendar,
  Wallet,
  Tag,
  MessageSquare,
  Info,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type AppNotification,
  type NotificationType,
  mockAppNotifications,
} from "@/lib/mocks/notifications";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: AppNotification[];
  onNotificationsChange?: (items: AppNotification[]) => void;
}

const TYPE_ICONS: Record<NotificationType, React.ElementType> = {
  appointment: Calendar,
  payment: Wallet,
  promotion: Tag,
  message: MessageSquare,
  system: Info,
};

const TYPE_COLORS: Record<NotificationType, { bg: string; text: string }> = {
  appointment: { bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", text: "text-emerald-600" },
  payment: { bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400", text: "text-amber-600" },
  promotion: { bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400", text: "text-purple-600" },
  message: { bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400", text: "text-blue-600" },
  system: { bg: "bg-muted text-muted-foreground", text: "text-muted-foreground" },
};

export function NotificationsModal({
  isOpen,
  onClose,
  notifications: initialPropsNotifications,
  onNotificationsChange,
}: NotificationsModalProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>(
    initialPropsNotifications ?? mockAppNotifications,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync if props change
  useEffect(() => {
    if (initialPropsNotifications) {
      setNotifications(initialPropsNotifications);
    }
  }, [initialPropsNotifications]);

  // Simular skeleton loading ao abrir
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Fechar com a tecla ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const groupedNotifications = groupByDate(filteredNotifications);

  function handleRefresh() {
    setIsRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsRefreshing(false);
    }, 600);
  }

  function handleMarkAllAsRead() {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    onNotificationsChange?.(updated);
  }

  function handleNotificationClick(item: AppNotification) {
    if (!item.isRead) {
      const updated = notifications.map((n) =>
        n.id === item.id ? { ...n, isRead: true } : n,
      );
      setNotifications(updated);
      onNotificationsChange?.(updated);
    }

    if (item.actionUrl) {
      onClose();
      router.push(item.actionUrl);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop com desfoque */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Conteúdo do Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative z-10 flex h-[85vh] max-h-[680px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notifications-modal-title"
          >
            {/* Header */}
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
                    onClick={handleRefresh}
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
                    onClick={() => setFilter("all")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all",
                      filter === "all"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span>Todas</span>
                    <span className="rounded-full bg-muted px-1.5 py-0.2 text-[10px] text-muted-foreground">
                      {notifications.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilter("unread")}
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
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>Marcar todas como lidas</span>
                  </button>
                )}
              </div>
            </div>

            {/* Corpo com Scroll */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {isLoading ? (
                <NotificationsSkeleton />
              ) : filteredNotifications.length === 0 ? (
                <EmptyState filter={filter} />
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedNotifications).map(([date, items]) => (
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
                            onClick={() => handleNotificationClick(notification)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Notification Card Component ──────────────────────────────────────────────

interface NotificationCardProps {
  notification: AppNotification;
  onClick: () => void;
}

function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const [imgError, setImgError] = useState(false);
  const TypeIcon = TYPE_ICONS[notification.type];
  const typeStyle = TYPE_COLORS[notification.type];

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "group relative flex w-full cursor-pointer items-start gap-3.5 rounded-xl border p-3.5 transition-all duration-200 text-left",
        notification.isRead
          ? "border-border/60 bg-card hover:border-border hover:bg-muted/40"
          : "border-primary/20 bg-primary/[0.03] hover:border-primary/40 hover:bg-primary/[0.06]",
      )}
    >
      {/* Indicador de não lida */}
      {!notification.isRead && (
        <span
          className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20"
          title="Não lida"
        />
      )}

      {/* Foto / Avatar da Loja com Badge de Categoria */}
      <div className="relative shrink-0">
        <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
          {notification.store?.avatarUrl && !imgError ? (
            <Image
              src={notification.store.avatarUrl}
              alt={notification.store.name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-sm font-bold text-foreground">
              {notification.store?.initials ?? "AG"}
            </span>
          )}
        </div>

        {/* Mini ícone do tipo de notificação */}
        <span
          className={cn(
            "absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background shadow-xs",
            typeStyle.bg,
          )}
        >
          <TypeIcon className="h-2.5 w-2.5" />
        </span>
      </div>

      {/* Conteúdo textual */}
      <div className="flex flex-1 flex-col gap-1 pr-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <h3
            className={cn(
              "text-sm",
              notification.isRead
                ? "font-medium text-foreground"
                : "font-bold text-foreground",
            )}
          >
            {notification.title}
          </h3>
        </div>

        {/* Loja e Categoria */}
        {notification.store && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">
              {notification.store.name}
            </span>
            <span>•</span>
            <span className="text-[11px]">{notification.store.category}</span>
          </div>
        )}

        {/* Mensagem */}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {notification.message}
        </p>

        {/* Footer com Horário e link de ação */}
        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{notification.time}</span>
          {notification.actionUrl && (
            <span className="flex items-center gap-0.5 text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 font-medium">
              Ver detalhes
              <ChevronRight className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Loading State ───────────────────────────────────────────────────

function NotificationsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2].map((section) => (
        <div key={section} className="space-y-3">
          {/* Header skeleton */}
          <div className="h-3 w-16 rounded-md bg-muted" />

          {/* Cards skeleton */}
          {[1, 2].map((card) => (
            <div
              key={card}
              className="flex items-start gap-3.5 rounded-xl border border-border/40 bg-card/60 p-3.5"
            >
              {/* Avatar skeleton */}
              <div className="h-12 w-12 shrink-0 rounded-full bg-muted" />

              {/* Text skeleton */}
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-36 rounded-md bg-muted" />
                  <div className="h-3 w-10 rounded-md bg-muted" />
                </div>
                <div className="h-3 w-28 rounded-md bg-muted/70" />
                <div className="h-3 w-full rounded-md bg-muted/50" />
                <div className="h-3 w-4/5 rounded-md bg-muted/50" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ filter }: { filter: "all" | "unread" }) {
  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-3">
        <BellOff className="h-8 w-8" />
      </div>
      <h3 className="text-base font-semibold text-foreground">
        {filter === "unread"
          ? "Nenhuma notificação não lida"
          : "Nenhuma notificação por aqui"}
      </h3>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        {filter === "unread"
          ? "Você leu todas as notificações recentes. Bom trabalho!"
          : "Quando você receber atualizações de agendamentos, mensagens ou pagamentos, elas aparecerão aqui."}
      </p>
    </div>
  );
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

function groupByDate(notifications: AppNotification[]) {
  return notifications.reduce<Record<string, AppNotification[]>>(
    (acc, notification) => {
      acc[notification.date] ??= [];
      acc[notification.date]!.push(notification);
      return acc;
    },
    {},
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  type AppNotification,
  mockAppNotifications,
} from "@/lib/mocks/notifications";
import { NotificationsHeader } from "./_components/notifications-header";
import { NotificationsList } from "./_components/notifications-list";
import { NotificationsSkeleton } from "./_components/notifications-skeleton";
import { NotificationsEmptyState } from "./_components/notifications-empty-state";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: AppNotification[];
  onNotificationsChange?: (items: AppNotification[]) => void;
}

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
            <NotificationsHeader
              unreadCount={unreadCount}
              totalCount={notifications.length}
              filter={filter}
              isRefreshing={isRefreshing}
              onFilterChange={setFilter}
              onMarkAllAsRead={handleMarkAllAsRead}
              onRefresh={handleRefresh}
              onClose={onClose}
            />

            {/* Corpo com Scroll */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {isLoading ? (
                <NotificationsSkeleton />
              ) : filteredNotifications.length === 0 ? (
                <NotificationsEmptyState filter={filter} />
              ) : (
                <NotificationsList
                  grouped={groupedNotifications}
                  onNotificationClick={handleNotificationClick}
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

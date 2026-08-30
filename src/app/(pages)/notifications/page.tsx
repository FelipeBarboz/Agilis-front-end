"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NotificationsHeader } from "./components/notifications-header";
import { NotificationsFilters, type NotificationFilter } from "./components/notifications-filters";
import { NotificationsList } from "./components/notifications-list";
import { EmptyNotifications } from "./components/empty-notifications";
import { PageTransition } from "@/components/ui/motion";
import { mockAppNotifications, type AppNotification } from "@/lib/mocks/notifications";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>(mockAppNotifications);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  function handleRefresh() {
    setIsRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsRefreshing(false);
    }, 500);
  }

  function handleMarkAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true })),
    );
  }

  function handleItemClick(id: string) {
    const item = notifications.find((n) => n.id === id);
    if (item && !item.isRead) {
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification,
        ),
      );
    }

    if (item?.actionUrl) {
      router.push(item.actionUrl);
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-6 overflow-y-auto bg-muted p-4 sm:p-6 lg:p-8">
      <PageTransition className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* Header da Página */}
        <NotificationsHeader
          unreadCount={unreadCount}
          onMarkAllAsRead={handleMarkAllAsRead}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Filtros */}
        <div className="flex items-center justify-between gap-4">
          <NotificationsFilters
            currentFilter={filter}
            onChange={setFilter}
            totalCount={notifications.length}
            unreadCount={unreadCount}
          />
        </div>

        {/* Listagem ou Empty State */}
        {filteredNotifications.length === 0 && !isLoading ? (
          <EmptyNotifications
            filter={filter}
            onClearFilter={() => setFilter("all")}
          />
        ) : (
          <NotificationsList
            notifications={filteredNotifications}
            onItemClick={handleItemClick}
            isLoading={isLoading}
          />
        )}
      </PageTransition>
    </main>
  );
}
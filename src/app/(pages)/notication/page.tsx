"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NotificationsHeader } from "./components/notifications-header";
import { NotificationsList } from "./components/notifications-list";
import { EmptyNotifications } from "./components/empty-notifications";
import { PageTransition } from "@/components/ui/motion";
import type { Notification } from "./components/types";
// import { api } from "@/trpc/react"; // TODO: trocar pelos dados reais

// TODO: substituir por await api.notifications.listByUser()
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "appointment",
    title: "Agendamento confirmado",
    description: "Sua Limpeza de Piscina Residencial foi confirmada com Carlão Piscinas.",
    time: "09:12",
    date: "Hoje",
    isRead: false,
  },
  {
    id: "2",
    type: "payment",
    title: "Pagamento aprovado",
    description: "O pagamento de R$ 45,00 para Barbearia gorilla foi aprovado.",
    time: "08:40",
    date: "Hoje",
    isRead: false,
  },
  {
    id: "3",
    type: "promotion",
    title: "Cupom disponível",
    description: "Você tem 10% de desconto no seu próximo agendamento.",
    time: "18:05",
    date: "Ontem",
    isRead: true,
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(mockNotifications);

  // const markAsRead = api.notifications.markAsRead.useMutation();
  // const markAllAsRead = api.notifications.markAllAsRead.useMutation();

  const hasUnread = notifications.some((notification) => !notification.isRead);

  function handleMarkAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true })),
    );
    // markAllAsRead.mutate();
  }

  function handleItemClick(id: string) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    );
    // markAsRead.mutate({ notificationId: id });

    // TODO: ajustar destino de acordo com o tipo/relação da notificação
    router.push(`/notifications/${id}`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NotificationsHeader hasUnread={hasUnread} onMarkAllAsRead={handleMarkAllAsRead} />

      <main className="flex flex-1 flex-col overflow-y-auto bg-muted">
        <PageTransition className="flex flex-1 flex-col">
          {notifications.length === 0 ? (
            <EmptyNotifications />
          ) : (
            <NotificationsList
              notifications={notifications}
              onItemClick={handleItemClick}
            />
          )}
        </PageTransition>
      </main>
    </div>
  );
}
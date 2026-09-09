"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Wallet,
  Tag,
  MessageSquare,
  Info,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/lib/mocks/notifications";

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

interface NotificationItemProps {
  notification: AppNotification;
  onClick: (id: string) => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const [imgError, setImgError] = useState(false);
  const TypeIcon = TYPE_ICONS[notification.type];
  const typeStyle = TYPE_COLORS[notification.type];

  return (
    <div
      onClick={() => onClick(notification.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(notification.id);
        }
      }}
      className={cn(
        "group relative flex w-full cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-all duration-200 text-left shadow-xs",
        notification.isRead
          ? "border-border/60 bg-card hover:border-border hover:bg-card/80"
          : "border-primary/25 bg-primary/[0.03] hover:border-primary/40 hover:bg-primary/[0.06]",
      )}
    >
      {/* Indicador de não lida */}
      {!notification.isRead && (
        <span
          className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20"
          title="Não lida"
        />
      )}

      {/* Foto / Avatar da Loja com Badge do Tipo */}
      <div className="relative shrink-0">
        <div className="relative flex h-13 w-13 items-center justify-center overflow-hidden rounded-full border border-border bg-muted shadow-xs">
          {notification.store?.avatarUrl && !imgError ? (
            <Image
              src={notification.store.avatarUrl}
              alt={notification.store.name}
              width={52}
              height={52}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-sm font-bold text-foreground">
              {notification.store?.initials ?? "AG"}
            </span>
          )}
        </div>

        {/* Mini ícone da categoria / tipo */}
        <span
          className={cn(
            "absolute -right-1 -bottom-1 flex h-5.5 w-5.5 items-center justify-center rounded-full border-2 border-background shadow-xs",
            typeStyle.bg,
          )}
        >
          <TypeIcon className="h-3 w-3" />
        </span>
      </div>

      {/* Conteúdo textual */}
      <div className="flex flex-1 flex-col gap-1 pr-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={cn(
              "text-sm sm:text-base leading-snug",
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
        <p className="mt-0.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          {notification.message}
        </p>

        {/* Footer com Horário e link de ação */}
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{notification.time}</span>
          {notification.actionUrl && (
            <span className="flex items-center gap-0.5 text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 font-medium">
              Ver detalhes
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
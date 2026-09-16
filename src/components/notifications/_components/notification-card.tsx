"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/lib/mocks/notifications";
import { TYPE_ICONS, TYPE_COLORS } from "./notification-types";

interface NotificationCardProps {
  notification: AppNotification;
  onClick: () => void;
}

export function NotificationCard({
  notification,
  onClick,
}: NotificationCardProps) {
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

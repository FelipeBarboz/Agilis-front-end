"use client";

import Link from "next/link";
import { CheckCheck } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatConversation {
  id: string;
  providerName: string;
  providerAvatar?: string;
  serviceName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  isFinished: boolean;
  isRead: boolean;
}

interface ChatListItemProps {
  conversation: ChatConversation;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatListItem({ conversation }: ChatListItemProps) {
  const {
    id,
    providerName,
    serviceName,
    lastMessage,
    lastMessageAt,
    unreadCount,
    isFinished,
    isRead,
  } = conversation;

  return (
    <Link
      href={`/chats/${id}`}
      className="flex items-center gap-3 border-b border-border bg-background px-4 py-3 transition-colors hover:bg-muted/60 active:bg-muted"
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
          {getInitials(providerName)}
        </div>
        {/* Online dot */}
        {!isFinished && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-semibold text-foreground">
            {providerName}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">{lastMessageAt}</span>
        </div>

        <span className="truncate text-xs text-muted-foreground">{serviceName}</span>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-1 overflow-hidden">
            {isRead && (
              <CheckCheck size={14} className="shrink-0 text-primary" />
            )}
            <span
              className={`truncate text-xs ${
                unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              {lastMessage}
            </span>
          </div>

          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}

          {isFinished && (
            <span className="shrink-0 rounded-full border border-muted-foreground/30 px-2 py-0.5 text-[10px] text-muted-foreground">
              Finalizado
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

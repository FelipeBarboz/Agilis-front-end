"use client";

import Link from "next/link";
import { CheckCheck, MessageSquare } from "lucide-react";

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
      className="flex items-center gap-4 border-b border-border bg-card px-5 py-4 transition-all hover:bg-muted/50 hover:border-primary/30 group last:border-b-0 sm:px-8"
    >
      {/* Avatar com inicial */}
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all">
          {getInitials(providerName)}
        </div>
        {/* Online dot */}
        {!isFinished && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className={`truncate text-sm font-bold ${unreadCount > 0 ? "text-foreground" : "text-foreground/80"}`}>
            {providerName}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">{lastMessageAt}</span>
        </div>

        <span className="truncate text-xs font-medium text-primary/70">{serviceName}</span>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-1.5 overflow-hidden">
            {isRead && (
              <CheckCheck size={13} className="shrink-0 text-primary" />
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
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}

          {isFinished && unreadCount === 0 && (
            <span className="shrink-0 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              Finalizado
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

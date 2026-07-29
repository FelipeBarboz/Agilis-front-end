"use client";

import { useMemo } from "react";
import { ChatListItem, type ChatConversation } from "../chat-list-item/chat-list-item";
import { ChatEmptyState } from "../chat-empty-state/chat-empty-state";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterType = "todos" | "nao_lidos" | "finalizados";

interface ChatListProps {
  conversations: ChatConversation[];
  filter: FilterType;
  search: string;
  emptyDescription?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatList({ conversations, filter, search, emptyDescription }: ChatListProps) {
  const filtered = useMemo(() => {
    let result = conversations;

    // Filter by type
    if (filter === "nao_lidos") {
      result = result.filter((c) => c.unreadCount > 0);
    } else if (filter === "finalizados") {
      result = result.filter((c) => c.isFinished);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.providerName.toLowerCase().includes(q) ||
          c.serviceName.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q),
      );
    }

    return result;
  }, [conversations, filter, search]);

  if (filtered.length === 0) {
    return <ChatEmptyState description={emptyDescription} />;
  }

  return (
    <div className="flex flex-col">
      {filtered.map((conv) => (
        <ChatListItem key={conv.id} conversation={conv} />
      ))}
    </div>
  );
}

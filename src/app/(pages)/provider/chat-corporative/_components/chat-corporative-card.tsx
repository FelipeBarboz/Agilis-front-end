"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { ChatFilterBar } from "@/app/(pages)/chats/_components/chat-filter-bar/chat-filter-bar";
import { ChatList } from "@/app/(pages)/chats/_components/chat-list/chat-list";
import type { ChatConversation } from "@/app/(pages)/chats/_components/chat-list-item/chat-list-item";
import { loadConversationsByRole } from "@/lib/services/messages-service";

type FilterType = "todos" | "nao_lidos" | "finalizados";

export function ChatCorporativeCard() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    void loadConversationsByRole("PROVIDER")
      .then((list) => {
        if (isMounted) setConversations(list);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const unreadCount = conversations.filter((c) => c.unreadCount > 0).length;

  return (
    <div className="flex flex-col rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Ícone + título da seção */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 sm:px-8 sm:pt-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MessageSquare className="size-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">
            Suas conversas
          </h2>
          <p className="text-xs text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} não lida(s)` : "Tudo lido"}
          </p>
        </div>
      </div>

      {/* Filtros + busca */}
      <div className="border-t border-border">
        <ChatFilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Lista de conversas */}
      <div className="border-t border-border">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span className="text-sm">Carregando conversas...</span>
          </div>
        ) : (
          <ChatList
            conversations={conversations}
            filter={activeFilter}
            search={searchQuery}
            emptyDescription={
              "Quando um cliente falar com você\na conversa aparecerá aqui"
            }
          />
        )}
      </div>
    </div>
  );
}

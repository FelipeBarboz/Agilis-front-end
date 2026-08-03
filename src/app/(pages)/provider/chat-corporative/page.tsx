"use client";

import { useState } from "react";
import { PageTransition } from "@/components/ui/motion";
import { ChatHeader } from "@/app/(pages)/chats/_components/chat-header/chat-header";
import { ChatFilterBar } from "@/app/(pages)/chats/_components/chat-filter-bar/chat-filter-bar";
import { ChatList } from "@/app/(pages)/chats/_components/chat-list/chat-list";
import type { ChatConversation } from "@/app/(pages)/chats/_components/chat-list-item/chat-list-item";

// ─── Mock data ────────────────────────────────────────────────────────────────
// Substitua por dados reais vindos da API

const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: "1",
    providerName: "Maria Souza",
    serviceName: "Instalação de tomadas",
    lastMessage: "Ótimo! Te aguardo amanhã então.",
    lastMessageAt: "11:05",
    unreadCount: 3,
    isFinished: false,
    isRead: false,
  },
  {
    id: "2",
    providerName: "Pedro Alves",
    serviceName: "Limpeza residencial",
    lastMessage: "Serviço concluído, muito obrigado!",
    lastMessageAt: "Ontem",
    unreadCount: 0,
    isFinished: true,
    isRead: true,
  },
  {
    id: "3",
    providerName: "Lucia Ferreira",
    serviceName: "Reparo de encanamento",
    lastMessage: "Qual o melhor horário para você?",
    lastMessageAt: "Ter",
    unreadCount: 1,
    isFinished: false,
    isRead: false,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

type FilterType = "todos" | "nao_lidos" | "finalizados";

export default function ChatCorporativePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-full flex-col bg-muted">
      {/* Top bar — verde Agilis */}
      <ChatHeader />

      <PageTransition className="flex flex-1 flex-col overflow-hidden">
        {/* Page title — texto do provedor */}
        <div className="bg-background px-4 pt-4 pb-2">
          <h1 className="text-xl font-bold text-foreground">
            Converse com seus clientes
          </h1>
        </div>

        {/* Filter + search bar */}
        <ChatFilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto bg-background">
          <ChatList
            conversations={MOCK_CONVERSATIONS}
            filter={activeFilter}
            search={searchQuery}
            emptyDescription={"Quando um cliente falar com você\na conversa aparecerá aqui"}
          />
        </div>
      </PageTransition>
    </div>
  );
}

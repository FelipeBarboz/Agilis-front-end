"use client";

import { useState } from "react";
import { PageTransition } from "@/components/ui/motion";
import { ChatHeader } from "./_components/chat-header/chat-header";
import { ChatFilterBar } from "./_components/chat-filter-bar/chat-filter-bar";
import { ChatList } from "./_components/chat-list/chat-list";
import type { ChatConversation } from "./_components/chat-list-item/chat-list-item";

// ─── Mock data ────────────────────────────────────────────────────────────────
// Substitua por dados reais vindos da API

const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: "1",
    providerName: "Carlos Elétrica",
    serviceName: "Instalação de tomadas",
    lastMessage: "Ok! Passarei amanhã às 14h para avaliar.",
    lastMessageAt: "10:32",
    unreadCount: 2,
    isFinished: false,
    isRead: false,
  },
  {
    id: "2",
    providerName: "Ana Limpeza",
    serviceName: "Limpeza residencial",
    lastMessage: "Obrigada pela avaliação! 😊",
    lastMessageAt: "Ontem",
    unreadCount: 0,
    isFinished: true,
    isRead: true,
  },
  {
    id: "3",
    providerName: "João Hidráulica",
    serviceName: "Reparo de encanamento",
    lastMessage: "Pode me mandar o endereço completo?",
    lastMessageAt: "Seg",
    unreadCount: 1,
    isFinished: false,
    isRead: false,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

type FilterType = "todos" | "nao_lidos" | "finalizados";

export default function ChatsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-full flex-col bg-muted">
      {/* Top bar — verde Agilis */}
      <ChatHeader />

      <PageTransition className="flex flex-1 flex-col overflow-hidden">
        {/* Page title */}
        <div className="bg-background px-4 pt-4 pb-2">
          <h1 className="text-xl font-bold text-foreground">Seus Chats</h1>
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
          />
        </div>
      </PageTransition>
    </div>
  );
}

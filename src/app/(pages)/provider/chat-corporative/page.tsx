"use client";

import { useState } from "react";
import { PageTransition } from "@/components/ui/motion";
import { ChatHeader } from "@/app/(pages)/chats/_components/chat-header/chat-header";
import { ChatFilterBar } from "@/app/(pages)/chats/_components/chat-filter-bar/chat-filter-bar";
import { ChatList } from "@/app/(pages)/chats/_components/chat-list/chat-list";
import { MOCK_CONVERSATIONS } from "@/lib/mocks/chat";

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

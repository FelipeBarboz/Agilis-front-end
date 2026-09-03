"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { ChatFilterBar } from "@/app/(pages)/chats/_components/chat-filter-bar/chat-filter-bar";
import { ChatList } from "@/app/(pages)/chats/_components/chat-list/chat-list";
import { mockConversations } from "@/lib/mocks/chat";


type FilterType = "todos" | "nao_lidos" | "finalizados";

export default function ChatCorporativePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted pb-20">

      {/* Botão de voltar flutuante — redireciona para tela de prestador */}
      <Link
        href="/provider"
        aria-label="Voltar para tela de prestador"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </Link>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Chats Corporativos</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Converse com seus clientes
          </p>
        </div>

        {/* Card: Filtros + Lista de conversas */}
        <div className="flex flex-col rounded-3xl border border-border bg-card shadow-sm overflow-hidden">

          {/* Ícone + título da seção */}
          <div className="flex items-center gap-3 px-5 pt-5 pb-4 sm:px-8 sm:pt-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageSquare className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Suas conversas</h2>
              <p className="text-xs text-muted-foreground">
                {mockConversations.filter(c => c.unreadCount > 0).length > 0
                  ? `${mockConversations.filter(c => c.unreadCount > 0).length} não lida(s)`
                  : "Tudo lido"}
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
            <ChatList
              conversations={mockConversations}
              filter={activeFilter}
              search={searchQuery}
              emptyDescription={"Quando um cliente falar com você\na conversa aparecerá aqui"}
            />
          </div>
        </div>

      </main>
    </div>
  );
}

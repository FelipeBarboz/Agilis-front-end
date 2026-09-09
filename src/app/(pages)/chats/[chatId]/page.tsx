"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/ui/motion";
import { ConversationHeader } from "./_components/conversation-header/conversation-header";
import { MessageList } from "./_components/message-list/message-list";
import { MessageInput } from "./_components/message-input/message-input";
import { ServiceSummaryBanner } from "./_components/service-summary-banner/service-summary-banner";
import { ConversationMenu } from "./_components/conversation-menu/conversation-menu";
import { mockConversationDetails } from "@/lib/mocks/chat";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;

  const [menuOpen, setMenuOpen] = useState(false);

  const data = mockConversationDetails[chatId];

  // Group messages by date (for demo, we use a simple single group)
  const messageGroups = useMemo(() => {
    if (!data) return [];
    return [
      {
        dateLabel: "Hoje",
        messages: data.messages,
      },
    ];
  }, [data]);

  // ── Not found ────────────────────────────────────────────────────────────────

  if (!data) {
    return (
      <div className="relative flex h-full flex-col overflow-y-auto bg-muted pb-20">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Voltar"
          className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <main className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center flex-1 px-4 pt-14 pb-8 sm:px-6">
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-8 shadow-sm text-center max-w-xs">
            <p className="text-base font-semibold text-foreground">
              Conversa não encontrada
            </p>
            <p className="text-xs text-muted-foreground">
              Essa conversa não existe ou foi excluída.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ── Handle send ───────────────────────────────────────────────────────────────

  function handleSend(text: string) {
    // TODO: integrar com a API de mensagens
    console.log("Sending:", text);
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted pb-0">

      {/* Botão de voltar flutuante — padrão das outras telas */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Context menu */}
      <ConversationMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-4 px-4 pt-14 pb-0 sm:px-6 lg:px-8">

        {/* Header da página */}
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {data.info.providerName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            {data.info.serviceName}
          </p>
        </div>

        {/* Card: Info do prestador */}
        <ConversationHeader
          conversation={data.info}
          onMenuOpen={() => setMenuOpen(true)}
        />

        {/* Card: Resumo do serviço */}
        <ServiceSummaryBanner service={data.service} />

        {/* Card: Mensagens + Input */}
        <div className="flex flex-col rounded-3xl border border-border bg-card shadow-sm overflow-hidden mb-6">
          {/* Messages — scrollable */}
          <PageTransition className="flex flex-col overflow-hidden min-h-[320px] max-h-[480px]">
            <MessageList groups={messageGroups} />
          </PageTransition>

          {/* Input bar — fixado no fundo do card */}
          <MessageInput
            onSend={handleSend}
            disabled={data.info.isFinished}
          />
        </div>

      </main>
    </div>
  );
}

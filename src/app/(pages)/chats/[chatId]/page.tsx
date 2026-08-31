"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
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
      <div className="flex flex-1 items-center justify-center bg-muted p-6">
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-8 shadow-sm text-center max-w-xs">
          <p className="text-base font-semibold text-foreground">
            Conversa não encontrada
          </p>
          <p className="text-xs text-muted-foreground">
            Essa conversa não existe ou foi excluída.
          </p>
        </div>
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
    <div className="relative flex h-full flex-col overflow-hidden bg-muted">
      {/* Top bar com seta de voltar */}
      <ConversationHeader
        conversation={data.info}
        onMenuOpen={() => setMenuOpen(true)}
      />

      {/* Context menu */}
      <ConversationMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Service summary banner */}
      <ServiceSummaryBanner service={data.service} />

      {/* Messages — scrollable */}
      <PageTransition className="flex flex-1 flex-col overflow-hidden">
        <MessageList groups={messageGroups} />
      </PageTransition>

      {/* Input bar — pinned to bottom */}
      <MessageInput
        onSend={handleSend}
        disabled={data.info.isFinished}
      />
    </div>
  );
}

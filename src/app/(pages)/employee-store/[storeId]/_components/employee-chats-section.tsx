"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  X,
  CheckCheck,
  Clock,
  Calendar,
  ChevronLeft,
  Search,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MOCK_EMPLOYEE_CONVERSATIONS,
  type EmployeeConversation,
  type EmployeeChatMessage,
} from "@/lib/mocks/employee-chats";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function statusBadge(status: EmployeeConversation["status"]) {
  const map: Record<
    EmployeeConversation["status"],
    { label: string; className: string }
  > = {
    pending: {
      label: "Pendente",
      className:
        "bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300",
    },
    confirmed: {
      label: "Confirmado",
      className:
        "bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
    },
    in_progress: {
      label: "Em execução",
      className:
        "bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300",
    },
    finished: {
      label: "Finalizado",
      className:
        "bg-muted border border-border text-muted-foreground",
    },
    cancelled: {
      label: "Cancelado",
      className:
        "bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400",
    },
  };
  return map[status];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ConversationListItem({
  conv,
  isActive,
  onClick,
}: {
  conv: EmployeeConversation;
  isActive: boolean;
  onClick: () => void;
}) {
  const badge = statusBadge(conv.status);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left transition-all hover:bg-muted/60 cursor-pointer ${
        isActive ? "bg-primary/5 border-l-2 border-l-primary" : ""
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-2 ring-primary/10">
          {getInitials(conv.clientName)}
        </div>
        {conv.unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow">
            {conv.unreadCount}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <div className="flex items-center justify-between gap-1">
          <span
            className={`truncate text-sm font-semibold ${
              conv.unreadCount > 0 ? "text-foreground" : "text-foreground/80"
            }`}
          >
            {conv.clientName}
          </span>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {conv.lastMessageAt}
          </span>
        </div>
        <span className="truncate text-[11px] font-medium text-primary/70">
          {conv.serviceName}
        </span>
        <span
          className={`truncate text-xs ${
            conv.unreadCount > 0
              ? "font-medium text-foreground"
              : "text-muted-foreground"
          }`}
        >
          {conv.lastMessage}
        </span>
      </div>
    </button>
  );
}

function MessageBubble({ msg }: { msg: EmployeeChatMessage }) {
  return (
    <div
      className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`group relative max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
          msg.isOwn
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-card border border-border text-foreground"
        }`}
      >
        <p className="leading-relaxed">{msg.content}</p>
        <div
          className={`mt-1 flex items-center gap-1 ${
            msg.isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span
            className={`text-[10px] ${
              msg.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}
          >
            {msg.sentAt}
          </span>
          {msg.isOwn && msg.status === "read" && (
            <CheckCheck className="size-3 text-primary-foreground/70" />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EmployeeChatsSection() {
  const [conversations, setConversations] = useState<EmployeeConversation[]>(
    MOCK_EMPLOYEE_CONVERSATIONS
  );
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showList, setShowList] = useState(true); // controle mobile: lista vs chat
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) ?? null;

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.clientName.toLowerCase().includes(q) ||
      c.serviceName.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
    );
  });

  // Scroll to bottom when opening/updating chat
  useEffect(() => {
    if (activeConv) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 60);
    }
  }, [activeConv?.id, activeConv?.messages.length]);

  function openConversation(convId: string) {
    setActiveConvId(convId);
    setShowList(false);
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
    );
    inputRef.current?.focus();
  }

  function handleSend() {
    const text = inputValue.trim();
    if (!text || !activeConvId) return;

    const newMsg: EmployeeChatMessage = {
      id: `msg-${Date.now()}`,
      content: text,
      sentAt: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
      status: "sent",
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessage: text,
              lastMessageAt: newMsg.sentAt,
            }
          : c
      )
    );
    setInputValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const badge = activeConv ? statusBadge(activeConv.status) : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Cabeçalho da seção */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Chats dos Solicitantes
          </h2>
          {totalUnread > 0 && (
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {totalUnread}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Converse diretamente com quem solicitou os serviços
        </p>
      </div>

      {/* Panel de Chat */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex h-[560px] sm:h-[600px]">

          {/* ── Coluna esquerda: Lista de conversas ── */}
          <div
            className={`flex w-full flex-col border-r border-border sm:w-72 lg:w-80 ${
              showList ? "flex" : "hidden sm:flex"
            }`}
          >
            {/* Topo da lista */}
            <div className="flex flex-col gap-2 border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MessageSquare className="size-4" />
                </div>
                <span className="text-sm font-bold text-foreground">
                  Conversas
                </span>
              </div>
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar conversa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/50 py-2 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
                  <MessageSquare className="size-8 text-muted-foreground/50" />
                  <p className="text-xs text-muted-foreground">
                    Nenhuma conversa encontrada
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <ConversationListItem
                    key={conv.id}
                    conv={conv}
                    isActive={conv.id === activeConvId}
                    onClick={() => openConversation(conv.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* ── Coluna direita: Janela de chat ── */}
          <div
            className={`flex flex-1 flex-col ${
              !showList ? "flex" : "hidden sm:flex"
            }`}
          >
            {activeConv ? (
              <>
                {/* Header do chat */}
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                  {/* Botão voltar (mobile) */}
                  <button
                    type="button"
                    onClick={() => setShowList(true)}
                    className="flex size-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted transition-colors sm:hidden cursor-pointer"
                  >
                    <ChevronLeft className="size-5" />
                  </button>

                  {/* Avatar */}
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {getInitials(activeConv.clientName)}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                    <span className="truncate text-sm font-bold text-foreground">
                      {activeConv.clientName}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-xs text-muted-foreground">
                        {activeConv.serviceName}
                      </span>
                      {badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Data/hora do agendamento */}
                  <div className="hidden shrink-0 flex-col items-end gap-0.5 sm:flex">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar className="size-3" />
                      <span>{activeConv.appointmentDate}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="size-3" />
                      <span>{activeConv.appointmentTime}</span>
                    </div>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <div className="flex flex-col gap-3">
                    {/* Banner de contexto */}
                    <div className="mx-auto flex items-center gap-2 rounded-2xl border border-border bg-muted/60 px-4 py-2 text-xs text-muted-foreground">
                      <Calendar className="size-3.5 shrink-0" />
                      <span>
                        {activeConv.serviceName} · {activeConv.appointmentDate}{" "}
                        às {activeConv.appointmentTime}
                      </span>
                    </div>

                    {activeConv.messages.map((msg) => (
                      <MessageBubble key={msg.id} msg={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input */}
                <div className="border-t border-border px-4 py-3">
                  <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/50 px-4 py-2 focus-within:ring-2 focus-within:ring-primary/30 transition-all">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Mensagem para ${activeConv.clientName}…`}
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Send className="size-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Estado vazio */
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MessageSquare className="size-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Selecione uma conversa
                  </h3>
                  <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                    Escolha um solicitante na lista ao lado para iniciar o
                    atendimento via chat.
                  </p>
                </div>
                {totalUnread > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                    <Circle className="size-2 fill-primary" />
                    {totalUnread} mensagem{totalUnread > 1 ? "ns" : ""} não
                    lida{totalUnread > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

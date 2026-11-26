"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { PageTransition } from "@/components/ui/motion";
import {
  ConversationHeader,
  type ConversationInfo,
} from "./_components/conversation-header/conversation-header";
import { MessageList } from "./_components/message-list/message-list";
import { MessageInput } from "./_components/message-input/message-input";
import {
  ServiceSummaryBanner,
  type ServiceCardInfo,
} from "./_components/service-summary-banner/service-summary-banner";
import { ConversationMenu } from "./_components/conversation-menu/conversation-menu";
import type { ChatMessage } from "./_components/message-bubble/message-bubble";
import {
  getMessagesByBooking,
  sendBookingMessage,
  type BookingMessageDTO,
} from "@/lib/services/messages-service";
import {
  getNegotiationsByBooking,
  createNegotiation,
  respondToNegotiation,
  type NegotiationDTO,
  type NegotiationAction,
} from "@/lib/services/negotiations-service";
import { NegotiationPanel } from "./_components/negotiation-panel/negotiation-panel";
import {
  getBookingDetail,
  getBookingById,
} from "@/lib/services/bookings-service";
import { fetchServiceById } from "@/lib/services/services-service";
import { getStoreMembers } from "@/lib/services/store-members-service";
import { getStoredUser } from "@/lib/auth/token-storage";
import { api } from "@/lib/api";

function formatMsgTime(isoDate?: string): string {
  if (!isoDate) return "";
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate.slice(0, 5);
    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function mapServiceStatus(rawStatus: string): ServiceCardInfo["status"] {
  const upper = (rawStatus ?? "").toUpperCase();
  if (upper === "CONCLUIDO" || upper === "COMPLETED" || upper === "DONE") {
    return "finished";
  }
  if (upper === "EM_ANDAMENTO" || upper === "IN_PROGRESS") {
    return "in_progress";
  }
  if (upper === "AGENDADO" || upper === "CONFIRMED") {
    return "scheduled";
  }
  return "pending";
}

function formatPriceBRL(val: number): string {
  return `R$ ${Number(val || 0).toFixed(2).replace(".", ",")}`;
}

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [receiverId, setReceiverId] = useState<string>("");
  const [info, setInfo] = useState<ConversationInfo | null>(null);
  const [serviceInfo, setServiceInfo] = useState<ServiceCardInfo | null>(null);
  const [rawMessages, setRawMessages] = useState<BookingMessageDTO[]>([]);
  const [negotiations, setNegotiations] = useState<NegotiationDTO[]>([]);

  const loadChat = useCallback(async () => {
    if (!chatId) return;

    setIsLoading(true);
    setNotFound(false);

    try {
      const [detailRes, simpleRes, msgsRes, meRes, negsRes] =
        await Promise.allSettled([
          getBookingDetail(chatId),
          getBookingById(chatId),
          getMessagesByBooking(chatId),
          api<{ id: string }>("/api/v1/users/me"),
          getNegotiationsByBooking(chatId),
        ]);

      const stored = getStoredUser();
      const userId =
        (meRes.status === "fulfilled" && meRes.value?.id) || stored?.id || "";
      setCurrentUserId(userId);

      const detail = detailRes.status === "fulfilled" ? detailRes.value : null;
      const simple = simpleRes.status === "fulfilled" ? simpleRes.value : null;
      const msgs = msgsRes.status === "fulfilled" ? msgsRes.value : [];
      const negs = negsRes.status === "fulfilled" ? negsRes.value : [];

      if (!detail && !simple) {
        setNotFound(true);
        return;
      }

      setRawMessages(msgs);
      setNegotiations(negs);

      const rawStatus = detail?.status ?? simple?.status ?? "PENDING";
      const upperStatus = String(rawStatus).toUpperCase();
      const isFinished =
        upperStatus === "CONCLUIDO" ||
        upperStatus === "COMPLETED" ||
        upperStatus === "CANCELADO" ||
        upperStatus === "CANCELLED";

      const isClient = simple?.clientId ? simple.clientId === userId : true;
      const contactName = detail
        ? isClient
          ? detail.storeName
          : detail.clientName
        : "Contato";

      const serviceTitle =
        detail?.serviceTitle ?? simple?.serviceTitle ?? "Serviço agendado";

      setInfo({
        id: chatId,
        providerName: contactName || "Contato",
        serviceName: serviceTitle,
        isOnline: !isFinished,
        isFinished,
      });

      setServiceInfo({
        serviceId: simple?.serviceId ?? chatId,
        serviceName: serviceTitle,
        scheduledAt: detail ? `${detail.date} · ${detail.time}` : undefined,
        status: mapServiceStatus(String(rawStatus)),
        price: detail ? formatPriceBRL(detail.total ?? detail.price) : "—",
      });

      // Resolve o receiverId para envio de mensagens
      let resolvedReceiver = "";
      const otherMsg = msgs.find(
        (m) => m.senderId !== userId || m.receiverId !== userId
      );
      if (otherMsg) {
        resolvedReceiver =
          otherMsg.senderId !== userId ? otherMsg.senderId : otherMsg.receiverId;
      } else if (!isClient && simple?.clientId) {
        resolvedReceiver = simple.clientId;
      } else if (simple?.serviceId) {
        try {
          const svc = await fetchServiceById(simple.serviceId);
          if (svc.storeId) {
            const members = await getStoreMembers(svc.storeId);
            const owner =
              members.find((m) => m.role === "OWNER") ?? members[0];
            resolvedReceiver = owner?.providerId ?? svc.storeId;
          }
        } catch {
          // Mantém vazio caso não consiga resolver
        }
      }

      setReceiverId(resolvedReceiver);
    } catch {
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    void loadChat();
  }, [loadChat]);

  // Atualização periódica leve das mensagens e negociações
  useEffect(() => {
    if (!chatId || notFound) return;
    const interval = setInterval(() => {
      void (async () => {
        try {
          const [msgs, negs] = await Promise.all([
            getMessagesByBooking(chatId),
            getNegotiationsByBooking(chatId),
          ]);
          setRawMessages(msgs);
          setNegotiations(negs);
        } catch {
          // Ignora falha temporária no polling
        }
      })();
    }, 10000);
    return () => clearInterval(interval);
  }, [chatId, notFound]);

  const messageGroups = useMemo(() => {
    const mapped: ChatMessage[] = rawMessages.map((m) => ({
      id: m.messageId,
      content: m.content,
      sentAt: formatMsgTime(m.sentAt),
      isOwn: m.senderId === currentUserId,
      status: "read",
      type: "text",
    }));

    return [
      {
        dateLabel: "Conversa",
        messages: mapped,
      },
    ];
  }, [rawMessages, currentUserId]);

  async function handleSend(text: string) {
    if (!currentUserId || !receiverId) {
      setSendError(
        "Não foi possível identificar o destinatário desta conversa."
      );
      return;
    }

    setSendError(null);
    try {
      const sent = await sendBookingMessage({
        bookingId: chatId,
        senderId: currentUserId,
        receiverId,
        content: text,
      });
      setRawMessages((prev) => [...prev, sent]);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Erro ao enviar mensagem.";
      setSendError(msg);
    }
  }

  async function handleCreateProposal(amount: number) {
    if (!currentUserId || !receiverId) {
      throw new Error("Não foi possível identificar o destinatário da proposta.");
    }
    const created = await createNegotiation({
      bookingId: chatId,
      senderId: currentUserId,
      receiverId,
      amount,
    });
    setNegotiations((prev) => [...prev, created]);
  }

  async function handleRespondProposal(
    negotiationId: string,
    action: NegotiationAction,
    counterAmount?: number
  ) {
    const updated = await respondToNegotiation(negotiationId, {
      action,
      counterAmount,
    });
    const fresh = await getNegotiationsByBooking(chatId).catch(() => null);
    if (fresh) {
      setNegotiations(fresh);
    } else {
      setNegotiations((prev) => [...prev, updated]);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-muted py-24">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-7 animate-spin text-primary" />
          <p className="text-sm">Carregando conversa...</p>
        </div>
      </div>
    );
  }

  if (notFound || !info || !serviceInfo) {
    return (
      <div className="relative flex flex-1 flex-col bg-muted pb-20">
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

  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-0">
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
            {info.serviceName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            {info.providerName}
          </p>
        </div>

        {/* Card: Info do prestador */}
        <ConversationHeader
          conversation={info}
          onMenuOpen={() => setMenuOpen(true)}
        />

        {/* Card: Resumo do serviço */}
        <ServiceSummaryBanner service={serviceInfo} />

        {/* Card: Negociação de valor */}
        <NegotiationPanel
          negotiations={negotiations}
          currentUserId={currentUserId}
          isFinished={info.isFinished}
          onCreateProposal={handleCreateProposal}
          onRespondProposal={handleRespondProposal}
        />

        {sendError && (
          <div className="flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{sendError}</span>
          </div>
        )}

        {/* Card: Mensagens + Input */}
        <div className="flex flex-col rounded-3xl border border-border bg-card shadow-sm overflow-hidden mb-6">
          {/* Messages — scrollable */}
          <PageTransition className="flex flex-col overflow-hidden min-h-[320px] max-h-[480px]">
            <MessageList groups={messageGroups} />
          </PageTransition>

          {/* Input bar — fixado no fundo do card */}
          <MessageInput
            onSend={(text) => {
              void handleSend(text);
            }}
            disabled={info.isFinished}
          />
        </div>
      </main>
    </div>
  );
}

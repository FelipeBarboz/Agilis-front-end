import type { ChatConversation } from "@/app/(pages)/chats/_components/chat-list-item/chat-list-item";
import type { ConversationInfo } from "@/app/(pages)/chats/[chatId]/_components/conversation-header/conversation-header";
import type { ServiceCardInfo } from "@/app/(pages)/chats/[chatId]/_components/service-summary-banner/service-summary-banner";
import type { ChatMessage } from "@/app/(pages)/chats/[chatId]/_components/message-bubble/message-bubble";

// ─── Lista de conversas (tela de chats) ───────────────────────────────────────

export const mockConversations: ChatConversation[] = [
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

// ─── Detalhe de cada conversa (tela [chatId]) ─────────────────────────────────

export interface ConversationDetail {
  info: ConversationInfo;
  service: ServiceCardInfo;
  messages: ChatMessage[];
}

export const mockConversationDetails: Record<string, ConversationDetail> = {
  "1": {
    info: {
      id: "1",
      providerName: "Carlos Elétrica",
      serviceName: "Instalação de tomadas",
      isOnline: true,
      isFinished: false,
      rating: 4.8,
    },
    service: {
      serviceId: "1",
      serviceName: "Instalação de tomadas",
      scheduledAt: "Seg, 01 Set · 14h00",
      status: "scheduled",
      price: "R$ 150,00",
    },
    messages: [
      {
        id: "s1",
        content: "Agendamento confirmado para Segunda-feira, 01 Set às 14h",
        sentAt: "",
        isOwn: false,
        type: "system",
        systemLabel: "📅 Agendamento confirmado · Seg, 01 Set · 14h00",
      },
      {
        id: "m1",
        content: "Olá! Gostaria de confirmar o serviço de instalação de tomadas.",
        sentAt: "09:15",
        isOwn: true,
        status: "read",
      },
      {
        id: "m2",
        content: "Oi! Claro, posso atender sim. Você já tem as tomadas ou eu levo o material?",
        sentAt: "09:18",
        isOwn: false,
      },
      {
        id: "m3",
        content: "Eu já tenho as tomadas aqui. São 4 no total.",
        sentAt: "09:20",
        isOwn: true,
        status: "read",
      },
      {
        id: "m4",
        content: "Perfeito! Então o serviço fica em R$150,00. Passarei amanhã às 14h para avaliar e já instalar se der.",
        sentAt: "09:22",
        isOwn: false,
      },
      {
        id: "m5",
        content: "Ótimo! Combinado então. Obrigado!",
        sentAt: "09:23",
        isOwn: true,
        status: "read",
      },
      {
        id: "m6",
        content: "Ok! Passarei amanhã às 14h para avaliar. Qualquer coisa me chama! 👍",
        sentAt: "10:32",
        isOwn: false,
      },
    ],
  },
  "2": {
    info: {
      id: "2",
      providerName: "Ana Limpeza",
      serviceName: "Limpeza residencial",
      isOnline: false,
      isFinished: true,
      rating: 5.0,
    },
    service: {
      serviceId: "2",
      serviceName: "Limpeza residencial",
      scheduledAt: "Qui, 28 Ago · 09h00",
      status: "finished",
      price: "R$ 280,00",
    },
    messages: [
      {
        id: "s1",
        content: "",
        sentAt: "",
        isOwn: false,
        type: "system",
        systemLabel: "📅 Agendamento confirmado · Qui, 28 Ago · 09h00",
      },
      {
        id: "m1",
        content: "Bom dia! Estou chegando em uns 10 minutos. Pode abrir o portão?",
        sentAt: "08:51",
        isOwn: false,
      },
      {
        id: "m2",
        content: "Bom dia! Pode vir sim, já deixo aberto.",
        sentAt: "08:52",
        isOwn: true,
        status: "read",
      },
      {
        id: "s2",
        content: "",
        sentAt: "",
        isOwn: false,
        type: "system",
        systemLabel: "✅ Serviço concluído",
      },
      {
        id: "m3",
        content: "Serviço finalizado! Foi um prazer atender. Se precisar novamente é só chamar 😊",
        sentAt: "13:40",
        isOwn: false,
      },
      {
        id: "m4",
        content: "Ficou impecável! Obrigada pela avaliação! 😊",
        sentAt: "Ontem",
        isOwn: false,
      },
    ],
  },
  "3": {
    info: {
      id: "3",
      providerName: "João Hidráulica",
      serviceName: "Reparo de encanamento",
      isOnline: true,
      isFinished: false,
      rating: 4.6,
    },
    service: {
      serviceId: "3",
      serviceName: "Reparo de encanamento",
      status: "pending",
      price: "A combinar",
    },
    messages: [
      {
        id: "m1",
        content: "Olá João, preciso de um reparo no encanamento da cozinha.",
        sentAt: "Seg 10:02",
        isOwn: true,
        status: "delivered",
      },
      {
        id: "m2",
        content: "Olá! Pode me descrever melhor o problema? É vazamento, entupimento ou pressão baixa?",
        sentAt: "Seg 10:15",
        isOwn: false,
      },
      {
        id: "m3",
        content: "É um vazamento embaixo da pia. Goteja bastante.",
        sentAt: "Seg 10:20",
        isOwn: true,
        status: "delivered",
      },
      {
        id: "m4",
        content: "Entendido! Pode me mandar o endereço completo?",
        sentAt: "Seg 10:22",
        isOwn: false,
      },
    ],
  },
};

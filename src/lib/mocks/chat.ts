import type { ChatConversation } from "@/app/(pages)/chats/_components/chat-list-item/chat-list-item";

export const MOCK_CONVERSATIONS: ChatConversation[] = [
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

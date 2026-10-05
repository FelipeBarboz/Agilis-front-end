// Mock de conversas entre funcionário de loja e solicitantes de serviço.
// Substitua por dados reais da API quando o backend estiver conectado.

export interface EmployeeChatMessage {
  id: string;
  content: string;
  sentAt: string;
  isOwn: boolean; // true = funcionário, false = solicitante
  status?: "sent" | "delivered" | "read";
}

export interface EmployeeConversation {
  id: string;
  clientName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "pending" | "confirmed" | "in_progress" | "finished" | "cancelled";
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: EmployeeChatMessage[];
}

export const MOCK_EMPLOYEE_CONVERSATIONS: EmployeeConversation[] = [
  {
    id: "ec-1",
    clientName: "Lucas Mendes",
    serviceName: "Limpeza de piscina",
    appointmentDate: "Hoje",
    appointmentTime: "09:00",
    status: "confirmed",
    lastMessage: "Ótimo! Estarei em casa às 9h. Pode entrar pelo portão lateral.",
    lastMessageAt: "08:45",
    unreadCount: 2,
    messages: [
      {
        id: "m1",
        content: "Olá Lucas! Confirmando seu agendamento de limpeza de piscina para hoje às 09h.",
        sentAt: "08:30",
        isOwn: true,
        status: "read",
      },
      {
        id: "m2",
        content: "Olá! Tudo certo. Vou estar em casa.",
        sentAt: "08:38",
        isOwn: false,
      },
      {
        id: "m3",
        content: "Nosso técnico é o Rafael Silva. Ele chegará no horário combinado.",
        sentAt: "08:40",
        isOwn: true,
        status: "read",
      },
      {
        id: "m4",
        content: "Ótimo! Estarei em casa às 9h. Pode entrar pelo portão lateral.",
        sentAt: "08:45",
        isOwn: false,
      },
    ],
  },
  {
    id: "ec-2",
    clientName: "Ana Paula Costa",
    serviceName: "Tratamento de água",
    appointmentDate: "Hoje",
    appointmentTime: "14:00",
    status: "pending",
    lastMessage: "Qual o valor do tratamento completo?",
    lastMessageAt: "10:12",
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        content: "Boa tarde, Ana! Seu agendamento de tratamento de água está pendente de confirmação.",
        sentAt: "09:00",
        isOwn: true,
        status: "read",
      },
      {
        id: "m2",
        content: "Entendi. Qual o valor do tratamento completo?",
        sentAt: "10:12",
        isOwn: false,
      },
    ],
  },
  {
    id: "ec-3",
    clientName: "Carla Fernandes",
    serviceName: "Instalação de bomba",
    appointmentDate: "Amanhã",
    appointmentTime: "10:00",
    status: "confirmed",
    lastMessage: "Perfeito, obrigada pela confirmação!",
    lastMessageAt: "Ontem",
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        content: "Olá Carla! Sua instalação de bomba está confirmada para amanhã às 10h.",
        sentAt: "Ontem 14:00",
        isOwn: true,
        status: "read",
      },
      {
        id: "m2",
        content: "Perfeito, obrigada pela confirmação!",
        sentAt: "Ontem 14:30",
        isOwn: false,
      },
    ],
  },
  {
    id: "ec-4",
    clientName: "Marcos Oliveira",
    serviceName: "Manutenção de Aquecedor",
    appointmentDate: "Seg",
    appointmentTime: "08:30",
    status: "pending",
    lastMessage: "Pode me confirmar o horário?",
    lastMessageAt: "Seg",
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        content: "Pode me confirmar o horário da manutenção do aquecedor?",
        sentAt: "Seg 09:00",
        isOwn: false,
      },
      {
        id: "m2",
        content: "Olá Marcos! Será na segunda-feira às 08h30. Nosso técnico Carlos entrará em contato.",
        sentAt: "Seg 09:15",
        isOwn: true,
        status: "read",
      },
    ],
  },
];

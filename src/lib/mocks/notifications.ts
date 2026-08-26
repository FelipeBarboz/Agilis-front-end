export interface NotificationStore {
  name: string;
  avatarUrl?: string;
  initials: string;
  category: string;
}

export type NotificationType =
  | "appointment"
  | "payment"
  | "promotion"
  | "message"
  | "system";

export interface AppNotification {
  id: string;
  store?: NotificationStore;
  title: string;
  message: string;
  time: string;
  date: string;
  isRead: boolean;
  type: NotificationType;
  actionUrl?: string;
}

export const mockAppNotifications: AppNotification[] = [
  {
    id: "notif-1",
    store: {
      name: "Carlão Piscinas",
      avatarUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=150&auto=format&fit=crop&q=80",
      initials: "CP",
      category: "Limpeza & Manutenção",
    },
    title: "Agendamento confirmado!",
    message: "Sua Limpeza de Piscina Residencial foi confirmada para amanhã às 09:00 com a equipe técnica.",
    time: "14:35",
    date: "Hoje",
    isRead: false,
    type: "appointment",
    actionUrl: "/history",
  },
  {
    id: "notif-2",
    store: {
      name: "Barbearia Gorilla",
      avatarUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150&auto=format&fit=crop&q=80",
      initials: "BG",
      category: "Estética & Beleza",
    },
    title: "Pagamento aprovado",
    message: "O pagamento de R$ 65,00 referente a Corte + Barba Terapia foi processado com sucesso.",
    time: "11:20",
    date: "Hoje",
    isRead: false,
    type: "payment",
    actionUrl: "/history",
  },
  {
    id: "notif-3",
    store: {
      name: "Super Pinturas",
      avatarUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=150&auto=format&fit=crop&q=80",
      initials: "SP",
      category: "Pintura & Acabamento",
    },
    title: "Orçamento atualizado",
    message: "O profissional adicionou novos detalhes sobre a pintura externa da fachada.",
    time: "08:15",
    date: "Hoje",
    isRead: false,
    type: "message",
    actionUrl: "/chats",
  },
  {
    id: "notif-4",
    store: {
      name: "EletroFix Instalações",
      avatarUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150&auto=format&fit=crop&q=80",
      initials: "EF",
      category: "Elétrica",
    },
    title: "Cupom especial de 15% OFF",
    message: "Aproveite 15% de desconto em qualquer manutenção elétrica residencial até sexta-feira com o cupom ELETRICA15.",
    time: "19:40",
    date: "Ontem",
    isRead: true,
    type: "promotion",
    actionUrl: "/services?category=eletrica",
  },
  {
    id: "notif-5",
    store: {
      name: "HidroSoluções Encanamentos",
      avatarUrl: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=150&auto=format&fit=crop&q=80",
      initials: "HS",
      category: "Hidráulica",
    },
    title: "Serviço finalizado e avaliado",
    message: "Seu atendimento de troca de válvula hidráulica foi concluído com sucesso. Obrigado pela avaliação 5 estrelas!",
    time: "16:10",
    date: "Ontem",
    isRead: true,
    type: "appointment",
    actionUrl: "/history",
  },
  {
    id: "notif-6",
    title: "Bem-vindo ao Agilis!",
    message: "Complete seu perfil para receber recomendações personalizadas dos melhores profissionais da sua região.",
    time: "10:00",
    date: "24 de Fevereiro",
    isRead: true,
    type: "system",
    actionUrl: "/profile",
  },
];

export type PermissionId = "manage_appointments" | "access_chats" | "access_reports" | "store_settings";

export interface PermissionDefinition {
  id: PermissionId;
  label: string;
  description: string;
}

export const STORE_PERMISSIONS: PermissionDefinition[] = [
  {
    id: "manage_appointments",
    label: "Gerenciar atendimentos",
    description: "Permite criar, editar, remarcar e cancelar agendamentos de clientes.",
  },
  {
    id: "access_chats",
    label: "Acessar chats e mensagens",
    description: "Permite visualizar conversas e responder aos clientes no chat.",
  },
  {
    id: "access_reports",
    label: "Relatórios e métricas",
    description: "Visualizar relatórios financeiros, faturamento e desempenho da loja.",
  },
  {
    id: "store_settings",
    label: "Configurações da loja",
    description: "Acesso total para editar perfil público, logotipo e serviços da loja.",
  },
];

export interface Position {
  id: string;
  title: string;
  description: string;
  employeeCount: number;
  permissions: PermissionId[];
}

export const mockPositions: Position[] = [
  {
    id: "1",
    title: "Gerente Geral",
    description: "Acesso administrativo completo, relatórios financeiros, gestão de agendamentos e controle da equipe.",
    employeeCount: 1,
    permissions: ["manage_appointments", "access_chats", "access_reports", "store_settings"],
  },
  {
    id: "2",
    title: "Provedor de Serviço",
    description: "Responsável pela execução técnica dos serviços, atualização de status e visualização de sua agenda.",
    employeeCount: 1,
    permissions: ["manage_appointments"],
  },
  {
    id: "3",
    title: "Atendente",
    description: "Gestão dos agendamentos diários, atendimento direto via chat e recepção de clientes.",
    employeeCount: 1,
    permissions: ["manage_appointments", "access_chats"],
  },
  {
    id: "4",
    title: "Auxiliar de Manutenção",
    description: "Apoio nas tarefas de campo, preparação de materiais e suporte operacional.",
    employeeCount: 0,
    permissions: ["manage_appointments"],
  },
];

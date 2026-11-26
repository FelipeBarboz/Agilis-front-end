/**
 * Constantes de UI para cargos e permissões da loja.
 * Essas definições são locais (não vêm do backend) e usadas
 * para exibir labels, descrições e permissões na interface.
 */

export type PermissionId =
  | "manage_appointments"
  | "access_chats"
  | "access_reports"
  | "store_settings";

export interface PermissionDefinition {
  id: PermissionId;
  label: string;
  description: string;
}

export const STORE_PERMISSIONS: PermissionDefinition[] = [
  {
    id: "manage_appointments",
    label: "Gerenciar atendimentos",
    description:
      "Permite criar, editar, remarcar e cancelar agendamentos de clientes.",
  },
  {
    id: "access_chats",
    label: "Acessar chats e mensagens",
    description:
      "Permite visualizar conversas e responder aos clientes no chat.",
  },
  {
    id: "access_reports",
    label: "Relatórios e métricas",
    description:
      "Visualizar relatórios financeiros, faturamento e desempenho da loja.",
  },
  {
    id: "store_settings",
    label: "Configurações da loja",
    description:
      "Acesso total para editar perfil público, logotipo e serviços da loja.",
  },
];

export interface RoleDefinition {
  id: string;
  /** Role key usado pelo backend: "OWNER" | "ADMIN" | "EMPLOYEE" */
  apiRole: "OWNER" | "ADMIN" | "EMPLOYEE";
  title: string;
  description: string;
  permissions: PermissionId[];
}

/** Mapeamento fixo de papéis do backend → labels e permissões da UI */
export const STORE_ROLES: RoleDefinition[] = [
  {
    id: "OWNER",
    apiRole: "OWNER",
    title: "Proprietário",
    description: "Acesso administrativo completo. Não pode ser removido.",
    permissions: [
      "manage_appointments",
      "access_chats",
      "access_reports",
      "store_settings",
    ],
  },
  {
    id: "ADMIN",
    apiRole: "ADMIN",
    title: "Administrador",
    description:
      "Acesso administrativo completo, relatórios financeiros, gestão de agendamentos e controle da equipe.",
    permissions: [
      "manage_appointments",
      "access_chats",
      "access_reports",
      "store_settings",
    ],
  },
  {
    id: "EMPLOYEE",
    apiRole: "EMPLOYEE",
    title: "Funcionário",
    description:
      "Responsável pela execução dos serviços e visualização da agenda.",
    permissions: ["manage_appointments", "access_chats"],
  },
];

/** Retorna a definição de cargo para um role do backend */
export function getRoleDefinition(
  apiRole: string
): RoleDefinition {
  const normalized = (apiRole ?? "").toUpperCase();
  return (
    STORE_ROLES.find((r) => r.apiRole === normalized) ?? STORE_ROLES[2]!
  );
}

/** Mantido para retrocompatibilidade com componentes que ainda usam Position */
export interface Position {
  id: string;
  title: string;
  description: string;
  employeeCount: number;
  permissions: PermissionId[];
}

/** Modelo de exibição de membro da loja na UI */
export interface StoreEmployeeItem {
  id: string;
  providerId: string;
  name: string;
  email?: string;
  apiRole: "OWNER" | "ADMIN" | "EMPLOYEE";
  roleLabel: string;
  permissions: PermissionId[];
  avatar?: string;
}

/** Lista de cargos selecionáveis ao convidar/editar (exclui OWNER) */
export const SELECTABLE_ROLES: Position[] = [
  {
    id: "ADMIN",
    title: "Administrador",
    description:
      "Acesso administrativo completo, relatórios financeiros e controle da equipe.",
    employeeCount: 0,
    permissions: [
      "manage_appointments",
      "access_chats",
      "access_reports",
      "store_settings",
    ],
  },
  {
    id: "EMPLOYEE",
    title: "Funcionário",
    description:
      "Responsável pela execução dos serviços e visualização da agenda.",
    employeeCount: 0,
    permissions: ["manage_appointments", "access_chats"],
  },
];

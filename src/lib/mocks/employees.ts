import type { PermissionId } from "@/app/(pages)/store/employees/_components/manage-employee-modal";

export interface Employee {
  id: string;
  name: string;
  roleLabel: string;
  permissions: PermissionId[];
  avatar?: string;
}

export const mockEmployees: Employee[] = [
  { 
    id: "1", 
    name: "Carlos Silva", 
    roleLabel: "Gerente",
    permissions: ["manage_appointments", "access_chats", "access_reports", "store_settings"] 
  },
  { 
    id: "2", 
    name: "Ana Beatriz", 
    roleLabel: "Provedor de Serviço",
    permissions: ["manage_appointments"]
  },
  { 
    id: "3", 
    name: "Marcos Paulo", 
    roleLabel: "Atendente",
    permissions: ["manage_appointments", "access_chats"]
  },
];

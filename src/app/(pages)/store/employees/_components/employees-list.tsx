"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManageEmployeeModal } from "./manage-employee-modal";
import { AddEmployeeModal } from "./add-employee-modal";
import { EmployeeCard } from "./employee-card";
import { EmployeesEmptyState } from "./employees-empty-state";
import {
  getRoleDefinition,
  type StoreEmployeeItem,
} from "@/lib/constants/store-roles";
import {
  getStoreMembers,
  deleteStoreMember,
  type StoreMemberDTO,
} from "@/lib/services/store-members-service";
import {
  getStoreWeeklySchedule,
  getStoreDailySchedule,
} from "@/lib/services/employee-schedules-service";
import { getMyStores } from "@/lib/services/stores-service";
import { getStoredUser } from "@/lib/auth/token-storage";
import { api } from "@/lib/api";

interface CurrentUserDTO {
  id: string;
  name: string;
  email?: string;
}

const MEMBER_NAMES_CACHE_PREFIX = "agilis_member_names_";

function readCachedNames(storeId: string): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(`${MEMBER_NAMES_CACHE_PREFIX}${storeId}`);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function writeCachedNames(storeId: string, names: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `${MEMBER_NAMES_CACHE_PREFIX}${storeId}`,
      JSON.stringify(names)
    );
  } catch {
    // Ignora falha de storage
  }
}

function mapMemberToEmployeeItem(
  member: StoreMemberDTO,
  nameById: Record<string, string>
): StoreEmployeeItem {
  const roleDef = getRoleDefinition(member.role);
  const resolvedName =
    member.name?.trim() ??
    nameById[member.providerId] ??
    nameById[member.id] ??
    member.email?.trim() ??
    roleDef.title;

  return {
    id: member.id,
    providerId: member.providerId,
    name: resolvedName,
    email: member.email,
    apiRole: member.role,
    roleLabel: roleDef.title,
    permissions: roleDef.permissions,
    avatar: member.avatarUrl,
  };
}

export function EmployeesList() {
  const [storeId, setStoreId] = useState<string>("");
  const [employees, setEmployees] = useState<StoreEmployeeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedEmployee, setSelectedEmployee] =
    useState<StoreEmployeeItem | null>(null);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadMembers = useCallback(async (targetStoreId: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [membersRes, meRes, weeklyRes, dailyRes] =
        await Promise.allSettled([
          getStoreMembers(targetStoreId),
          api<CurrentUserDTO>("/api/v1/users/me"),
          getStoreWeeklySchedule(targetStoreId),
          getStoreDailySchedule(targetStoreId),
        ]);

      const members =
        membersRes.status === "fulfilled" ? membersRes.value : [];

      const nameById: Record<string, string> = {
        ...readCachedNames(targetStoreId),
      };

      const storedUser = getStoredUser();
      if (storedUser?.id && storedUser.name) {
        nameById[storedUser.id] = storedUser.name;
      }

      if (meRes.status === "fulfilled" && meRes.value?.id && meRes.value.name) {
        nameById[meRes.value.id] = meRes.value.name;
      }

      if (
        weeklyRes.status === "fulfilled" &&
        Array.isArray(weeklyRes.value?.employees)
      ) {
        for (const emp of weeklyRes.value.employees) {
          if (emp.employeeId && emp.name) {
            nameById[emp.employeeId] = emp.name;
          }
        }
      }

      if (
        dailyRes.status === "fulfilled" &&
        Array.isArray(dailyRes.value?.employees)
      ) {
        for (const emp of dailyRes.value.employees) {
          if (emp.employeeId && emp.name) {
            nameById[emp.employeeId] = emp.name;
          }
        }
      }

      writeCachedNames(targetStoreId, nameById);
      setEmployees(members.map((m) => mapMemberToEmployeeItem(m, nameById)));
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao carregar membros da loja.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      let resolvedStoreId = "";
      try {
        resolvedStoreId =
          localStorage.getItem("current_store_id") ??
          localStorage.getItem("active_store_id") ??
          "";
      } catch {
        // SSR guard
      }

      if (!resolvedStoreId || resolvedStoreId.startsWith("store-super")) {
        try {
          const stores = await getMyStores();
          if (stores.length > 0 && stores[0]?.storeId) {
            resolvedStoreId = stores[0].storeId;
          }
        } catch (err) {
          console.warn("[EmployeesList] Falha ao obter loja do usuário:", err);
        }
      }

      if (!isMounted) return;

      if (!resolvedStoreId) {
        setErrorMessage("Nenhuma loja encontrada para o usuário.");
        setIsLoading(false);
        return;
      }

      setStoreId(resolvedStoreId);
      await loadMembers(resolvedStoreId);
    }

    void init();
    return () => {
      isMounted = false;
    };
  }, [loadMembers]);

  const openManageModal = (employee: StoreEmployeeItem) => {
    setDeleteError(null);
    setSelectedEmployee(employee);
    setManageModalOpen(true);
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee || !storeId) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteStoreMember(
        storeId,
        selectedEmployee.id,
        selectedEmployee.providerId
      );
      setSelectedEmployee(null);
      setManageModalOpen(false);
      await loadMembers(storeId);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Não foi possível remover o membro.";
      setDeleteError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Equipe da Loja</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os funcionários da sua loja, seus cargos e níveis de
            permissão.
          </p>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          disabled={!storeId}
          className="gap-2 rounded-xl bg-brand-dark text-white hover:bg-brand-dark-2 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Adicionar Funcionário</span>
        </Button>
      </div>

      {/* Erro */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Lista de Funcionários */}
      <div className="flex flex-col gap-3.5">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span className="text-sm">Carregando equipe...</span>
          </div>
        ) : employees.length === 0 ? (
          <EmployeesEmptyState onAddEmployee={() => setAddModalOpen(true)} />
        ) : (
          employees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onManage={openManageModal}
            />
          ))
        )}
      </div>

      {/* Modal de Gerenciamento do Funcionário */}
      <ManageEmployeeModal
        open={manageModalOpen}
        onOpenChange={setManageModalOpen}
        employeeName={selectedEmployee?.name ?? ""}
        currentRole={selectedEmployee?.roleLabel}
        apiRole={selectedEmployee?.apiRole}
        isDeleting={isDeleting}
        deleteError={deleteError}
        onDeleteEmployee={handleDeleteEmployee}
      />

      {/* Modal de Convidar Funcionário */}
      <AddEmployeeModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        storeId={storeId}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { mockUser } from "@/lib/mocks/user";
import { getStoreById } from "@/lib/mocks/stores";
import {
  getEmployeeStoresFromStorage,
  type UserStoreAssociation,
} from "@/lib/mocks/invites";
import { MOCK_STORE_APPOINTMENTS } from "@/lib/mocks/store-appointments";
import { today } from "@/app/(pages)/store/store-scheduling/_components/date-helper";
import type { StoreAppointment } from "@/app/(pages)/store/store-scheduling/_components/store-appointment-card";
import { EmployeeProfileCard } from "./employee-profile-card";
import { EmployeeMetricsCards } from "./employee-metrics-cards";
import { EmployeeScheduleCard } from "./employee-schedule-card";
import { EmployeeShortcuts } from "./employee-shortcuts";

interface EmployeeDashboardBodyProps {
  storeId: string;
}

export function EmployeeDashboardBody({ storeId }: EmployeeDashboardBodyProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryPosition = searchParams.get("positionTitle");
  const { user } = useAuth();
  const currentUser = user ?? mockUser;

  const [association, setAssociation] = useState<UserStoreAssociation | null>(null);

  useEffect(() => {
    const list = getEmployeeStoresFromStorage();
    const found = list.find((a) => a.storeId === storeId);
    if (found) {
      setAssociation(found);
    } else {
      const store = getStoreById(storeId);
      setAssociation({
        id: "mock-assoc",
        storeId: store.id,
        storeName: store.name,
        storeInitials: store.initials,
        storeCategory: store.category,
        role: "employee",
        positionTitle: queryPosition ?? "Atendente Operacional",
        permissions: ["manage_appointments", "access_chats"],
        status: "active",
      });
    }
  }, [storeId, queryPosition]);

  // ── Dados compartilhados ───────────────────────────────────────────
  const positionTitle =
    association?.positionTitle ?? queryPosition ?? "Atendente Operacional";
  const permissions = association?.permissions ?? ["manage_appointments"];

  // Atendimentos do dia atribuídos ao funcionário
  const todayAppointments: StoreAppointment[] = (() => {
    const name = currentUser.name.toLowerCase();
    const assigned = MOCK_STORE_APPOINTMENTS.filter(
      (a) =>
        a.date === today &&
        (a.employeeName.toLowerCase().includes(name) ||
          name.includes(a.employeeName.toLowerCase()))
    );
    if (assigned.length > 0) return assigned;
    // Fallback: mostra atendimentos de hoje com o nome do funcionário
    return MOCK_STORE_APPOINTMENTS.filter((a) => a.date === today).slice(0, 5).map((a) => ({
      ...a,
      employeeName: currentUser.name,
    }));
  })();

  // Estado "Em Expediente" — baseado no turno ativo (association.status)
  const isOnShift = association?.status === "active";

  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      {/* Botão de voltar flutuante — padrão Agilis */}
      <button
        type="button"
        onClick={() => router.push("/stores")}
        aria-label="Voltar para Lojas"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Conteúdo principal */}
      <main className="mx-auto flex w-full max-w-[705px] flex-col gap-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        {/* 1. Cabeçalho da tela */}
        <div>
          <h1 className="text-[28px] font-bold text-foreground leading-tight">
            Perfil do Funcionário
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Acompanhe a jornada, a escala e os atendimentos do dia
          </p>
        </div>

        {/* 2. Card de perfil */}
        <EmployeeProfileCard
          employeeName={currentUser.name}
          positionTitle={positionTitle}
          isOnShift={isOnShift}
        />

        {/* 3. Cards de métricas */}
        <EmployeeMetricsCards appointments={todayAppointments} />

        {/* 4. Escala + Agenda de Hoje */}
        <EmployeeScheduleCard
          appointments={todayAppointments}
          storeId={storeId}
        />

        {/* 5. Atalhos */}
        <EmployeeShortcuts storeId={storeId} permissions={permissions} />
      </main>
    </div>
  );
}

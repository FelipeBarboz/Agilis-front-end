"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { getMyStores } from "@/lib/services/stores-service";
import { getStoreBookingsOverview } from "@/lib/services/bookings-service";
import {
  getRoleDefinition,
  type PermissionId,
} from "@/lib/constants/store-roles";
import {
  mapOverviewToStoreAppointment,
  toDateKey,
} from "@/lib/utils/employee-bookings-mapper";
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
  const employeeDisplayName = user?.name ?? "Funcionário";

  const [positionTitle, setPositionTitle] = useState<string>(
    queryPosition ?? "Funcionário"
  );
  const [permissions, setPermissions] = useState<PermissionId[]>([
    "manage_appointments",
    "access_chats",
  ]);
  const [isOnShift, setIsOnShift] = useState<boolean>(true);
  const [todayAppointments, setTodayAppointments] = useState<
    StoreAppointment[]
  >([]);

  useEffect(() => {
    let isMounted = true;
    const todayStr = toDateKey(new Date());

    void Promise.allSettled([
      getMyStores(),
      getStoreBookingsOverview(storeId, todayStr),
    ]).then(([storesRes, overviewRes]) => {
      if (!isMounted) return;

      if (storesRes.status === "fulfilled") {
        const found = storesRes.value.find((s) => s.storeId === storeId);
        if (found) {
          const roleDef = getRoleDefinition(found.role);
          setPositionTitle(queryPosition ?? roleDef.title);
          setPermissions(roleDef.permissions);
          setIsOnShift(true);
        }
      }

      if (overviewRes.status === "fulfilled") {
        const mapped = (overviewRes.value.bookings ?? []).map(
          mapOverviewToStoreAppointment
        );
        const lowerName = employeeDisplayName.toLowerCase();
        const mine = mapped.filter(
          (a) =>
            a.employeeName.toLowerCase().includes(lowerName) ||
            lowerName.includes(a.employeeName.toLowerCase())
        );
        setTodayAppointments(mine.length > 0 ? mine : mapped);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [storeId, queryPosition, employeeDisplayName]);

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
          employeeName={employeeDisplayName}
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

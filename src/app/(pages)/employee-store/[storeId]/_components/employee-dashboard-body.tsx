"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Home, Store } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { mockUser } from "@/lib/mocks/user";
import { getStoreById } from "@/lib/mocks/stores";
import {
  getEmployeeStoresFromStorage,
  type UserStoreAssociation,
} from "@/lib/mocks/invites";
import { EmployeeDashboardHeader } from "./employee-dashboard-header";
import { EmployeeAppointmentsSection } from "./employee-appointments-section";
import { EmployeeChatsSection } from "./employee-chats-section";

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
      // Fallback amigável
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

  const store = getStoreById(storeId);
  const positionTitle = association?.positionTitle ?? queryPosition ?? "Atendente Operacional";
  const permissions = association?.permissions ?? ["manage_appointments"];

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

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-4xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        
        {/* Header do Funcionário */}
        <EmployeeDashboardHeader
          storeName={association?.storeName ?? store.name}
          storeInitials={association?.storeInitials ?? store.initials}
          storeCategory={association?.storeCategory ?? store.category}
          storeId={storeId}
          employeeName={currentUser.name}
          positionTitle={positionTitle}
          permissions={permissions}
        />

        {/* Dashboard de Atendimentos */}
        <EmployeeAppointmentsSection employeeName={currentUser.name} storeId={storeId} />

        {/* Chat com Solicitantes */}
        <EmployeeChatsSection />

      </main>
    </div>
  );
}

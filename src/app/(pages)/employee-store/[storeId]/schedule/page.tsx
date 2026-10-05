"use client";

import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { mockUser } from "@/lib/mocks/user";
import { EmployeeScheduleCalendar } from "../_components/employee-schedule-calendar";

function EmployeeScheduleContent() {
  const router = useRouter();
  const params = useParams();
  const storeId = (params?.storeId as string) || "store-super-pinturas";
  const { user } = useAuth();
  const currentUser = user ?? mockUser;

  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      {/* Botao de voltar — padrao Agilis */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      <main className="mx-auto flex w-full max-w-2xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        <EmployeeScheduleCalendar
          employeeName={currentUser.name}
          storeId={storeId}
        />
      </main>
    </div>
  );
}

export default function EmployeeSchedulePage() {
  return (
    <Suspense fallback={null}>
      <EmployeeScheduleContent />
    </Suspense>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CouponsManagementCard } from "@/components/coupons/coupons-management-card";

export default function AdminCouponsPage() {
  const router = useRouter();

  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Painel de Cupons
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Crie, acompanhe usos e desative cupons de desconto na plataforma
          </p>
        </div>

        <CouponsManagementCard />
      </main>
    </div>
  );
}

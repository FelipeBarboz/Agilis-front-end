import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageTransition } from "@/components/ui/motion";
import { AddressForm } from "../_components/address-form/address-form";

export default function AddAddressPage() {
  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      {/* Seta de voltar */}
      <Link
        href="/addresses"
        aria-label="Voltar para endereços"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </Link>

      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        <PageTransition className="flex flex-col space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Adicionar Endereço</h1>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              Cadastre um novo endereço para seus agendamentos e atendimentos
            </p>
          </div>

          <AddressForm />
        </PageTransition>
      </main>
    </div>
  );
}
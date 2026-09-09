"use client";

import Link from "next/link";
import { ArrowLeft, Plus, MapPinOff } from "lucide-react";
import { PageTransition } from "@/components/ui/motion";
import { AddressCard } from "./_components/address-card/address-card";
import { useAddresses } from "@/hooks/use-addresses";

export default function AddressesPage() {
  const { addresses, deleteAddress } = useAddresses();

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted pb-20">
      {/* Seta de voltar flutuante — Padrão Agilis */}
      <Link
        href="/profile"
        aria-label="Voltar para o perfil"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </Link>

      {/* Conteúdo Principal */}
      <main className="mx-auto flex w-full max-w-5xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        <PageTransition className="flex flex-col space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">Meus Endereços</h1>
              <p className="mt-1 text-sm text-muted-foreground md:text-base">
                Gerencie seus locais cadastrados para atendimentos e serviços
              </p>
            </div>

            <Link
              href="/addresses/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:ring-4 focus:ring-primary/20"
            >
              <Plus className="size-4" />
              Novo endereço
            </Link>
          </div>

          {addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-card p-12 text-center shadow-sm">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MapPinOff className="size-7" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-foreground">Nenhum endereço cadastrado</span>
                <span className="text-xs text-muted-foreground">Cadastre um endereço para agilizar seus agendamentos</span>
              </div>
              <Link
                href="/addresses/add"
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
              >
                <Plus className="size-3.5" />
                Cadastrar agora
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {addresses.map((address) => (
                <AddressCard key={address.id} address={address} onDelete={deleteAddress} />
              ))}
            </div>
          )}
        </PageTransition>
      </main>
    </div>
  );
}
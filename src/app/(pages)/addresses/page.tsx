"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/motion";
import { AddressCard } from "./_components/address-card/address-card";
import { useAddresses } from "@/hooks/use-addresses";

export default function AddressesPage() {
  const { addresses } = useAddresses();

  return (
    <div className="flex min-h-screen flex-col gap-8 bg-muted p-6">
      <PageTransition className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Endereços</h1>
          <Button asChild variant="primary" size="lg">
            <Link href="/addresses/add" className="flex items-center gap-2">
              <Plus size={16} />
              Adicionar novo endereço
            </Link>
          </Button>
        </div>

        {addresses.length === 0 ? (
          <p className="text-muted-foreground">
            Você ainda não cadastrou nenhum endereço.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </div>
        )}
      </PageTransition>
    </div>
  );
}
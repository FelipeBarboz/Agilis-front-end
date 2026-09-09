"use client";

import { MapPin, Trash2 } from "lucide-react";
import type { Address } from "@/types/address";

interface AddressCardProps {
  address: Address;
  onDelete?: (id: string) => void;
}

export function AddressCard({ address, onDelete }: AddressCardProps) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 group sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
            <MapPin className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-foreground">
              {address.street}, {address.number}
            </span>
            {address.complement && (
              <span className="text-xs text-muted-foreground">
                {address.complement}
              </span>
            )}
          </div>
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(address.id)}
            title="Remover endereço"
            aria-label={`Remover endereço ${address.street}, ${address.number}`}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="font-medium">CEP {address.cep}</span>
      </div>
    </div>
  );
}
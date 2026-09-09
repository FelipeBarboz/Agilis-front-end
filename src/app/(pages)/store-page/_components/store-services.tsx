"use client";

import { type Service } from "@/lib/mocks/services";
import { ServiceCard } from "@/app/(pages)/services/_components/service-card";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface StoreServicesProps {
  services: Service[];
  storeName: string;
}

export function StoreServices({ services, storeName }: StoreServicesProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Serviços disponibilizados
          </h2>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {services.length}
          </span>
        </div>
        <p className="text-xs text-muted-foreground hidden sm:block">
          Todos os serviços executados por profissionais credenciados da {storeName}
        </p>
      </div>

      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-12 text-center shadow-xs ring-1 ring-foreground/10">
          <Sparkles className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-base font-medium text-foreground">Nenhum serviço cadastrado no momento</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Esta loja ainda não possui serviços disponíveis no catálogo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

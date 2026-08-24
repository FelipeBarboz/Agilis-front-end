"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getStoreById } from "@/lib/mocks/stores";
import { PageTransition } from "@/components/ui/motion";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Briefcase,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";

function StoreAboutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const storeId = searchParams.get("id") || searchParams.get("storeId") || "store-super-pinturas";

  const store = useMemo(() => getStoreById(storeId), [storeId]);

  return (
    <main className="flex flex-1 flex-col gap-6 overflow-y-auto bg-muted p-4 sm:p-6 lg:p-8">
      <PageTransition className="mx-auto w-full max-w-4xl flex flex-col gap-6">
        {/* Top bar com botão de voltar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card text-foreground shadow-xs ring-1 ring-foreground/10 transition-colors hover:bg-white active:scale-95"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Sobre {store.name}
            </h1>
            <p className="text-xs text-muted-foreground">
              Informações detalhadas, histórico e canais de atendimento
            </p>
          </div>
        </div>

        {/* Card Principal - Resumo da Loja */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-border/60 pb-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0D5C3A] text-white font-bold text-2xl shadow-md">
              {store.initials}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{store.name}</h2>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {store.category}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  {store.rating} ({store.reviewCount} avaliações)
                </span>
                <span>•</span>
                <span>{store.distance} da sua casa</span>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="pt-6">
            <h3 className="text-base font-semibold text-foreground mb-2">Sobre</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {store.about.description}
            </p>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="rounded-xl bg-muted/60 p-4 text-center">
              <Award className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{new Date().getFullYear() - store.about.foundedYear}+ Anos</p>
              <p className="text-xs text-muted-foreground">No mercado desde {store.about.foundedYear}</p>
            </div>
            <div className="rounded-xl bg-muted/60 p-4 text-center">
              <Briefcase className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{store.about.completedServices}+</p>
              <p className="text-xs text-muted-foreground">Serviços executados</p>
            </div>
            <div className="rounded-xl bg-muted/60 p-4 text-center">
              <ShieldCheck className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">Garantia</p>
              <p className="text-xs text-muted-foreground">Garantia e nota em todos os serviços</p>
            </div>
          </div>
        </Card>

        {/* Especialidades e Diferenciais */}
        <Card className="p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Especialidades</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {store.about.specialties.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 rounded-lg border border-border/70 p-3 text-sm">
                <CheckCircle2 size={16} className="text-primary shrink-0" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Horários e Localização */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Horários */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Horários de atendimento</h3>
            </div>
            <div className="space-y-3 text-sm">
              {store.about.openingHours.map((slot, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0 last:pb-0">
                  <span className="text-muted-foreground">{slot.days}</span>
                  <span className="font-medium text-foreground">{slot.hours}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Endereço e Contato */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Endereço & Contato</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-foreground font-medium">
                  {store.about.address.street}, {store.about.address.number}
                </p>
                <p className="text-xs text-muted-foreground">
                  {store.about.address.neighborhood} - {store.about.address.city}/{store.about.address.state}
                </p>
                <p className="text-xs text-muted-foreground">CEP: {store.about.address.cep}</p>
              </div>

              <div className="pt-2 border-t border-border/40 flex flex-col gap-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-primary" />
                  <span>{store.about.contact.phone} / {store.about.contact.whatsapp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-primary" />
                  <span>{store.about.contact.email}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>


      </PageTransition>
    </main>
  );
}

export default function StoreAboutPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center bg-muted p-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Carregando informações...</p>
          </div>
        </main>
      }
    >
      <StoreAboutContent />
    </Suspense>
  );
}

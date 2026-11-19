"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { type Service, mockServices } from "@/lib/mocks/services";
import { superPinturasServices } from "@/lib/mocks/stores";
import { getServiceById, getServicesByStoreId } from "@/lib/services/services-service";
import { ServiceInfo } from "./_components/service-info";
import { ServicePackages } from "./_components/service-packages";
import { ServiceStoreCard } from "./_components/service-store-card";
import { ScheduleButton } from "./_components/schedule-button";
import { ServiceReviews } from "./_components/service-reviews";
import { ServiceRelated } from "./_components/service-related";
import { PageTransition } from "@/components/ui/motion";

function ServiceDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const serviceId = params.serviceId as string;
  const storeIdParam = searchParams.get("storeId") ?? "";
  const companyParam = searchParams.get("company") ?? searchParams.get("providerName") ?? "";

  const [service, setService] = useState<Service | null>(null);
  const [storeServices, setStoreServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    getServiceById(serviceId, companyParam)
      .then((data) => {
        if (!isCancelled) {
          setService(data);
          setSelectedPrice(data.price.inicial);
          setSelectedPackage(data.packages[0]?.label ?? "Padrão");
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.warn(`[Services] Falha ao carregar serviço ${serviceId} da API:`, err);
          // Fallback para mock caso o ID seja de exemplo ou o backend esteja indisponível
          const all = [...mockServices, ...superPinturasServices];
          const localFallback = all.find((s) => s.id === serviceId);
          if (localFallback) {
            setService(localFallback);
            setSelectedPrice(localFallback.price.inicial);
            setSelectedPackage(localFallback.packages[0]?.label ?? "Padrão");
          } else {
            setService(null);
          }
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [serviceId, companyParam]);

  // Carrega os serviços associados a esta loja (GET /api/v1/services/store/{storeId})
  useEffect(() => {
    const targetStoreId = storeIdParam || service?.storeId;
    if (!targetStoreId) return;

    let isCancelled = false;
    getServicesByStoreId(targetStoreId, companyParam || service?.company)
      .then((items) => {
        if (!isCancelled) {
          setStoreServices(items);
        }
      })
      .catch((err) => {
        console.warn(`[Services] Falha ao carregar serviços da loja ${targetStoreId}:`, err);
      });

    return () => {
      isCancelled = true;
    };
  }, [storeIdParam, service?.storeId, service?.company, companyParam]);

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center bg-muted p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Carregando detalhes do serviço...</p>
        </div>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="flex flex-1 items-center justify-center bg-muted p-6">
        <div className="flex flex-col items-center gap-3 text-center rounded-2xl border bg-card p-8 shadow-xs ring-1 ring-foreground/10 max-w-sm">
          <p className="text-base font-semibold text-foreground">
            Serviço não encontrado
          </p>
          <p className="text-xs text-muted-foreground">
            O serviço que você está procurando não existe ou foi descontinuado.
          </p>
          <Link
            href="/services"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Voltar para o catálogo
          </Link>
        </div>
      </main>
    );
  }

  const effectiveStoreId = storeIdParam || service.storeId || "store-super-pinturas";
  const effectiveCompany = companyParam || service.company;

  return (
    <main className="relative flex flex-1 flex-col gap-6 bg-muted p-4 pt-14 sm:p-6 sm:pt-14 lg:p-8 lg:pt-8">
      {/* Seta de voltar para a tela de pesquisar serviços — Padrão Agilis */}
      <Link
        href="/services"
        aria-label="Voltar para pesquisar serviços"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-white cursor-pointer"
      >
        <ArrowLeft size={20} />
      </Link>

      <PageTransition className="flex flex-col gap-6 mx-auto w-full max-w-6xl">
        {/* Display Principal Horizontal em Grid (Layout Wide) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Coluna Esquerda (7 Colunas) — Imagens + Info no mesmo card + Pacotes */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Card Unificado: Fotos e Informações do Serviço */}
            <ServiceInfo service={service} />

            {/* Seleção de Pacotes */}
            <ServicePackages
              service={service}
              onSelect={(price, label) => {
                setSelectedPrice(price);
                setSelectedPackage(label);
              }}
            />
          </div>

          {/* Coluna Direita (5 Colunas) — Loja e Widget de Agendamento Fixo */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-6">
            {/* Card da Loja com Padrão Agilis e link para o perfil */}
            <ServiceStoreCard
              storeId={effectiveStoreId}
              companyName={effectiveCompany}
              storeServicesCount={storeServices.length}
            />

            {/* Card de Resumo de Preço e Agendamento */}
            <ScheduleButton
              serviceId={serviceId}
              storeId={effectiveStoreId}
              selectedPrice={selectedPrice || service.price.inicial}
              selectedPackage={selectedPackage || (service.packages[0]?.label ?? "Padrão")}
            />
          </div>
        </div>

        {/* Seção Horizontal 1: Avaliações e Comentários dos Usuários */}
        <ServiceReviews
          serviceId={serviceId}
          storeId={effectiveStoreId}
          initialRating={service.rating}
          reviewCount={service.reviewCount}
        />

        {/* Seção Horizontal 2: Outros Serviços da Mesma Loja e Serviços Recomendados */}
        <ServiceRelated
          currentServiceId={service.id}
          category={service.category}
          storeId={effectiveStoreId}
          storeServices={storeServices}
          storeName={effectiveCompany}
          city={service.city}
          state={service.state}
        />
      </PageTransition>
    </main>
  );
}

export default function ServiceDetailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center bg-muted p-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Carregando detalhes do serviço...</p>
          </div>
        </main>
      }
    >
      <ServiceDetailContent />
    </Suspense>
  );
}

"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { type Store } from "@/lib/mocks/stores";
import { type Service } from "@/lib/mocks/services";
import {
  getStoreBySlug,
  getStoreById,
  getStoreUnits,
  getStoreServiceArea,
  formatCnpj,
  type StoreProfileDTO,
} from "@/lib/services/stores-service";
import { fetchReviewsByReviewedId } from "@/lib/services/reviews-service";
import { getServicesByStoreId } from "@/lib/services/services-service";
import { StoreHeader } from "./_components/store-header";
import { StoreServices } from "./_components/store-services";
import { PageTransition } from "@/components/ui/motion";

function StorePageContent() {
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug")?.trim() || "";
  const idParam = (searchParams.get("id") ?? searchParams.get("storeId"))?.trim() || "";

  const [store, setStore] = useState<Store | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadPublicStore() {
      setIsLoading(true);
      setError(null);

      try {
        let profile: StoreProfileDTO | null = null;

        // 1. Tenta carregar pelo slug via GET /api/v1/stores/slug/{slug}
        if (slugParam) {
          try {
            profile = await getStoreBySlug(slugParam);
          } catch (slugErr) {
            console.warn(`[StorePage] Falha ao carregar loja por slug (${slugParam}):`, slugErr);
          }
        }

        // 2. Se não carregou por slug e temos id, tenta por ID
        if (!profile?.id && idParam) {
          try {
            profile = await getStoreById(idParam);
          } catch (idErr) {
            console.warn(`[StorePage] Falha ao carregar loja por ID (${idParam}):`, idErr);
            // Caso o idParam seja na verdade um slug
            try {
              profile = await getStoreBySlug(idParam);
            } catch {}
          }
        }

        if (!profile?.id) {
          throw new Error("Loja não encontrada ou indisponível.");
        }

        const storeId = profile.id;

        // 3. Busca em paralelo dados complementares reais: unidades, avaliações e área de atendimento
        const [unitsResult, reviewsResult, areaResult] =
          await Promise.allSettled([
            getStoreUnits(storeId),
            fetchReviewsByReviewedId(storeId),
            getStoreServiceArea(storeId),
          ]);

        if (isCancelled) return;

        const units = unitsResult.status === "fulfilled" ? unitsResult.value : [];
        const reviews = reviewsResult.status === "fulfilled" ? reviewsResult.value : [];
        const area = areaResult.status === "fulfilled" ? areaResult.value : null;

        const primaryUnit = units[0];
        const cityName = primaryUnit?.city || "";
        const stateName = primaryUnit?.state || "";

        // 4. Carrega serviços da loja enriquecidos com fotos, notas e localização reais
        const storeServices = await getServicesByStoreId(
          storeId,
          profile.storeName,
          { city: cityName, state: stateName }
        );

        if (isCancelled) return;

        // Calcula avaliação média real
        const reviewCount = reviews.length;
        const avgRating =
          reviewCount > 0
            ? Number(
                (
                  reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) /
                  reviewCount
                ).toFixed(1)
              )
            : 0;

        // Iniciais da loja
        const storeWords = profile.storeName.trim().split(/\s+/).filter(Boolean);
        const firstWord = storeWords[0] || "";
        const secondWord = storeWords[1] || "";
        const initials =
          firstWord && secondWord
            ? `${firstWord[0] || ""}${secondWord[0] || ""}`.toUpperCase()
            : profile.storeName.slice(0, 2).toUpperCase() || "AG";

        // Formatação de distância / área de atendimento
        let distanceText = "Atendimento local";
        if (area?.radiusKm) {
          distanceText = `Raio de ${area.radiusKm}km`;
        } else if (cityName) {
          distanceText = `${cityName}${stateName ? `, ${stateName}` : ""}`;
        }

        const foundedYear = profile.createdAt
          ? new Date(profile.createdAt).getFullYear()
          : new Date().getFullYear();

        const fullStore: Store = {
          id: profile.id,
          slug: profile.slug || slugParam || profile.id,
          name: profile.storeName,
          initials,
          category: "Prestador Verificado",
          distance: distanceText,
          rating: avgRating,
          reviewCount,
          isAvailable: true,
          availabilityText: "Disponível para agendamento",
          bannerUrl: undefined,
          logoUrl: profile.profileImgUrl || undefined,
          about: {
            description:
              profile.description ||
              "Loja e prestadora de serviços credenciada na plataforma Agilis.",
            foundedYear,
            completedServices: reviewCount,
            specialties: [],
            openingHours: [
              {
                days: "Segunda a Sexta",
                hours: "08:00 - 18:00",
              },
            ],
            address: {
              street: primaryUnit?.street || "",
              number: primaryUnit?.number || "",
              neighborhood: primaryUnit?.complement || "",
              city: cityName,
              state: stateName,
              cep: primaryUnit?.cep || "",
            },
            contact: {
              phone: profile.cnpj ? `CNPJ: ${formatCnpj(profile.cnpj)}` : "",
              whatsapp: "",
              email: "",
            },
          },
        };

        setStore(fullStore);
        setServices(storeServices);
        setIsLoading(false);
      } catch (err) {
        if (!isCancelled) {
          console.error("[StorePage] Erro ao carregar perfil público da loja:", err);
          setError("Não foi possível encontrar as informações desta loja.");
          setIsLoading(false);
        }
      }
    }

    void loadPublicStore();

    return () => {
      isCancelled = true;
    };
  }, [slugParam, idParam]);

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center bg-muted p-6 min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando perfil da loja...</p>
        </div>
      </main>
    );
  }

  if (error || !store) {
    return (
      <main className="flex flex-1 items-center justify-center bg-muted p-6 min-h-[60vh]">
        <div className="flex flex-col items-center text-center max-w-md gap-4 p-6 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex size-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Loja não encontrada</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {error || "Não conseguimos carregar os dados desta loja no momento."}
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors shadow-2xs"
          >
            <ArrowLeft size={16} />
            <span>Voltar para serviços</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6 bg-muted p-4 sm:p-6 lg:p-8">
      <PageTransition className="flex flex-col gap-6 mx-auto w-full max-w-6xl">
        {/* Cabeçalho da Loja com dados reais da API */}
        <StoreHeader store={store} />

        {/* Grade de serviços cadastrados na loja */}
        <StoreServices services={services} storeName={store.name} />
      </PageTransition>
    </main>
  );
}

export default function StorePage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center bg-muted p-6 min-h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Carregando loja...</p>
          </div>
        </main>
      }
    >
      <StorePageContent />
    </Suspense>
  );
}

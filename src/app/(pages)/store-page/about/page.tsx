"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/motion";
import {
  ArrowLeft,
  Clock,
  MapPin,
  FileText,
  Award,
  Briefcase,
  Star,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  getStoreBySlug,
  getStoreById,
  getStoreUnits,
  getStoreServiceArea,
  formatCnpj,
  type StoreProfileDTO,
  type StoreUnitResponse,
  type ServiceAreaResponse,
} from "@/lib/services/stores-service";
import { fetchReviewsByReviewedId } from "@/lib/services/reviews-service";

function StoreAboutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slugParam = searchParams.get("slug")?.trim() || "";
  const idParam = (searchParams.get("id") ?? searchParams.get("storeId"))?.trim() || "";

  const [profile, setProfile] = useState<StoreProfileDTO | null>(null);
  const [units, setUnits] = useState<StoreUnitResponse[]>([]);
  const [area, setArea] = useState<ServiceAreaResponse | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadAboutData() {
      setIsLoading(true);
      setError(null);

      try {
        let storeData: StoreProfileDTO | null = null;

        if (slugParam) {
          try {
            storeData = await getStoreBySlug(slugParam);
          } catch (err) {
            console.warn(`[StoreAbout] Falha ao carregar loja por slug (${slugParam}):`, err);
          }
        }

        if (!storeData?.id && idParam) {
          try {
            storeData = await getStoreById(idParam);
          } catch (err) {
            console.warn(`[StoreAbout] Falha ao carregar loja por ID (${idParam}):`, err);
            try {
              storeData = await getStoreBySlug(idParam);
            } catch {}
          }
        }

        if (!storeData?.id) {
          throw new Error("Loja não encontrada.");
        }

        const storeId = storeData.id;

        const [unitsRes, reviewsRes, areaRes] = await Promise.allSettled([
          getStoreUnits(storeId),
          fetchReviewsByReviewedId(storeId),
          getStoreServiceArea(storeId),
        ]);

        if (isCancelled) return;

        const loadedUnits = unitsRes.status === "fulfilled" ? unitsRes.value : [];
        const loadedReviews = reviewsRes.status === "fulfilled" ? reviewsRes.value : [];
        const loadedArea = areaRes.status === "fulfilled" ? areaRes.value : null;

        const count = loadedReviews.length;
        const avg =
          count > 0
            ? Number(
                (
                  loadedReviews.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) /
                  count
                ).toFixed(1)
              )
            : 0;

        setProfile(storeData);
        setUnits(loadedUnits);
        setArea(loadedArea);
        setRating(avg);
        setReviewCount(count);
        setIsLoading(false);
      } catch (err) {
        if (!isCancelled) {
          console.error("[StoreAbout] Erro ao carregar informações da loja:", err);
          setError("Não foi possível carregar as informações desta loja.");
          setIsLoading(false);
        }
      }
    }

    void loadAboutData();

    return () => {
      isCancelled = true;
    };
  }, [slugParam, idParam]);

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center bg-muted p-6 min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando informações...</p>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="flex flex-1 items-center justify-center bg-muted p-6 min-h-[60vh]">
        <div className="flex flex-col items-center text-center max-w-md gap-4 p-6 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex size-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Informações indisponíveis</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {error || "Não conseguimos localizar os dados desta loja."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors shadow-2xs"
          >
            <ArrowLeft size={16} />
            <span>Voltar</span>
          </button>
        </div>
      </main>
    );
  }

  const primaryUnit = units[0];
  const words = profile.storeName.trim().split(/\s+/).filter(Boolean);
  const firstWord = words[0] || "";
  const secondWord = words[1] || "";
  const initials =
    firstWord && secondWord
      ? `${firstWord[0] || ""}${secondWord[0] || ""}`.toUpperCase()
      : profile.storeName.slice(0, 2).toUpperCase() || "AG";

  const foundedYear = profile.createdAt
    ? new Date(profile.createdAt).getFullYear()
    : new Date().getFullYear();
  const currentYear = new Date().getFullYear();
  const yearsActive = Math.max(1, currentYear - foundedYear + 1);

  let coverageText = "Atendimento local";
  if (area?.radiusKm) {
    coverageText = `Raio de ${area.radiusKm}km`;
  } else if (primaryUnit?.city) {
    coverageText = `${primaryUnit.city}${primaryUnit.state ? `, ${primaryUnit.state}` : ""}`;
  }

  return (
    <main className="flex flex-1 flex-col gap-6 bg-muted p-4 sm:p-6 lg:p-8">
      <PageTransition className="mx-auto w-full max-w-4xl flex flex-col gap-6">
        {/* Top bar com botão de voltar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card text-foreground shadow-xs ring-1 ring-foreground/10 transition-colors hover:bg-muted active:scale-95"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Sobre {profile.storeName}
            </h1>
            <p className="text-xs text-muted-foreground">
              Informações cadastrais, atuação e canais de atendimento
            </p>
          </div>
        </div>

        {/* Card Principal - Resumo da Loja */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-border/60 pb-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0D5C3A] text-white font-bold text-2xl shadow-md overflow-hidden">
              {profile.profileImgUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.profileImgUrl}
                  alt={profile.storeName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{profile.storeName}</h2>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Prestador Verificado
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  {rating > 0 ? (
                    <>
                      {rating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? "avaliação" : "avaliações"})
                    </>
                  ) : (
                    "Novo (Sem avaliações)"
                  )}
                </span>
                <span>•</span>
                <span>{coverageText}</span>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="pt-6">
            <h3 className="text-base font-semibold text-foreground mb-2">Sobre</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {profile.description ||
                "Loja e prestadora de serviços cadastrada e credenciada na plataforma Agilis."}
            </p>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            <div className="rounded-xl bg-muted/60 p-4 text-center">
              <Award className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">
                {yearsActive} {yearsActive === 1 ? "Ano" : "Anos"}
              </p>
              <p className="text-xs text-muted-foreground">
                Cadastrado desde {foundedYear}
              </p>
            </div>
            <div className="rounded-xl bg-muted/60 p-4 text-center">
              <Briefcase className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{reviewCount}</p>
              <p className="text-xs text-muted-foreground">
                {reviewCount === 1 ? "Avaliação recebida" : "Avaliações recebidas"}
              </p>
            </div>
          </div>
        </Card>

        {/* Horários e Localização */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Horários de Atendimento */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Horários de atendimento</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Segunda a Sexta</span>
                <span className="font-medium text-foreground">08:00 - 18:00</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Sábado</span>
                <span className="font-medium text-foreground">08:00 - 12:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Domingo</span>
                <span className="font-medium text-muted-foreground">Fechado</span>
              </div>
            </div>
          </Card>

          {/* Endereço e Dados Cadastrais */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Localização & Registro</h3>
            </div>
            <div className="space-y-3 text-sm">
              {primaryUnit?.street ? (
                <div>
                  <p className="text-foreground font-medium">
                    {primaryUnit.street}
                    {primaryUnit.number ? `, ${primaryUnit.number}` : ""}
                  </p>
                  {primaryUnit.complement && (
                    <p className="text-xs text-muted-foreground">{primaryUnit.complement}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {primaryUnit.city || ""}{primaryUnit.state ? `/${primaryUnit.state}` : ""}
                    {primaryUnit.cep ? ` - CEP: ${primaryUnit.cep}` : ""}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-foreground font-medium">
                    {primaryUnit?.city ? `${primaryUnit.city}/${primaryUnit.state || "SP"}` : "Atendimento Regional"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Atendimento no local do cliente e áreas cadastradas.
                  </p>
                </div>
              )}

              {profile.cnpj && (
                <div className="pt-2 border-t border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText size={14} className="text-primary shrink-0" />
                  <span>CNPJ: {formatCnpj(profile.cnpj)}</span>
                </div>
              )}
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
        <main className="flex flex-1 items-center justify-center bg-muted p-6 min-h-[60vh]">
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

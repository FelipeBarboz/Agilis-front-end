"use client";

import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle, X } from "lucide-react";
import { ApiError } from "@/lib/api";
import {
  getStoreServiceById,
  updateService,
  deleteService,
  fetchServiceImages,
  deleteServiceImage,
  fetchServicePriceTiers,
  setServicePriceTiers,
  fetchServiceCoverageAreas,
  setServiceCoverageAreas,
  type ServicePriceTierInput,
  type ServiceCoverageAreaInput,
} from "@/lib/services/services-service";
import { getMyStores } from "@/lib/services/stores-service";
import { getStoredUser } from "@/lib/auth/token-storage";
import {
  getBookingsByService,
  cancelBooking,
  requestRefund,
} from "@/lib/services/bookings-service";
import { sendBookingMessage } from "@/lib/services/messages-service";
import { EditServiceHeader } from "../_components/edit-service-header";
import { ServiceMainPhoto } from "../../add-service/_components/service-main-photo";
import { ServiceInfoCard } from "../../add-service/_components/service-info-card";
import {
  ServicePricingCard,
  type PriceType,
} from "../../add-service/_components/service-pricing-card";
import { ServicePriceTiersCard } from "../../add-service/_components/service-price-tiers-card";
import { ServiceCoverageAreasCard } from "../../add-service/_components/service-coverage-areas-card";
import { ServiceAdditionalPhotos } from "../../add-service/_components/service-additional-photos";
import { ServiceFormActions } from "../../add-service/_components/service-form-actions";

interface AdditionalPhotoItem {
  id?: string;
  url: string;
}

/** Converte o valor monetário "R$ 150,00" → número 150 */
function parsePriceString(priceStr: string): number {
  if (!priceStr) return 0;
  const cleaned = priceStr
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return parseFloat(cleaned) || 0;
}

/** Formata número 150 → "R$ 150,00" */
function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params?.serviceId as string;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFilesRef = useRef<HTMLInputElement>(null);

  // IDs resolvidos em runtime
  const [storeId, setStoreId] = useState<string>("");
  const [serviceName, setServiceName] = useState<string>("Serviço");

  // Estados do formulário
  const [name, setName] = useState("");
  const [category, setCategory] = useState("LIMPEZA");
  const [description, setDescription] = useState("");
  const [priceType, setPriceType] = useState<PriceType>("FIXED");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("60");

  // Fotos
  const [mainPhotoPreview, setMainPhotoPreview] = useState<string | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<
    AdditionalPhotoItem[]
  >([]);

  // Faixas de preço e áreas de cobertura
  const [priceTiers, setPriceTiers] = useState<ServicePriceTierInput[]>([]);
  const [coverageAreas, setCoverageAreas] = useState<ServiceCoverageAreaInput[]>([]);

  // Estados de feedback
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Resolve storeId e carrega o serviço + imagens
  useEffect(() => {
    if (!serviceId) return;

    let isMounted = true;

    async function loadService() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        let resolvedStoreId = "";
        try {
          const stored = localStorage.getItem("current_store_id");
          if (stored && !stored.startsWith("store-super")) {
            resolvedStoreId = stored;
          }
        } catch {
          // localStorage indisponível (SSR guard)
        }

        if (!resolvedStoreId) {
          const stores = await getMyStores();
          if (stores.length > 0 && stores[0]?.storeId) {
            resolvedStoreId = stores[0].storeId;
          }
        }

        if (!resolvedStoreId) {
          if (isMounted)
            setErrorMessage("Loja não encontrada. Faça login novamente.");
          return;
        }

        if (isMounted) setStoreId(resolvedStoreId);

        const [data, gallery, tiers, areas] = await Promise.all([
          getStoreServiceById(resolvedStoreId, serviceId),
          fetchServiceImages(resolvedStoreId, serviceId),
          fetchServicePriceTiers(serviceId),
          fetchServiceCoverageAreas(serviceId),
        ]);

        if (!isMounted) return;

        if (Array.isArray(tiers) && tiers.length > 0) {
          setPriceTiers(
            [...tiers]
              .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
              .map((t) => ({
                name: t.name,
                description: t.description || "",
                price: Number(t.price) || 0,
              }))
          );
        }

        if (Array.isArray(areas) && areas.length > 0) {
          setCoverageAreas(
            areas.map((a) => ({ city: a.city, state: a.state }))
          );
        }

        setServiceName(data.title);
        setName(data.title);
        setDescription(data.description);
        setCategory((data.category ?? "LIMPEZA").toUpperCase());

        const rawPriceType = String(data.priceType ?? "FIXED").toUpperCase();
        setPriceType(
          rawPriceType === "FIXED"
            ? "FIXED"
            : rawPriceType === "HOURLY"
            ? "HOURLY"
            : "QUOTE"
        );

        setPrice(formatPrice(Number(data.price) || 0));
        setDuration(String(data.durationMinutes ?? 60));

        if (Array.isArray(gallery) && gallery.length > 0) {
          setAdditionalPhotos(
            gallery.map((img) => ({ id: img.id, url: img.url }))
          );
        }
      } catch (err) {
        if (!isMounted) return;
        const msg =
          err instanceof Error ? err.message : "Erro ao carregar serviço.";
        setErrorMessage(msg);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadService();
    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  // Handlers de foto
  const handleMainPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMainPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemoveMainPhoto = () => {
    setMainPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAdditionalPhotosChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remainingSlots = 5 - additionalPhotos.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);
    setAdditionalPhotos((prev) => [
      ...prev,
      ...filesToAdd.map((f) => ({ url: URL.createObjectURL(f) })),
    ]);
    if (additionalFilesRef.current) additionalFilesRef.current.value = "";
  };

  const handleRemoveAdditionalPhoto = async (index: number) => {
    const target = additionalPhotos[index];
    if (target?.id && storeId) {
      try {
        await deleteServiceImage(storeId, serviceId, target.id);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Não foi possível remover a imagem do servidor.";
        setErrorMessage(msg);
        return;
      }
    }
    setAdditionalPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit — chama PUT /api/v1/stores/{storeId}/services/{serviceId}
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Por favor, preencha o nome do serviço.");
      return;
    }
    if (!price.trim()) {
      setErrorMessage("Por favor, informe o valor do serviço.");
      return;
    }
    if (!storeId) {
      setErrorMessage("Loja não identificada. Recarregue a página.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = getStoredUser();
      await updateService(storeId, serviceId, {
        requesterId: user?.id,
        serviceId,
        title: name.trim(),
        description: description.trim(),
        price: parsePriceString(price),
        priceType,
        durationMinutes: parseInt(duration, 10) || 60,
        category,
      });

      const validTiers = priceTiers.filter(
        (t) => t.name.trim().length > 0 && t.price > 0
      );
      await Promise.all([
        setServicePriceTiers(serviceId, validTiers).catch((err) =>
          console.warn("[EditService] Erro ao atualizar faixas de preço:", err)
        ),
        setServiceCoverageAreas(serviceId, coverageAreas).catch((err) =>
          console.warn("[EditService] Erro ao atualizar áreas de cobertura:", err)
        ),
      ]);

      setSuccess(true);
      setTimeout(() => {
        router.push("/store/store-profile");
      }, 1500);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Erro ao salvar serviço.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete — chama DELETE /api/v1/stores/{storeId}/services/{serviceId}
  const handleDeleteService = async () => {
    if (!storeId || !serviceId || isDeleting) return;

    setIsDeleting(true);
    setErrorMessage(null);

    const currentUser = getStoredUser();
    const senderId = currentUser?.id ?? storeId;

    try {
      // 1ª tentativa: excluir direto
      try {
        // Remove imagens da galeria antes (evita conflito de FK)
        for (const img of additionalPhotos) {
          if (img.id) {
            try {
              await deleteServiceImage(storeId, serviceId, img.id);
            } catch {
              // ignora — segue mesmo se imagem falhar
            }
          }
        }
        await deleteService(storeId, serviceId);
        setShowDeleteModal(false);
        router.push("/store/store-profile");
        return;
      } catch (firstErr) {
        // Só tenta o fluxo de cancelamento se for 500 (bookings vinculados)
        const is500 =
          firstErr instanceof ApiError && firstErr.status >= 500;
        if (!is500) throw firstErr;
      }

      // 2ª tentativa: cancelar agendamentos, reembolsar e notificar clientes
      setErrorMessage(null); // limpa msg anterior enquanto processa

      let bookings: Awaited<ReturnType<typeof getBookingsByService>> = [];
      try {
        bookings = await getBookingsByService(serviceId);
      } catch {
        // Se não conseguir buscar os agendamentos, lança erro final
        throw new Error(
          "Não foi possível buscar os agendamentos vinculados ao serviço."
        );
      }

      const ACTIVE_STATUSES = new Set([
        "PENDING",
        "CONFIRMED",
        "AGENDADO",
        "EM_ANDAMENTO",
        "IN_PROGRESS",
      ]);

      const activeBookings = bookings.filter((b) =>
        ACTIVE_STATUSES.has(String(b.status).toUpperCase())
      );

      // Para cada agendamento ativo: cancelar → reembolsar → notificar
      await Promise.allSettled(
        activeBookings.map(async (booking) => {
          const bookingId = booking.bookingId;
          const clientId = booking.clientId;

          try {
            await cancelBooking(bookingId);
          } catch {
            // ignora — tenta reembolso mesmo assim
          }

          try {
            await requestRefund(
              bookingId,
              "O serviço foi descontinuado pelo prestador. Reembolso solicitado automaticamente."
            );
          } catch {
            // ignora — tenta mensagem mesmo assim
          }

          if (clientId) {
            try {
              await sendBookingMessage({
                bookingId,
                senderId,
                receiverId: clientId,
                content:
                  `Olá! Lamentamos informar que o serviço "${serviceName}" foi descontinuado. ` +
                  "O seu agendamento foi cancelado e o reembolso foi solicitado automaticamente. " +
                  "Pedimos desculpas pelo inconveniente.",
              });
            } catch {
              // ignora — mensagem é best-effort
            }
          }
        })
      );

      // 3ª tentativa: excluir o serviço após limpeza
      try {
        await deleteService(storeId, serviceId);
        setShowDeleteModal(false);
        router.push("/store/store-profile");
      } catch (finalErr) {
        const msg =
          finalErr instanceof ApiError
            ? `Não foi possível excluir o serviço (${finalErr.status}). Os agendamentos foram cancelados, mas o serviço permanece ativo.`
            : "Erro ao excluir o serviço após cancelar os agendamentos.";
        setErrorMessage(msg);
        setShowDeleteModal(false);
        setIsDeleting(false);
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erro inesperado ao excluir o serviço.";
      setErrorMessage(msg);
      setShowDeleteModal(false);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-muted py-24">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Carregando serviço…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        <EditServiceHeader
          serviceName={serviceName}
          onBack={() => router.back()}
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <ServiceMainPhoto
            inputRef={fileInputRef}
            preview={mainPhotoPreview}
            onChange={handleMainPhotoChange}
            onRemove={handleRemoveMainPhoto}
          />

          <ServiceInfoCard
            name={name}
            description={description}
            category={category}
            onNameChange={setName}
            onDescriptionChange={setDescription}
            onCategoryChange={setCategory}
          />

          <ServicePricingCard
            priceType={priceType}
            price={price}
            duration={duration}
            onPriceTypeChange={setPriceType}
            onPriceChange={setPrice}
            onDurationChange={setDuration}
          />

          <ServicePriceTiersCard
            tiers={priceTiers}
            onChange={setPriceTiers}
          />

          <ServiceCoverageAreasCard
            areas={coverageAreas}
            onChange={setCoverageAreas}
          />

          <ServiceAdditionalPhotos
            photos={additionalPhotos.map((p) => p.url)}
            maxPhotos={5}
            inputRef={additionalFilesRef}
            onAddPhotos={handleAdditionalPhotosChange}
            onRemovePhoto={(idx) => {
              void handleRemoveAdditionalPhoto(idx);
            }}
          />

          <ServiceFormActions
            isSubmitting={isSubmitting}
            success={success}
            errorMessage={errorMessage}
            submitLabel="Salvar Alterações"
            submittingLabel="Salvando…"
            onCancel={() => router.back()}
          />

          {/* Excluir Serviço */}
          <div className="pt-2 border-t border-border/60 flex justify-start">
            <button
              type="button"
              disabled={isDeleting || isSubmitting}
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="size-4" />
              <span>Excluir Serviço</span>
            </button>
          </div>
        </form>
      </main>

      {/* Modal de confirmação de exclusão (sem window.confirm) */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => !isDeleting && setShowDeleteModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 text-destructive">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-destructive/10 shrink-0">
                  <AlertTriangle className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Excluir Serviço
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="text-sm text-foreground leading-relaxed">
              Tem certeza que deseja excluir o serviço{" "}
              <strong>{serviceName}</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => void handleDeleteService()}
                className="inline-flex items-center gap-2 rounded-xl bg-destructive px-4 py-2 text-xs font-semibold text-white hover:bg-destructive/90 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <span>Confirmar Exclusão</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

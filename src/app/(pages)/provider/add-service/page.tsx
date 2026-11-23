"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import {
  getMyStores,
  getStoreUnits,
  getAuthenticatedUserId,
  type MyStore,
  type StoreUnitResponse,
} from "@/lib/services/stores-service";
import {
  createService,
  updateServiceThumbnail,
  addServiceImage,
  type CreateServicePayload,
} from "@/lib/services/services-service";
import { AddServiceHeader } from "./_components/add-service-header";
import { ServiceStoreUnitCard } from "./_components/service-store-unit-card";
import { ServiceMainPhoto } from "./_components/service-main-photo";
import { ServiceInfoCard } from "./_components/service-info-card";
import {
  ServicePricingCard,
  type PriceType,
} from "./_components/service-pricing-card";
import { ServiceAdditionalPhotos } from "./_components/service-additional-photos";
import { ServiceFormActions } from "./_components/service-form-actions";

function parsePriceToNumber(priceStr: string): number {
  if (!priceStr) return 0;
  const digits = priceStr.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
}

function parseDurationMinutes(durationStr: string): number {
  if (!durationStr || durationStr === "custom") return 0;
  const num = parseInt(durationStr, 10);
  return isNaN(num) ? 0 : num;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Falha ao ler arquivo"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function AddServiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, supabaseUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFilesRef = useRef<HTMLInputElement>(null);

  // Lojas e Unidades
  const [stores, setStores] = useState<MyStore[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [units, setUnits] = useState<StoreUnitResponse[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);

  // Estados do formulário
  const [name, setName] = useState("");
  const [category, setCategory] = useState("LIMPEZA");
  const [description, setDescription] = useState("");
  const [priceType, setPriceType] = useState<PriceType>("FIXED");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  // Fotos
  const [mainPhotoPreview, setMainPhotoPreview] = useState<string | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);

  // Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Carrega lojas do usuário
  useEffect(() => {
    let isMounted = true;

    async function loadStores() {
      try {
        setIsLoadingStores(true);
        const myStores = await getMyStores();
        if (!isMounted) return;

        setStores(myStores);

        const queryStoreId = searchParams.get("storeId");
        const storedStoreId =
          (typeof window !== "undefined" &&
            (localStorage.getItem("current_store_id") ||
              sessionStorage.getItem("form_storeId"))) ||
          "";

        // Determina qual loja selecionar
        let targetStoreId = "";
        if (queryStoreId && myStores.some((s) => s.storeId === queryStoreId)) {
          targetStoreId = queryStoreId;
        } else if (storedStoreId && myStores.some((s) => s.storeId === storedStoreId)) {
          targetStoreId = storedStoreId;
        } else if (myStores.length > 0 && myStores[0]) {
          targetStoreId = myStores[0].storeId;
        } else if (storedStoreId) {
          targetStoreId = storedStoreId;
        }

        setSelectedStoreId(targetStoreId);
        if (targetStoreId && typeof window !== "undefined") {
          localStorage.setItem("current_store_id", targetStoreId);
        }
      } catch (err) {
        console.warn("[AddService] Erro ao carregar lojas:", err);
      } finally {
        if (isMounted) setIsLoadingStores(false);
      }
    }

    void loadStores();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // Carrega unidades da loja selecionada
  const loadUnits = useCallback(async (storeId: string) => {
    if (!storeId) {
      setUnits([]);
      setSelectedUnitId("");
      return;
    }

    try {
      setIsLoadingUnits(true);
      const storeUnits = await getStoreUnits(storeId);
      setUnits(storeUnits);

      const queryUnitId = searchParams.get("unitId");
      if (
        queryUnitId &&
        storeUnits.some((u) => (u.unitId || u.id) === queryUnitId)
      ) {
        setSelectedUnitId(queryUnitId);
      } else if (storeUnits.length > 0 && storeUnits[0]) {
        setSelectedUnitId(storeUnits[0].unitId || storeUnits[0].id || "");
      } else {
        setSelectedUnitId("");
      }
    } catch (err) {
      console.warn("[AddService] Erro ao carregar unidades:", err);
      setUnits([]);
      setSelectedUnitId("");
    } finally {
      setIsLoadingUnits(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedStoreId) {
      void loadUnits(selectedStoreId);
    }
  }, [selectedStoreId, loadUnits]);

  const handleStoreChange = (newStoreId: string) => {
    setSelectedStoreId(newStoreId);
    if (typeof window !== "undefined") {
      localStorage.setItem("current_store_id", newStoreId);
    }
  };

  const handleMainPhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setMainPhotoPreview(dataUrl);
      } catch {
        const url = URL.createObjectURL(file);
        setMainPhotoPreview(url);
      }
    }
  };

  const handleRemoveMainPhoto = () => {
    setMainPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAdditionalPhotosChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 5 - additionalPhotos.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    const newPreviews = await Promise.all(
      filesToAdd.map(async (file) => {
        try {
          return await readFileAsDataUrl(file);
        } catch {
          return URL.createObjectURL(file);
        }
      })
    );

    setAdditionalPhotos((prev) => [...prev, ...newPreviews]);
    if (additionalFilesRef.current) {
      additionalFilesRef.current.value = "";
    }
  };

  const handleRemoveAdditionalPhoto = (index: number) => {
    setAdditionalPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validações
    if (!name.trim()) {
      setErrorMessage("Por favor, preencha o nome do serviço.");
      return;
    }

    const numericPrice = parsePriceToNumber(price);
    if (priceType !== "VARIABLE" && numericPrice <= 0) {
      setErrorMessage("Por favor, informe um valor válido para o serviço.");
      return;
    }

    if (!selectedStoreId) {
      setErrorMessage("Nenhuma loja selecionada. Cadastre ou selecione uma loja primeiro.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Obtém requesterId
      let requesterId = user?.id || supabaseUser?.id || "";
      if (!requesterId) {
        requesterId = await getAuthenticatedUserId();
      }

      // Se unitId não estiver definido mas tiver unidades, usa a primeira; senão usa storeId
      const effectiveUnitId =
        selectedUnitId ||
        units[0]?.unitId ||
        units[0]?.id ||
        selectedStoreId;

      const payload: CreateServicePayload = {
        requesterId: requesterId || selectedStoreId,
        storeId: selectedStoreId,
        unitId: effectiveUnitId,
        title: name.trim(),
        description: description.trim(),
        price: numericPrice,
        priceType,
        durationMinutes: parseDurationMinutes(duration),
        category: category.trim().toUpperCase(),
      };

      const created = await createService(selectedStoreId, payload);
      const newServiceId = (
        created?.id ||
        (created as unknown as { serviceId?: string })?.serviceId ||
        ""
      ).trim();

      // Envia foto principal (thumbnail) se houver
      if (mainPhotoPreview && newServiceId) {
        try {
          await updateServiceThumbnail(selectedStoreId, newServiceId, {
            requesterId: requesterId || selectedStoreId,
            serviceId: newServiceId,
            url: mainPhotoPreview.trim(),
          });
        } catch (thumbErr) {
          console.warn("[AddService] Erro ao enviar foto principal (thumbnail):", thumbErr);
        }
      }

      // Envia fotos adicionais (images) se houver
      if (additionalPhotos.length > 0 && newServiceId) {
        for (const photoUrl of additionalPhotos) {
          if (photoUrl && photoUrl.trim()) {
            try {
              await addServiceImage(selectedStoreId, newServiceId, {
                requesterId: requesterId || selectedStoreId,
                serviceId: newServiceId,
                url: photoUrl.trim(),
              });
            } catch (imgErr) {
              console.warn("[AddService] Erro ao enviar foto adicional:", imgErr);
            }
          }
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/store/store-profile?storeId=${encodeURIComponent(selectedStoreId)}`);
      }, 1500);
    } catch (err: unknown) {
      console.error("[AddService] Erro ao cadastrar serviço:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao cadastrar o serviço. Tente novamente.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        <AddServiceHeader onBack={() => router.back()} />

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <ServiceStoreUnitCard
            stores={stores}
            selectedStoreId={selectedStoreId}
            onStoreChange={handleStoreChange}
            units={units}
            selectedUnitId={selectedUnitId}
            onUnitChange={setSelectedUnitId}
            isLoadingStores={isLoadingStores}
            isLoadingUnits={isLoadingUnits}
          />

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

          <ServiceAdditionalPhotos
            photos={additionalPhotos}
            maxPhotos={5}
            inputRef={additionalFilesRef}
            onAddPhotos={handleAdditionalPhotosChange}
            onRemovePhoto={handleRemoveAdditionalPhoto}
          />

          <ServiceFormActions
            isSubmitting={isSubmitting}
            submittingLabel="Publicando serviço e imagens..."
            success={success}
            errorMessage={errorMessage}
            onCancel={() => router.back()}
          />
        </form>
      </main>
    </div>
  );
}

export default function AddServicePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-1 items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <p className="text-sm font-medium text-muted-foreground">
              Carregando formulário...
            </p>
          </div>
        </div>
      }
    >
      <AddServiceForm />
    </Suspense>
  );
}

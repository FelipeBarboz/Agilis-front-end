"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { CreateStoreHeader } from "./_components/create-store-header";
import { CreateStoreProgress } from "./_components/create-store-progress";
import {
  CreateStoreStepsList,
  STORE_CREATION_STEPS,
  type StoreStepKey,
} from "./_components/create-store-steps-list";
import { CreateStoreFinalizeCard } from "./_components/create-store-finalize-card";
import {
  createStore,
  createStoreUnit,
  configureStoreServiceArea,
  getAuthenticatedUserId,
  formatCnpj,
  formatCep,
  type CreateStorePayload,
  type CreateStoreUnitPayload,
  type ConfigureServiceAreaPayload,
  type AttendanceType,
  type ValidRadiusKm,
} from "@/lib/services/stores-service";

export default function CreateStorePage() {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [status, setStatus] = useState<Record<StoreStepKey, boolean>>({
    basicInfos: false,
    enterpriseInfos: false,
    attendanceArea: false,
    storeDescription: false,
    enterprisePhotos: false,
  });

  useEffect(() => {
    // Limpa registros antigos do localStorage de protótipos anteriores
    localStorage.removeItem("form_basicInfos");
    localStorage.removeItem("form_enterpriseInfos");
    localStorage.removeItem("form_attendanceArea");
    localStorage.removeItem("form_storeDescription");
    localStorage.removeItem("form_enterprisePhotos");
    sessionStorage.removeItem("form_storeId");
    sessionStorage.removeItem("form_positionId");

    setMounted(true);
    setStatus({
      basicInfos: sessionStorage.getItem("form_basicInfos") === "true",
      enterpriseInfos: sessionStorage.getItem("form_enterpriseInfos") === "true",
      attendanceArea: sessionStorage.getItem("form_attendanceArea") === "true",
      storeDescription:
        sessionStorage.getItem("form_storeDescription") === "true",
      enterprisePhotos:
        sessionStorage.getItem("form_enterprisePhotos") === "true",
    });
  }, []);

  const totalSteps = STORE_CREATION_STEPS.length;
  const completedSteps = Object.values(status).filter(Boolean).length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  const isAllCompleted = mounted && completedSteps === totalSteps;

  const handleFinishStoreCreation = async () => {
    if (!isAllCompleted || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      // 1. Obtém o userId autenticado
      const userId = await getAuthenticatedUserId();
      if (!userId) {
        throw new Error(
          "Você precisa estar autenticado para criar uma loja. Por favor, faça login novamente."
        );
      }

      // 2. Extrai dados salvos das etapas
      const storeName = sessionStorage.getItem("provider_storeName") || "";
      const slug =
        sessionStorage.getItem("provider_slug") ||
        storeName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      const rawCnpj =
        sessionStorage.getItem("provider_cnpj") ||
        localStorage.getItem("provider_cnpj") ||
        "";
      const cnpj = formatCnpj(rawCnpj);
      const unitName =
        sessionStorage.getItem("provider_unitName") ||
        localStorage.getItem("provider_unitName") ||
        "";
      const description =
        sessionStorage.getItem("provider_description") || "Loja prestadora de serviços";
      const profileImgUrl =
        sessionStorage.getItem("provider_profileImgUrl") ||
        "https://images.unsplash.com/photo-1556742049-0a67c5574f73";

      if (!storeName.trim()) {
        throw new Error(
          "O nome da loja não foi informado. Por favor, revise a etapa 'Informações básicas'."
        );
      }

      if (!unitName.trim()) {
        throw new Error(
          "O nome da unidade não foi informado. Por favor, revise a etapa 'Informações da empresa'."
        );
      }

      if (!cnpj.trim() || cnpj.replace(/\D/g, "").length !== 14) {
        throw new Error(
          "CNPJ não informado ou inválido. O formato esperado é 00.000.000/0000-00. Por favor, revise a etapa 'Informações da empresa'."
        );
      }

      // 3. Extrai área de atendimento e endereço
      let attendanceData = {
        attendanceType: "ON_CLIENT" as AttendanceType,
        radiusKm: 10,
        referenceAddress: "",
        street: "",
        number: "",
        complement: "",
        city: "",
        state: "",
        cep: "",
        cities: [{ city: "Guarulhos", state: "SP" }],
      };

      const rawAttendance = sessionStorage.getItem("form_attendanceArea_data");
      if (rawAttendance) {
        try {
          const parsed = JSON.parse(rawAttendance);
          if (parsed.attendanceType) attendanceData.attendanceType = parsed.attendanceType;
          if (parsed.radiusKm !== undefined) attendanceData.radiusKm = Number(parsed.radiusKm);
          if (parsed.referenceAddress) attendanceData.referenceAddress = parsed.referenceAddress;
          if (parsed.street) attendanceData.street = parsed.street;
          if (parsed.number) attendanceData.number = parsed.number;
          if (parsed.complement) attendanceData.complement = parsed.complement;
          if (parsed.city) attendanceData.city = parsed.city;
          if (parsed.state) attendanceData.state = parsed.state;
          if (parsed.cep) attendanceData.cep = parsed.cep;
          if (Array.isArray(parsed.cities) && parsed.cities.length > 0) {
            attendanceData.cities = parsed.cities;
          }
        } catch {}
      }

      const street =
        attendanceData.street ||
        sessionStorage.getItem("provider_street") ||
        localStorage.getItem("provider_street") ||
        "";
      const number =
        attendanceData.number ||
        sessionStorage.getItem("provider_number") ||
        localStorage.getItem("provider_number") ||
        "";
      const complement =
        attendanceData.complement ||
        sessionStorage.getItem("provider_complement") ||
        localStorage.getItem("provider_complement") ||
        "";
      const city =
        attendanceData.city ||
        sessionStorage.getItem("provider_city") ||
        localStorage.getItem("provider_city") ||
        "";
      const state =
        attendanceData.state ||
        sessionStorage.getItem("provider_state") ||
        localStorage.getItem("provider_state") ||
        "";
      const cep =
        attendanceData.cep ||
        sessionStorage.getItem("provider_cep") ||
        localStorage.getItem("provider_cep") ||
        "";

      const isAddressRequired = attendanceData.attendanceType !== "ON_CLIENT";
      if (isAddressRequired && !street.trim()) {
        throw new Error(
          "O endereço completo (rua, número, cidade, estado, CEP) da unidade é obrigatório para atendimento em local fixo ou híbrido."
        );
      }

      // 4. Cria a loja: POST /api/v1/stores
      const storePayload: CreateStorePayload = {
        userId,
        cnpj,
        storeName: storeName.trim(),
        slug: slug.trim(),
        description: description.trim(),
        profileImgUrl: profileImgUrl.trim(),
      };

      const createdStore = await createStore(storePayload);
      const storeId =
        (createdStore.id || createdStore.storeId || "").trim();

      if (!storeId) {
        throw new Error(
          "A loja foi criada, mas o servidor não retornou um identificador válido."
        );
      }

      // 5. Cria a unidade da loja: POST /api/v1/stores/{storeId}/units
      const unitPayload: CreateStoreUnitPayload = {
        cnpj,
        name: unitName.trim(),
        attendanceType: attendanceData.attendanceType,
        street: street.trim() || null,
        number: number.trim() || null,
        complement: complement.trim() || null,
        city: city.trim() || null,
        state: state.trim() ? state.trim().toUpperCase().slice(0, 2) : null,
        cep: cep.trim() ? formatCep(cep) : null,
      };

      await createStoreUnit(storeId, unitPayload);

      // 6. Configura a área de atendimento: PUT /api/v1/stores/{storeId}/service-area
      const validRadius: ValidRadiusKm = [5, 10, 20, 50].includes(Number(attendanceData.radiusKm))
        ? (Number(attendanceData.radiusKm) as ValidRadiusKm)
        : 10;

      const serviceAreaPayload: ConfigureServiceAreaPayload = {
        attendanceType: attendanceData.attendanceType,
        radiusKm: attendanceData.attendanceType === "FIXED_LOCATION" ? null : validRadius,
        cities: Array.isArray(attendanceData.cities)
          ? attendanceData.cities.map((c) => ({
              city: c.city.trim(),
              state: (c.state || "SP").trim().toUpperCase().slice(0, 2),
            }))
          : [],
      };

      await configureStoreServiceArea(storeId, serviceAreaPayload);

      // 6. Persiste identificadores e flags no storage local
      localStorage.setItem("current_store_id", storeId);
      sessionStorage.setItem("form_storeId", storeId);
      localStorage.setItem("has_active_store", "true");
      localStorage.setItem("is_provider", "true");

      // 7. Limpa rascunhos de criação
      sessionStorage.removeItem("form_basicInfos");
      sessionStorage.removeItem("form_enterpriseInfos");
      sessionStorage.removeItem("form_attendanceArea");
      sessionStorage.removeItem("form_attendanceArea_data");
      sessionStorage.removeItem("form_storeDescription");
      sessionStorage.removeItem("form_enterprisePhotos");
      sessionStorage.removeItem("provider_storeName");
      sessionStorage.removeItem("provider_slug");
      sessionStorage.removeItem("provider_unitName");
      sessionStorage.removeItem("provider_cnpj");
      sessionStorage.removeItem("provider_street");
      sessionStorage.removeItem("provider_number");
      sessionStorage.removeItem("provider_complement");
      sessionStorage.removeItem("provider_city");
      sessionStorage.removeItem("provider_state");
      sessionStorage.removeItem("provider_cep");
      sessionStorage.removeItem("provider_referenceAddress");
      sessionStorage.removeItem("provider_description");
      sessionStorage.removeItem("provider_profileImgUrl");
      localStorage.removeItem("provider_unitName");
      localStorage.removeItem("provider_street");
      localStorage.removeItem("provider_number");
      localStorage.removeItem("provider_complement");
      localStorage.removeItem("provider_city");
      localStorage.removeItem("provider_state");
      localStorage.removeItem("provider_cep");
      localStorage.removeItem("provider_referenceAddress");

      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("auth-change"));

      // 8. Redireciona para o perfil da loja recém-criada
      window.location.href = "/store/store-profile";
    } catch (err: unknown) {
      console.error("[CreateStorePage] Erro ao criar loja:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao criar loja. Verifique os dados e tente novamente.";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      {/* Conteúdo Principal */}
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        <CreateStoreHeader />

        {errorMessage && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-medium text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <CreateStoreProgress
          completedSteps={completedSteps}
          totalSteps={totalSteps}
          progressPercentage={progressPercentage}
        />

        <CreateStoreStepsList mounted={mounted} status={status} />

        <CreateStoreFinalizeCard
          isAllCompleted={isAllCompleted}
          onFinish={handleFinishStoreCreation}
          isLoading={isSubmitting}
        />
      </main>
    </div>
  );
}

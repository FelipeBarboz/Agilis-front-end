"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  AttendanceTypeSelector,
  type AttendanceType,
} from "./attendance-type-selector";
import { AttendanceRadiusField } from "./attendance-radius-field";
import { AttendanceCitiesField } from "./attendance-cities-field";
import { AttendanceFormActions } from "./attendance-form-actions";
import {
  createStorePosition,
  updateStorePosition,
  getStorePosition,
  parseCityString,
  formatCityString,
} from "@/lib/services/store-positions-service";
import type { CreateStorePositionPayload, UpdateStorePositionPayload } from "@/types/store-position";

export function AttendanceTypeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Permite receber storeId e positionId por query string ou localStorage/sessionStorage
  const queryStoreId = searchParams.get("storeId");
  const queryPositionId = searchParams.get("positionId");
  const fromSettings = searchParams.get("from") === "settings";

  const [storeId, setStoreId] = useState<string>(queryStoreId ?? "");
  const [positionId, setPositionId] = useState<string>(queryPositionId ?? "");

  const [selectedType, setSelectedType] = useState<AttendanceType>("CLIENT_LOCATION");
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [referenceAddress, setReferenceAddress] = useState<string>("");
  const [cities, setCities] = useState<string[]>(["Guarulhos - SP"]);

  const [isLoadingPosition, setIsLoadingPosition] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Inicializa e carrega dados salvos previamente
  useEffect(() => {
    const effectiveStoreId =
      queryStoreId ||
      sessionStorage.getItem("form_storeId") ||
      localStorage.getItem("current_store_id") ||
      "";
    const effectivePositionId =
      queryPositionId ||
      sessionStorage.getItem("form_positionId") ||
      "";

    if (effectiveStoreId) setStoreId(effectiveStoreId);
    if (effectivePositionId) setPositionId(effectivePositionId);

    // Se temos storeId e positionId, busca do backend via GET /api/v1/stores/{storeId}/positions/{positionId}
    if (effectiveStoreId && effectivePositionId) {
      setIsLoadingPosition(true);
      getStorePosition(effectiveStoreId, effectivePositionId)
        .then((positionsList) => {
          const pos = positionsList[0];
          if (pos) {
            setSelectedType((pos.attendanceType as AttendanceType) || "CLIENT_LOCATION");
            setRadiusKm(Number(pos.radiusKm) || 10);
            setReferenceAddress(pos.referenceAddress || "");
            if (Array.isArray(pos.cities) && pos.cities.length > 0) {
              setCities(pos.cities.map(formatCityString));
            }
          }
        })
        .catch((err) => {
          console.warn("[AttendanceTypeForm] Falha ao consultar posição existente:", err);
        })
        .finally(() => {
          setIsLoadingPosition(false);
        });
      return;
    }

    // Se não há posição remota, restaura rascunho salvo no sessionStorage
    const savedDraft = sessionStorage.getItem("form_attendanceArea_data");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.attendanceType) setSelectedType(parsed.attendanceType);
        if (parsed.radiusKm !== undefined) setRadiusKm(Number(parsed.radiusKm));
        if (parsed.referenceAddress) setReferenceAddress(parsed.referenceAddress);
        if (Array.isArray(parsed.cities) && parsed.cities.length > 0) {
          setCities(parsed.cities.map(formatCityString));
        }
      } catch {}
    }
  }, [queryStoreId, queryPositionId]);

  const handleAddCity = (cityToAdd: string) => {
    if (!cities.includes(cityToAdd)) {
      setCities((prev) => [...prev, cityToAdd]);
    }
  };

  const handleRemoveCity = (cityToRemove: string) => {
    setCities((prev) => prev.filter((city) => city !== cityToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const formattedCities = cities.map(parseCityString);

    // Salva rascunho de sessão para persistência no fluxo de criação de loja
    sessionStorage.setItem("form_attendanceArea", "true");
    sessionStorage.setItem(
      "form_attendanceArea_data",
      JSON.stringify({
        attendanceType: selectedType,
        radiusKm,
        referenceAddress,
        cities: formattedCities,
      })
    );

    // Se tivermos storeId, sincroniza diretamente com a API
    if (storeId) {
      try {
        if (positionId) {
          // PUT /api/v1/stores/{storeId}/positions/{positionId}
          const updatePayload: UpdateStorePositionPayload = {
            storeId,
            attendanceType: selectedType,
            radiusKm,
            referenceAddress,
            cities: formattedCities,
          };
          await updateStorePosition(storeId, positionId, updatePayload);
          setSuccessMessage("Área de atendimento atualizada com sucesso!");
        } else {
          // POST /api/v1/stores/{storeId}/positions
          const createPayload: CreateStorePositionPayload = {
            storeId,
            attendanceType: selectedType,
            radiusKm,
            referenceAddress,
            cities: formattedCities,
          };
          const created = await createStorePosition(createPayload);
          const newPos = Array.isArray(created) ? created[0] : created;
          if (newPos?.id) {
            setPositionId(newPos.id);
            sessionStorage.setItem("form_positionId", newPos.id);
          }
          setSuccessMessage("Área de atendimento criada com sucesso!");
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Erro ao salvar área de atendimento.";
        console.error("[AttendanceTypeForm] Erro ao sincronizar com backend:", err);
        setErrorMessage(
          `Aviso: os dados foram salvos localmente, mas houve uma falha ao enviar à API (${msg}).`
        );
      }
    }

    setIsSubmitting(false);

    // Redireciona conforme origem
    setTimeout(() => {
      if (fromSettings) {
        router.push("/store/store-settings");
      } else {
        router.push("/provider/create-store");
      }
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Alerta de Carregamento Prévio */}
      {isLoadingPosition && (
        <div className="rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground animate-pulse">
          Carregando dados da área de atendimento da loja...
        </div>
      )}

      {/* Alertas de Feedback */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs font-medium text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <AttendanceTypeSelector
        selectedType={selectedType}
        onChange={setSelectedType}
      />

      {/* Separador */}
      <div className="h-px bg-border" />

      <AttendanceRadiusField
        selectedType={selectedType}
        radiusKm={radiusKm}
        onRadiusChange={setRadiusKm}
        referenceAddress={referenceAddress}
        onAddressChange={setReferenceAddress}
      />

      {/* Separador */}
      <div className="h-px bg-border" />

      <AttendanceCitiesField
        cities={cities}
        onAddCity={handleAddCity}
        onRemoveCity={handleRemoveCity}
      />

      {/* Separador */}
      <div className="h-px bg-border" />

      <AttendanceFormActions
        isSubmitting={isSubmitting}
        cancelHref={fromSettings ? "/store/store-settings" : "/provider/create-store"}
      />
    </form>
  );
}

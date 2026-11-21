"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  AttendanceTypeSelector,
  type AttendanceType,
} from "./attendance-type-selector";
import { AttendanceAddressFields } from "./attendance-address-fields";
import { AttendanceRadiusField } from "./attendance-radius-field";
import { AttendanceCitiesField } from "./attendance-cities-field";
import { AttendanceFormActions } from "./attendance-form-actions";
import {
  parseCityString,
  formatCityString,
} from "@/lib/services/store-positions-service";
import {
  getStoreServiceArea,
  configureStoreServiceArea,
  type ConfigureServiceAreaPayload,
  type ValidRadiusKm,
} from "@/lib/services/stores-service";

export function AttendanceTypeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Permite receber storeId por query string ou localStorage/sessionStorage
  const queryStoreId = searchParams.get("storeId");
  const fromSettings = searchParams.get("from") === "settings";

  const [storeId, setStoreId] = useState<string>(queryStoreId ?? "");

  const [selectedType, setSelectedType] = useState<AttendanceType>("ON_CLIENT");
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [referenceAddress, setReferenceAddress] = useState<string>("");
  const [cep, setCep] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [complement, setComplement] = useState<string>("");
  const [city, setCity] = useState<string>("Guarulhos");
  const [state, setState] = useState<string>("SP");
  const [cities, setCities] = useState<string[]>(["Guarulhos - SP"]);

  const [isLoadingPosition, setIsLoadingPosition] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Inicializa e carrega dados salvos previamente
  useEffect(() => {
    if (fromSettings) {
      const effectiveStoreId =
        queryStoreId ||
        sessionStorage.getItem("form_storeId") ||
        localStorage.getItem("current_store_id") ||
        "";

      if (effectiveStoreId) setStoreId(effectiveStoreId);

      // Se temos storeId, busca do backend via GET /api/v1/stores/{storeId}/service-area
      if (effectiveStoreId) {
        setIsLoadingPosition(true);
        getStoreServiceArea(effectiveStoreId)
          .then((area) => {
            if (area) {
              setSelectedType(area.attendanceType || "ON_CLIENT");
              if (area.radiusKm !== null && area.radiusKm !== undefined) {
                setRadiusKm(area.radiusKm);
              }
              if (Array.isArray(area.cities) && area.cities.length > 0) {
                setCities(area.cities.map(formatCityString));
              }
            }
          })
          .catch((err) => {
            console.warn("[AttendanceTypeForm] Falha ao consultar área de atendimento existente:", err);
          })
          .finally(() => {
            setIsLoadingPosition(false);
          });
        return;
      }
    }

    // Se não viemos de settings ou não há posição remota, restaura rascunho salvo no sessionStorage
    const savedDraft = sessionStorage.getItem("form_attendanceArea_data");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.attendanceType) setSelectedType(parsed.attendanceType);
        if (parsed.radiusKm !== undefined) setRadiusKm(Number(parsed.radiusKm));
        if (parsed.referenceAddress) setReferenceAddress(parsed.referenceAddress);
        if (parsed.cep) setCep(parsed.cep);
        if (parsed.street) setStreet(parsed.street);
        if (parsed.number) setNumber(parsed.number);
        if (parsed.complement) setComplement(parsed.complement);
        if (parsed.city) setCity(parsed.city);
        if (parsed.state) setState(parsed.state);
        if (Array.isArray(parsed.cities) && parsed.cities.length > 0) {
          setCities(parsed.cities.map(formatCityString));
        }
      } catch {}
    } else {
      const storedStreet = sessionStorage.getItem("provider_street") || localStorage.getItem("provider_street") || "";
      const storedNumber = sessionStorage.getItem("provider_number") || localStorage.getItem("provider_number") || "";
      const storedComplement = sessionStorage.getItem("provider_complement") || localStorage.getItem("provider_complement") || "";
      const storedCity = sessionStorage.getItem("provider_city") || localStorage.getItem("provider_city") || "";
      const storedState = sessionStorage.getItem("provider_state") || localStorage.getItem("provider_state") || "";
      const storedCep = sessionStorage.getItem("provider_cep") || localStorage.getItem("provider_cep") || "";

      if (storedStreet) setStreet(storedStreet);
      if (storedNumber) setNumber(storedNumber);
      if (storedComplement) setComplement(storedComplement);
      if (storedCity) setCity(storedCity);
      if (storedState) setState(storedState);
      if (storedCep) setCep(storedCep);
    }
  }, [fromSettings, queryStoreId]);

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

    const isAddressRequired = selectedType !== "ON_CLIENT";

    if (isAddressRequired) {
      if (!street.trim()) {
        setErrorMessage("Por favor, informe a rua/logradouro do endereço da unidade.");
        setIsSubmitting(false);
        return;
      }

      if (!number.trim()) {
        setErrorMessage("Por favor, informe o número do endereço (ou S/N).");
        setIsSubmitting(false);
        return;
      }

      if (!city.trim()) {
        setErrorMessage("Por favor, informe a cidade do endereço da unidade.");
        setIsSubmitting(false);
        return;
      }

      if (!state.trim()) {
        setErrorMessage("Por favor, selecione o estado (UF) do endereço da unidade.");
        setIsSubmitting(false);
        return;
      }

      if (!cep.trim()) {
        setErrorMessage("Por favor, informe o CEP do endereço da unidade.");
        setIsSubmitting(false);
        return;
      }
    }

    const formattedCities = cities.map(parseCityString);

    const fullReferenceAddress = street.trim()
      ? `${street.trim()}, ${number.trim() || "S/N"}${complement.trim() ? ` - ${complement.trim()}` : ""}, ${city.trim()} - ${state.trim()}${cep.trim() ? `, CEP ${cep.trim()}` : ""}`
      : "";
    setReferenceAddress(fullReferenceAddress);

    // Salva rascunho de sessão para persistência no fluxo de criação de loja
    sessionStorage.setItem("form_attendanceArea", "true");
    sessionStorage.setItem(
      "form_attendanceArea_data",
      JSON.stringify({
        attendanceType: selectedType,
        radiusKm,
        referenceAddress: fullReferenceAddress,
        street: street.trim(),
        number: number.trim(),
        complement: complement.trim(),
        city: city.trim(),
        state: state.trim(),
        cep: cep.trim(),
        cities: formattedCities,
      })
    );

    sessionStorage.setItem("provider_street", street.trim());
    sessionStorage.setItem("provider_number", number.trim());
    sessionStorage.setItem("provider_complement", complement.trim());
    sessionStorage.setItem("provider_city", city.trim());
    sessionStorage.setItem("provider_state", state.trim());
    sessionStorage.setItem("provider_cep", cep.trim());
    sessionStorage.setItem("provider_referenceAddress", fullReferenceAddress);

    localStorage.setItem("provider_street", street.trim());
    localStorage.setItem("provider_number", number.trim());
    localStorage.setItem("provider_complement", complement.trim());
    localStorage.setItem("provider_city", city.trim());
    localStorage.setItem("provider_state", state.trim());
    localStorage.setItem("provider_cep", cep.trim());
    localStorage.setItem("provider_referenceAddress", fullReferenceAddress);

    // Se viemos das configurações e temos storeId, sincroniza com PUT /api/v1/stores/{storeId}/service-area
    if (fromSettings && storeId) {
      try {
        const validRadius: ValidRadiusKm = [5, 10, 20, 50].includes(Number(radiusKm))
          ? (Number(radiusKm) as ValidRadiusKm)
          : 10;

        const serviceAreaPayload: ConfigureServiceAreaPayload = {
          attendanceType: selectedType,
          radiusKm: selectedType === "FIXED_LOCATION" ? null : validRadius,
          cities: formattedCities.map((c) => ({
            city: c.city,
            state: c.state || "SP",
          })),
        };

        await configureStoreServiceArea(storeId, serviceAreaPayload);
        setSuccessMessage("Área de atendimento atualizada com sucesso!");
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Erro ao salvar área de atendimento.";
        console.error("[AttendanceTypeForm] Erro ao sincronizar com backend:", err);
        setErrorMessage(
          `Aviso: os dados foram salvos localmente, mas houve uma falha ao enviar à API (${msg}).`
        );
        setIsSubmitting(false);
        return;
      }
    } else {
      setSuccessMessage("Área de atendimento salva com sucesso!");
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

      {/* Endereço Segmentado da Unidade — visível apenas para Local fixo ou Ambos */}
      {selectedType !== "ON_CLIENT" && (
        <>
          <div className="h-px bg-border" />
          <AttendanceAddressFields
            selectedType={selectedType}
            cep={cep}
            onCepChange={setCep}
            street={street}
            onStreetChange={setStreet}
            number={number}
            onNumberChange={setNumber}
            complement={complement}
            onComplementChange={setComplement}
            city={city}
            onCityChange={setCity}
            state={state}
            onStateChange={setState}
          />
        </>
      )}

      {/* Separador */}
      <div className="h-px bg-border" />

      <AttendanceRadiusField
        selectedType={selectedType}
        radiusKm={radiusKm}
        onRadiusChange={setRadiusKm}
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

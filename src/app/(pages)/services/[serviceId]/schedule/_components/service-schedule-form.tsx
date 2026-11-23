"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Clock,
  MapPin,
  MessageSquare,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type Service, mockServices } from "@/lib/mocks/services";
import { superPinturasServices } from "@/lib/mocks/stores";
import { getServiceById } from "@/lib/services/services-service";
import {
  createBooking,
  getBookingsByService,
  type ServiceBookingItemDTO,
} from "@/lib/services/bookings-service";
import { getAuthenticatedUserId } from "@/lib/services/stores-service";
import { useAddresses } from "@/hooks/use-addresses";
import { useAuth } from "@/lib/auth/auth-context";
import { Calendar } from "@/components/ui/calendar";

const AVAILABLE_TIMES = [
  "08:00",
  "09:30",
  "11:00",
  "13:30",
  "15:00",
  "16:30",
  "18:00",
];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface ServiceScheduleFormProps {
  serviceId: string;
}

export function ServiceScheduleForm({ serviceId }: ServiceScheduleFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addresses } = useAddresses();
  const { user, supabaseUser } = useAuth();
  const clientId = user?.id ?? supabaseUser?.id ?? "";

  const titleFromParams = searchParams.get("serviceTitle") ?? searchParams.get("title") ?? searchParams.get("serviceName") ?? "";
  const companyFromParams = searchParams.get("company") ?? searchParams.get("providerName") ?? "";

  const [service, setService] = useState<Service | null>(() => {
    const all = [...mockServices, ...superPinturasServices];
    return all.find((s) => s.id === serviceId) ?? null;
  });
  const [isLoadingService, setIsLoadingService] = useState<boolean>(!service);

  useEffect(() => {
    let isCancelled = false;
    setIsLoadingService(true);

    getServiceById(serviceId, companyFromParams)
      .then((data) => {
        if (!isCancelled && data) {
          setService(data);
          setIsLoadingService(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.warn(`[Schedule] Usando fallback local para ${serviceId}:`, err);
          const all = [...mockServices, ...superPinturasServices];
          const found = all.find((s) => s.id === serviceId);
          if (found) setService(found);
          setIsLoadingService(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [serviceId, companyFromParams]);

  const initialPrice = Number(searchParams.get("price")) || (service?.price.inicial ?? 150);
  const initialPackage = searchParams.get("package") ?? (service?.packages[0]?.label ?? "Padrão");
  const storeId = searchParams.get("storeId") ?? (service?.storeId ?? "");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState<Date>(tomorrow);
  const [selectedTime, setSelectedTime] = useState<string>("14:00");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingBookings, setExistingBookings] = useState<ServiceBookingItemDTO[]>([]);

  useEffect(() => {
    let isCancelled = false;
    getBookingsByService(serviceId)
      .then((data) => {
        if (!isCancelled && Array.isArray(data)) {
          setExistingBookings(data);
        }
      })
      .catch((err) => {
        console.warn("[Schedule] Não foi possível carregar agendamentos existentes:", err);
      });
    return () => {
      isCancelled = true;
    };
  }, [serviceId]);

  const bookedTimes = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

    return existingBookings
      .filter((b) => {
        const isNotCancelled = !b.status.toUpperCase().includes("CANCEL");
        return isNotCancelled && b.scheduledAt.startsWith(dateStr);
      })
      .map((b) => {
        const dateObj = new Date(b.scheduledAt);
        return !isNaN(dateObj.getTime())
          ? dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
          : "";
      });
  }, [existingBookings, selectedDate]);

  // Sincroniza o endereço selecionado quando os endereços carregam do localStorage
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0]!.id);
    }
  }, [addresses, selectedAddressId]);

  async function handleContinueToPayment(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const formattedDate = selectedDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const addressText = (() => {
      const a = addresses.find((x) => x.id === selectedAddressId);
      if (!a) return "";
      return `${a.street}, ${a.number}${a.complement ? ` - ${a.complement}` : ""} - CEP ${a.cep}`;
    })();

    // Converte a data e hora selecionadas para o padrão ISO 8601 exigido pela API
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const scheduledDate = new Date(selectedDate);
    scheduledDate.setHours(hours ?? 0, minutes ?? 0, 0, 0);
    const scheduledAt = scheduledDate.toISOString();

    let bookingId = "";
    try {
      const effectiveClientId = clientId || (await getAuthenticatedUserId());
      if (!effectiveClientId) {
        setErrorMessage("Identificação do cliente não encontrada. Por favor, realize o login novamente.");
        setIsSubmitting(false);
        return;
      }

      const bookingRes = await createBooking({
        clientId: effectiveClientId,
        serviceId: service?.id ?? serviceId,
        employeeId: undefined,
        scheduledAt,
        notes: notes.trim() || undefined,
        // Compatibilidade adicional
        storeId,
        address: addressText,
        price: initialPrice,
        package: initialPackage,
      });
      bookingId = bookingRes.bookingId ?? bookingRes.id ?? "";
    } catch (err: unknown) {
      console.warn(
        "[Schedule] Falha na criação remota de agendamento:",
        err
      );
      const msg = err instanceof Error ? err.message : "Não foi possível criar o agendamento no servidor.";
      setErrorMessage(msg);
      setIsSubmitting(false);
      return;
    }

    const resolvedServiceName = service?.title ?? (titleFromParams ? titleFromParams : "Serviço");
    const resolvedProviderName = service?.company ?? (companyFromParams ? companyFromParams : "Prestador Agilis");

    const query = new URLSearchParams({
      bookingId,
      serviceId: service?.id ?? serviceId,
      serviceName: resolvedServiceName,
      providerName: resolvedProviderName,
      price: String(initialPrice),
      date: formattedDate,
      time: selectedTime,
      address: addressText,
      package: initialPackage,
      storeId,
      notes,
    });

    router.push(`/payment?${query.toString()}`);
  }

  return (
    <form onSubmit={handleContinueToPayment} className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      {/* Left Column: Date, Time, Address & Notes */}
      <div className="space-y-6">
        {/* Date and Time Section */}
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Escolha a data e o horário
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Selecione o melhor momento para receber o serviço
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
            {/* Calendar */}
            <div className="flex flex-col items-center sm:items-start space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider self-start">
                Data do Atendimento
              </label>
              <Calendar
                selected={selectedDate}
                onSelect={setSelectedDate}
                minDate={tomorrow}
                className="w-full max-w-sm"
              />
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Horários Disponíveis
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
                {AVAILABLE_TIMES.map((time) => {
                  const isSelected = selectedTime === time;
                  const isBooked = bookedTimes.includes(time);
                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-xl border py-2.5 px-3 text-xs font-semibold transition-all ${
                        isBooked
                          ? "border-border/50 bg-muted/20 text-muted-foreground/50 line-through cursor-not-allowed"
                          : isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-xs cursor-pointer"
                            : "border-border bg-muted/40 text-foreground hover:bg-muted cursor-pointer"
                      }`}
                    >
                      {time} {isBooked ? "(Ocupado)" : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Address and Observations */}
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <label htmlFor="schedule-address" className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              Endereço de Atendimento
            </label>
            {addresses.length === 0 ? (
              <div className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>
                  Nenhum endereço cadastrado.{" "}
                  <Link href="/addresses/add" className="font-semibold text-primary hover:underline">
                    Adicionar endereço
                  </Link>
                </span>
              </div>
            ) : (
              <select
                id="schedule-address"
                required
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.street}, {addr.number}{addr.complement ? ` - ${addr.complement}` : ""} — CEP {addr.cep}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="schedule-notes" className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-primary" />
              Observações ou Instruções (opcional)
            </label>
            <textarea
              id="schedule-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Ponto de referência, detalhes do ambiente ou solicitações específicas..."
              className="w-full resize-none rounded-xl border border-input bg-background p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Service Summary & Payment Action */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm space-y-4 lg:sticky lg:top-6">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-3">
            Resumo do Agendamento
          </h3>

          {/* Service info */}
          {isLoadingService && !service ? (
            <div className="flex gap-3 items-center animate-pulse">
              <div className="h-16 w-16 bg-muted rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ) : (
            <div className="flex gap-3 items-center">
              {service?.images[0]?.url ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={service.images[0].url}
                    alt={service.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 bg-muted rounded-xl shrink-0 flex items-center justify-center text-muted-foreground text-xs font-bold">
                  Agilis
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-foreground leading-snug truncate">
                  {service?.title ?? (titleFromParams ? titleFromParams : "Serviço")}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {service?.company ?? companyFromParams ?? "Prestador Agilis"}
                </p>
                <span className="inline-flex items-center gap-1 mt-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  <Sparkles className="h-3 w-3" />
                  Pacote {initialPackage}
                </span>
              </div>
            </div>
          )}

          {/* Selection details */}
          <div className="rounded-xl bg-muted/40 p-3.5 space-y-2 text-xs border border-border">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-primary" />
                Data
              </span>
              <span className="font-semibold text-foreground">
                {selectedDate.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Horário
              </span>
              <span className="font-semibold text-foreground">{selectedTime}</span>
            </div>

            <div className="flex items-center justify-between border-t border-border/80 pt-2 text-sm font-bold text-foreground">
              <span>Valor do Serviço</span>
              <span>{currencyFormatter.format(initialPrice)}</span>
            </div>
          </div>


          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Criando agendamento...</span>
              </>
            ) : (
              <>
                <span>Ir para o Pagamento</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <Link
            href={`/services/${serviceId}`}
            className="block text-center text-xs text-muted-foreground hover:underline"
          >
            Voltar aos detalhes do serviço
          </Link>
        </div>
      </div>
    </form>
  );
}

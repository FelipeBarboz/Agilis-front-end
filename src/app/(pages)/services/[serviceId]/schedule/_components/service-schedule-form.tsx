"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Clock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { mockServices } from "@/lib/mocks/services";
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

  const service = mockServices.find((s) => s.id === serviceId) ?? mockServices[0];

  const initialPrice = Number(searchParams.get("price")) || (service?.price.inicial ?? 150);
  const initialPackage = searchParams.get("package") ?? (service?.packages[0]?.label ?? "Padrão");
  const storeId = searchParams.get("storeId") ?? (service?.storeId ?? "");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState<Date>(tomorrow);
  const [selectedTime, setSelectedTime] = useState<string>("14:00");
  const [address, setAddress] = useState("R. Cristiano Elisário Bilo, 40 - Parque Erasmo, Guarulhos - SP");
  const [notes, setNotes] = useState("");

  function handleContinueToPayment(e: React.FormEvent) {
    e.preventDefault();

    const formattedDate = selectedDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const query = new URLSearchParams({
      serviceId: service?.id ?? serviceId,
      serviceName: service?.title ?? "Serviço",
      providerName: service?.company ?? "Prestador Agilis",
      price: String(initialPrice),
      date: formattedDate,
      time: selectedTime,
      address,
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
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-xl border py-2.5 px-3 text-xs font-semibold transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-xs"
                          : "border-border bg-muted/40 text-foreground hover:bg-muted"
                      }`}
                    >
                      {time}
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
            <input
              id="schedule-address"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Digite o endereço completo..."
              className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
          <div className="flex gap-3 items-center">
            {service?.images[0]?.url && (
              <img
                src={service.images[0].url}
                alt={service.title}
                className="h-16 w-16 rounded-xl object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-foreground leading-snug truncate">
                {service?.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {service?.company}
              </p>
              <span className="inline-flex items-center gap-1 mt-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                Pacote {initialPackage}
              </span>
            </div>
          </div>

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

          {/* Policy */}
          <div className="flex items-start gap-2 rounded-xl bg-primary/5 p-3 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p>
              Garantia Agilis: Agendamento protegido com direito a cancelamento e reembolso integral.
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            <span>Ir para o Pagamento</span>
            <ArrowRight className="h-4 w-4" />
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

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { MOCK_HISTORY } from "../../history/_components/mock-history";
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

export function RescheduleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const entry = MOCK_HISTORY.find((item) => item.id === id) ?? MOCK_HISTORY[1];

  const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now() + 86400000));
  const [selectedTime, setSelectedTime] = useState<string>("14:00");
  const [reason, setReason] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-2xl border border-border bg-background p-8 text-center shadow-lg"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h2 className="text-2xl font-bold text-foreground">Reagendamento Confirmado!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Seu serviço foi remarcado com sucesso. O prestador foi notificado sobre a alteração.
        </p>

        <div className="my-6 rounded-xl border border-border bg-muted/40 p-4 text-left space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Serviço:</span>
            <span className="font-semibold text-foreground">{entry?.serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nova Data:</span>
            <span className="font-semibold text-primary">
              {selectedDate.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Novo Horário:</span>
            <span className="font-semibold text-primary">{selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Prestador:</span>
            <span className="font-semibold text-foreground">{entry?.counterpartName}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/history")}
          className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Voltar ao Histórico
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Service Header Info */}
      <div className="flex gap-4 rounded-2xl border border-border bg-background p-5 shadow-xs">
        {entry?.imageUrl && entry.imageUrl.trim() !== "" ? (
          <img
            src={entry.imageUrl}
            alt={entry.serviceName}
            className="h-20 w-20 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
            {entry?.serviceName?.charAt(0) || "S"}
          </div>
        )}

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-primary">
              {entry?.category ?? "Serviço"}
            </span>
            <h2 className="text-base font-bold text-foreground">{entry?.serviceName}</h2>
            <p className="text-xs text-muted-foreground">
              {entry?.counterpartRole === "prestador" ? "Prestador: " : "Cliente: "}
              {entry?.counterpartName}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>
              Agendamento atual: {entry?.date} às {entry?.time ?? "14:00"}
            </span>
          </div>
        </div>
      </div>

      {/* Reschedule Form Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-background p-6 shadow-sm space-y-6"
      >
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Selecione uma nova data e horário
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Escolha o melhor dia para a realização do seu serviço
          </p>
        </div>

        {/* Date and Time Pickers in a responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
          {/* Date Selector with Shadcn Calendar */}
          <div className="space-y-2 flex flex-col items-center sm:items-start">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider self-start">
              Nova Data
            </label>
            <Calendar
              selected={selectedDate}
              onSelect={setSelectedDate}
              minDate={today}
              className="w-full max-w-sm"
            />
          </div>

          {/* Time Selector */}
          <div className="space-y-2 flex-1">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Horários Disponíveis
            </label>
            <div className="grid grid-cols-2 gap-2">
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

        {/* Reason / Notes */}
        <div className="space-y-2">
          <label htmlFor="reschedule-reason" className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Motivo do Reagendamento (opcional)
          </label>
          <textarea
            id="reschedule-reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Informe se deseja adicionar alguma observação para o prestador..."
            className="w-full resize-none rounded-xl border border-input bg-background p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Policy notice */}
        <div className="flex items-start gap-2.5 rounded-xl bg-primary/5 p-3.5 border border-primary/10 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p>
            Reagendamento gratuito. O prestador receberá uma notificação com a nova solicitação de horário.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Confirmando..." : "Confirmar Novo Horário"}
          </button>
          <Link
            href="/history"
            className="rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium text-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AppointmentDetails } from "./appointment-details";
import { OrderSummary } from "./order-summary";
import { PaymentMethodModal } from "./payment-method-modal";
import { PAYMENT_METHODS, type PaymentMethodId } from "./types";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Briefcase,
  User,
  CalendarDays,
  MapPin,
  CreditCard,
  Receipt,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { motion } from "motion/react";

interface AppointmentConfirmationCardProps {
  appointmentId: string;
}

const defaultMockAppointment = {
  serviceName: "Análise e ajuste de parâmetros",
  providerName: "Guilherme Farias",
  date: "10/08 (Sexta-feira)",
  time: "09:00",
  address: "R. Cristiano Elisário Bilo, 40 - Parque Erasmo, Guarulhos",
  price: 120,
  bookingFee: 10,
};

export function AppointmentConfirmationCard({
  appointmentId: _appointmentId,
}: AppointmentConfirmationCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const serviceName = searchParams.get("serviceName") ?? defaultMockAppointment.serviceName;
  const providerName = searchParams.get("providerName") ?? defaultMockAppointment.providerName;
  const date = searchParams.get("date") ?? defaultMockAppointment.date;
  const time = searchParams.get("time") ?? defaultMockAppointment.time;
  const address = searchParams.get("address") ?? defaultMockAppointment.address;
  const price = Number(searchParams.get("price")) || defaultMockAppointment.price;

  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] =
    useState<PaymentMethodId | null>("pix");
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedPayment = PAYMENT_METHODS.find(
    (method) => method.id === selectedPaymentId,
  );

  const bookingFee = 10;
  const total = price + bookingFee;

  function handleConfirm() {
    if (!selectedPaymentId) {
      setPaymentModalOpen(true);
      return;
    }

    setIsSuccess(true);
  }

  // TELA DE PAGAMENTO ACEITO (SUCESSO)
  if (isSuccess) {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
        {/* Seta no canto superior esquerdo direcionando diretamente para a Home — Padrão Agilis */}
        <button
          type="button"
          onClick={() => router.push("/home")}
          aria-label="Ir para o início"
          className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full rounded-3xl border border-border bg-card p-6 sm:p-8 text-center shadow-md relative overflow-hidden"
        >
          {/* Badge de Sucesso */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-xs mb-4">
            <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Pagamento Aceito com Sucesso!
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            O serviço foi contratado e o agendamento já está confirmado e disponível no seu histórico.
          </p>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-600 mt-4">
            <Sparkles className="h-3.5 w-3.5" />
            Pagamento Confirmado · Prestador Notificado
          </div>

          {/* Comprovante Padronizado com os Ícones do Agilis */}
          <div className="my-6 rounded-2xl border border-border bg-muted/40 p-4 sm:p-5 text-left space-y-3.5 text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Comprovante do Agendamento
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Pago
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4 text-primary shrink-0" />
                <span>Serviço:</span>
              </div>
              <span className="font-semibold text-foreground text-right">{serviceName}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4 text-primary shrink-0" />
                <span>Prestador:</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <div className="flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {providerName.charAt(0)}
                </div>
                <span>{providerName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary shrink-0" />
                <span>Data e Horário:</span>
              </div>
              <span className="font-semibold text-primary">{date} às {time}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Local:</span>
              </div>
              <span className="font-medium text-foreground text-right text-xs max-w-[240px] truncate" title={address}>
                {address}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4 text-primary shrink-0" />
                <span>Forma de Pagamento:</span>
              </div>
              <span className="font-medium text-foreground">{selectedPayment?.label ?? "Pix"}</span>
            </div>

            <div className="flex items-center justify-between border-t border-border/80 pt-3">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Receipt className="h-4 w-4 text-emerald-600" />
                <span>Total Pago:</span>
              </div>
              <span className="text-lg font-extrabold text-emerald-600">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>

          {/* Garantia Agilis */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-2.5 text-left mb-6">
            <ShieldCheck className="size-4 shrink-0 text-primary mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">Garantia Agilis:</strong> O valor permanecerá protegido e só será liberado para o prestador após a conclusão do serviço.
            </p>
          </div>

          {/* Ação: Apenas Ver no Histórico */}
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              onClick={() => router.push("/history")}
              className="w-full rounded-xl h-11 font-bold gap-2 cursor-pointer"
              size="lg"
            >
              <Clock className="h-4 w-4" />
              Ver no Histórico
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // TELA DE PAGAMENTO E CONFIRMAÇÃO
  return (
    <>
      {/* Seta de voltar no canto superior esquerdo — Padrão Agilis */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Cabeçalho da Página Padronizado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pagamento e Confirmação</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Revise os dados do atendimento e conclua a contratação do serviço
            </p>
          </div>
        </div>
      </div>

      {/* Grid de 2 Colunas: Detalhes à esquerda e Resumo Fixo à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Coluna Esquerda: Detalhes do Agendamento */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-border/70">
              <div>
                <h2 className="text-base font-bold text-foreground">Detalhes do Agendamento</h2>
                <p className="text-xs text-muted-foreground">{serviceName}</p>
              </div>
              <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                Etapa Final
              </span>
            </div>

            <AppointmentDetails
              date={date}
              time={time}
              address={address}
              selectedPayment={selectedPayment}
              onOpenPaymentModal={() => setPaymentModalOpen(true)}
            />
          </div>
        </div>

        {/* Coluna Direita: Resumo e Confirmação Fixo */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-6">
          <OrderSummary
            serviceName={serviceName}
            providerName={providerName}
            price={price}
            bookingFee={bookingFee}
            total={total}
          />

          <Button
            className="w-full h-12 rounded-xl text-base font-bold shadow-xs transition-all hover:shadow-md cursor-pointer"
            size="lg"
            onClick={handleConfirm}
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Confirmar Agendamento
          </Button>

          <p className="text-center text-xs text-muted-foreground leading-relaxed px-2">
            Ao confirmar, você concorda com os Termos de Serviço e com a Política de Cancelamento da Agilis.
          </p>
        </div>
      </div>

      <PaymentMethodModal
        open={isPaymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        selectedId={selectedPaymentId}
        onSelect={setSelectedPaymentId}
      />
    </>
  );
}
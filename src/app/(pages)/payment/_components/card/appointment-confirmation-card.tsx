"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";
import { PaymentMethodModal } from "../payment-method-modal";
import { PaymentHeader } from "../payment-header";
import { PaymentSuccess } from "../payment-success";
import { AppointmentDetailsCard } from "./appointment-details-card";
import { ConfirmationSidebar } from "../confirmation-sidebar";
import { PAYMENT_METHODS, type PaymentMethodId } from "../../../../../types/payment";
import { createPaymentPreference } from "@/lib/services/payments-service";
import { createBooking, getBookingById, type BookingPaymentMethod } from "@/lib/services/bookings-service";
import { getServiceById } from "@/lib/services/services-service";

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

const STORAGE_KEY = "agilis:pending-payment";

interface SavedPaymentState {
  bookingId: string;
  serviceId?: string;
  serviceName: string;
  providerName: string;
  date: string;
  time: string;
  address: string;
  price: number;
  total: number;
}

export function AppointmentConfirmationCard({
  appointmentId: _appointmentId,
}: AppointmentConfirmationCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Status retornado pelo Mercado Pago (ex: ?status=success&bookingId=...)
  const statusParam =
    searchParams.get("status") ?? searchParams.get("collection_status");
  const bookingIdFromUrl =
    searchParams.get("bookingId") ??
    searchParams.get("id") ??
    (_appointmentId && _appointmentId.length > 0 ? _appointmentId : undefined);

  // Carrega estado salvo do sessionStorage para preservar os detalhes após o retorno do MP
  const [savedData, setSavedData] = useState<SavedPaymentState | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSavedData(JSON.parse(raw) as SavedPaymentState);
      }
    } catch {}
  }, []);

  const bookingId = bookingIdFromUrl ?? savedData?.bookingId ?? "";

  const [asyncServiceName, setAsyncServiceName] = useState<string>("");
  const [asyncProviderName, setAsyncProviderName] = useState<string>("");

  useEffect(() => {
    let isCancelled = false;
    const rawServiceName = searchParams.get("serviceName");
    const rawServiceId = searchParams.get("serviceId");
    const rawBookingId = bookingId;

    async function resolveServiceDetails() {
      try {
        let sid = rawServiceId;
        if (!sid && rawBookingId) {
          const booking = await getBookingById(rawBookingId);
          if (booking?.serviceId) sid = booking.serviceId;
        }
        if (sid) {
          const s = await getServiceById(sid);
          if (!isCancelled && s) {
            if (s.title) setAsyncServiceName(s.title);
            if (s.company) setAsyncProviderName(s.company);
          }
        }
      } catch (err) {
        console.warn("[Payment] Não foi possível carregar detalhes do serviço:", err);
      }
    }

    if (!rawServiceName || rawServiceName === "Serviço") {
      void resolveServiceDetails();
    }

    return () => {
      isCancelled = true;
    };
  }, [searchParams, bookingId]);

  const rawUrlServiceName = searchParams.get("serviceName");
  const rawUrlProviderName = searchParams.get("providerName");

  const serviceName =
    (rawUrlServiceName && rawUrlServiceName !== "Serviço" ? rawUrlServiceName : null) ??
    (asyncServiceName ? asyncServiceName : null) ??
    (savedData?.serviceName && savedData.serviceName !== "Serviço" ? savedData.serviceName : null) ??
    defaultMockAppointment.serviceName;

  const providerName =
    rawUrlProviderName ??
    (asyncProviderName ? asyncProviderName : null) ??
    savedData?.providerName ??
    "";
  const date =
    searchParams.get("date") ?? savedData?.date ?? defaultMockAppointment.date;
  const time =
    searchParams.get("time") ?? savedData?.time ?? defaultMockAppointment.time;
  const address =
    searchParams.get("address") ??
    savedData?.address ??
    defaultMockAppointment.address;
  const price =
    Number(searchParams.get("price")) ||
    (savedData?.price ?? defaultMockAppointment.price);

  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] =
    useState<PaymentMethodId | null>("mercadopago");
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inicializa com sucesso se o Mercado Pago redirecionou com status=success ou approved
  const isRedirectSuccess =
    statusParam === "success" || statusParam === "approved";
  const isRedirectFailure =
    statusParam === "failure" || statusParam === "rejected";

  const [isManualSuccess, setIsManualSuccess] = useState(false);
  const isSuccess = isRedirectSuccess || isManualSuccess;

  const selectedPayment = PAYMENT_METHODS.find(
    (method) => method.id === selectedPaymentId
  );

  const bookingFee = 10;
  const total = price + bookingFee;

  async function handleConfirm() {
    setErrorMessage(null);

    // Se for Mercado Pago (ou método padrão)
    if (
      !selectedPaymentId ||
      selectedPaymentId === "mercadopago" ||
      selectedPaymentId === "pix" ||
      selectedPaymentId === "credit-card" ||
      selectedPaymentId === "debit-card"
    ) {
      setIsLoadingPayment(true);

      try {
        let effectiveBookingId = bookingId;

        // Se ainda não temos um bookingId, cria o agendamento no backend
        if (!effectiveBookingId) {
          try {
            const scheduledAt = (() => {
              // Reconstruct ISO 8601 from date + time URL params (fallback only)
              const rawDate = searchParams.get("date") ?? "";
              const rawTime = searchParams.get("time") ?? "00:00";
              if (rawDate) {
                return new Date(`${rawDate}T${rawTime}:00`).toISOString();
              }
              return new Date().toISOString();
            })();
            const bookingRes = await createBooking({
              clientId: searchParams.get("clientId") ?? "",
              serviceId: searchParams.get("serviceId") ?? "",
              employeeId: searchParams.get("employeeId") ?? "",
              scheduledAt,
              notes: searchParams.get("notes") ?? "",
              paymentMethod: (searchParams.get("paymentMethod") as BookingPaymentMethod | null) ?? "CREDIT_CARD",
              couponCode: searchParams.get("couponCode") ?? "",
            });
            effectiveBookingId = bookingRes.bookingId ?? "";
          } catch (err) {
            console.warn(
              "[Payment] Não foi possível criar booking prévio no backend, gerando identificador:",
              err
            );
            effectiveBookingId = crypto.randomUUID();
          }
        }

        // Salva os dados do agendamento no sessionStorage para resgate após o redirecionamento do MP
        const payloadToSave: SavedPaymentState = {
          bookingId: effectiveBookingId,
          serviceId: searchParams.get("serviceId") ?? undefined,
          serviceName,
          providerName,
          date,
          time,
          address,
          price,
          total,
        };
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payloadToSave));
        } catch {}

        // Passo 2: Gerar a preferência de pagamento no Mercado Pago
        const frontendBaseUrl =
          typeof window !== "undefined"
            ? window.location.origin
            : "https://agilis.com.br";

        const preference = await createPaymentPreference({
          bookingId: effectiveBookingId,
          frontendBaseUrl,
        });

        // Passo 3: Redirecionar o cliente para o Checkout Pro (sandboxInitPoint em testes)
        const redirectUrl =
          preference.sandboxInitPoint || preference.initPoint;

        if (!redirectUrl) {
          throw new Error("URL de redirecionamento do Mercado Pago não retornada.");
        }

        window.location.href = redirectUrl;
      } catch (err) {
        setIsLoadingPayment(false);
        const msg =
          err instanceof Error
            ? err.message
            : "Erro ao gerar preferência de pagamento no Mercado Pago.";
        console.warn("[Payment] Erro ao iniciar Mercado Pago Checkout Pro:", msg);
        setErrorMessage(
          `Não foi possível iniciar o Checkout do Mercado Pago (${msg}). Tente novamente.`
        );
      }
      return;
    }

    // Outros métodos não-MP (caso existam)
    setIsManualSuccess(true);
  }

  // Tela de pagamento aceito (sucesso vindo do Mercado Pago ou manual)
  if (isSuccess) {
    return (
      <PaymentSuccess
        bookingId={bookingId}
        serviceName={serviceName}
        providerName={providerName}
        date={date}
        time={time}
        address={address}
        selectedPayment={selectedPayment}
        total={total}
        onNavigateHome={() => router.push("/home")}
        onNavigateHistory={() => router.push("/history")}
      />
    );
  }

  // Tela de pagamento e confirmação
  return (
    <>
      <PaymentHeader onBack={() => router.back()} />

      {/* Banner de erro vindo do retorno do Mercado Pago ou da chamada da API */}
      {(isRedirectFailure || errorMessage) && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>
              {errorMessage ??
                "O pagamento não foi concluído no Mercado Pago. Você pode tentar novamente abaixo."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              if (isRedirectFailure) {
                router.replace("/payment");
              }
            }}
            className="inline-flex items-center gap-1.5 self-end sm:self-auto rounded-lg border border-destructive/30 bg-background px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Tentar novamente
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        <AppointmentDetailsCard
          serviceName={serviceName}
          date={date}
          time={time}
          address={address}
          selectedPayment={selectedPayment}
          onOpenPaymentModal={() => setPaymentModalOpen(true)}
        />

        <ConfirmationSidebar
          serviceName={serviceName}
          providerName={providerName}
          price={price}
          bookingFee={bookingFee}
          total={total}
          isLoading={isLoadingPayment}
          isMercadoPago={true}
          onConfirm={handleConfirm}
        />
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

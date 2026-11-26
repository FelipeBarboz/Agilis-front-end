"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";
import { PaymentMethodModal } from "../payment-method-modal";
import { PaymentHeader } from "../payment-header";
import { PaymentSuccess } from "../payment-success";
import { PaymentStatusResult } from "../payment-status-result";
import { AppointmentDetailsCard } from "./appointment-details-card";
import { ConfirmationSidebar } from "../confirmation-sidebar";
import { PAYMENT_METHODS, type PaymentMethodId } from "../../../../../types/payment";
import {
  createPaymentPreference,
  getPaymentStatus,
  type PaymentStatus,
} from "@/lib/services/payments-service";
import { createBooking, getBookingById, type BookingPaymentMethod } from "@/lib/services/bookings-service";
import { getServiceById } from "@/lib/services/services-service";
import { validateCoupon } from "@/lib/services/coupons-service";

function mapPaymentMethodToApi(id: PaymentMethodId | null): BookingPaymentMethod {
  if (id === "pix") return "PIX";
  if (id === "debit-card") return "DEBIT_CARD";
  return "CREDIT_CARD";
}

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

  // Status real do pagamento vindo da API
  const [paymentStatusData, setPaymentStatusData] = useState<PaymentStatus | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(Boolean(bookingId && statusParam));

  // Consulta o status real via GET /api/v1/payments/booking/{bookingId} se houver status ou retorno do MP
  useEffect(() => {
    let isCancelled = false;
    if (bookingId && statusParam) {
      setIsCheckingStatus(true);
      getPaymentStatus(bookingId)
        .then((data) => {
          if (!isCancelled && data) {
            setPaymentStatusData(data);
          }
        })
        .catch((err) => {
          console.warn("[Payment] Erro ao buscar status real do pagamento:", err);
        })
        .finally(() => {
          if (!isCancelled) {
            setIsCheckingStatus(false);
          }
        });
    }
    return () => {
      isCancelled = true;
    };
  }, [bookingId, statusParam]);

  const [isManualSuccess, setIsManualSuccess] = useState(false);

  // Cupom de desconto
  const serviceIdFromUrl = searchParams.get("serviceId") ?? "";
  const initialCouponFromUrl = (searchParams.get("couponCode") ?? "").trim().toUpperCase();
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    initialCouponFromUrl || null
  );
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const selectedPayment = PAYMENT_METHODS.find(
    (method) => method.id === selectedPaymentId
  );

  const total = Math.max(0, price - discountAmount);

  async function handleApplyCoupon(code: string) {
    if (!serviceIdFromUrl) {
      setCouponError("Serviço não identificado para validar o cupom.");
      return;
    }
    setIsValidatingCoupon(true);
    setCouponError(null);
    try {
      const res = await validateCoupon({
        serviceId: serviceIdFromUrl,
        code,
      });
      if (!res.valid) {
        setAppliedCouponCode(null);
        setDiscountAmount(0);
        setCouponError(res.reason ?? "Cupom inválido ou expirado para este serviço.");
        return;
      }
      setAppliedCouponCode(code.trim().toUpperCase());
      setDiscountAmount(Number(res.discountAmount) || 0);
      setCouponError(null);
    } catch (err) {
      setAppliedCouponCode(null);
      setDiscountAmount(0);
      setCouponError(
        err instanceof Error ? err.message : "Não foi possível validar o cupom."
      );
    } finally {
      setIsValidatingCoupon(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCouponCode(null);
    setDiscountAmount(0);
    setCouponError(null);
  }

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

        // Se ainda não temos um bookingId, cria o agendamento no backend com método + cupom
        if (!effectiveBookingId) {
          const scheduledAtParam = searchParams.get("scheduledAt");
          const rawDate = searchParams.get("date") ?? "";
          const rawTime = searchParams.get("time") ?? "14:00";
          const timeFormatted = rawTime.length === 5 ? `${rawTime}:00` : rawTime;

          let scheduledAt = scheduledAtParam ?? "";
          if (!scheduledAt) {
            // Converte "DD/MM/YYYY" para "YYYY-MM-DD" se necessário
            const brMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(rawDate);
            const isoDate = brMatch
              ? `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`
              : rawDate;
            scheduledAt = isoDate
              ? `${isoDate}T${timeFormatted}`
              : new Date().toISOString().slice(0, 19);
          }

          const bookingRes = await createBooking({
            clientId: searchParams.get("clientId") ?? "",
            serviceId: serviceIdFromUrl,
            employeeId: searchParams.get("employeeId") ?? "",
            scheduledAt,
            notes: searchParams.get("notes") ?? "",
            paymentMethod: mapPaymentMethodToApi(selectedPaymentId),
            couponCode: appliedCouponCode ?? "",
          });

          effectiveBookingId = bookingRes.bookingId ?? bookingRes.id ?? "";
          if (!effectiveBookingId) {
            throw new Error("O servidor não retornou o identificador do agendamento.");
          }
        }

        // Salva os dados do agendamento no sessionStorage para resgate após o retorno do MP
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
        const preference = await createPaymentPreference(effectiveBookingId);

        // Passo 3: Redirecionar o cliente para o Checkout Pro
        const isDev = process.env.NODE_ENV === "development";
        const redirectUrl = isDev
          ? (preference.sandboxInitPoint || preference.initPoint)
          : (preference.initPoint || preference.sandboxInitPoint);

        if (!redirectUrl) {
          throw new Error("URL de redirecionamento do Mercado Pago não retornada.");
        }

        window.location.href = redirectUrl;
      } catch (err: unknown) {
        setIsLoadingPayment(false);
        const anyErr = err as { status?: number; message?: string };
        if (anyErr?.status === 400) {
          const msg = anyErr.message ?? "Não foi possível iniciar o pagamento.";
          setErrorMessage(msg);
          if (msg.includes("já foi confirmado e pago") && bookingId) {
            void getPaymentStatus(bookingId).then((st) => {
              if (st) setPaymentStatusData(st);
            });
          }
          return;
        }

        if (anyErr?.status === 500) {
          setErrorMessage(
            "Erro interno no servidor (500). Verifique se a variável MERCADO_PAGO_ACESS_TOKEN e FRONTEND_URL estão configuradas no painel do backend no Render."
          );
          return;
        }

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

  // 1. Estado de verificação inicial
  if (isCheckingStatus) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-3xl bg-card border border-border p-12 shadow-xs text-center my-8">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent mb-3" />
        <h3 className="text-base font-bold text-foreground">Verificando pagamento...</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Consultando a confirmação do Mercado Pago no servidor
        </p>
      </div>
    );
  }

  // 2. Tela de resultado baseado no status real da API
  if (paymentStatusData && paymentStatusData.status !== "NOT_CREATED") {
    return (
      <PaymentStatusResult
        initialPayment={paymentStatusData}
        bookingId={bookingId}
        serviceName={serviceName}
        providerName={providerName}
        date={date}
        time={time}
        address={address}
        onRetry={() => {
          setPaymentStatusData(null);
          setErrorMessage(null);
          if (bookingId) {
            router.replace(`/payment?bookingId=${bookingId}`);
          }
        }}
      />
    );
  }

  // 3. Sucesso manual (caso não-MP)
  if (isManualSuccess) {
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

  // 4. Tela de pagamento e confirmação (checkout padrão)
  return (
    <>
      <PaymentHeader onBack={() => router.back()} />

      {/* Banner de erro ou recusa */}
      {errorMessage && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="inline-flex items-center gap-1.5 self-end sm:self-auto rounded-lg border border-destructive/30 bg-background px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Fechar
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
          discountAmount={discountAmount}
          appliedCouponCode={appliedCouponCode}
          couponError={couponError}
          isValidatingCoupon={isValidatingCoupon}
          canApplyCoupon={!bookingId && Boolean(serviceIdFromUrl)}
          onApplyCoupon={(code) => void handleApplyCoupon(code)}
          onRemoveCoupon={handleRemoveCoupon}
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

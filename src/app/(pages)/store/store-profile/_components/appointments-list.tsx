"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Clock, User, Loader2 } from "lucide-react";
import { getStoreBookingsOverview } from "@/lib/services/bookings-service";

interface StoreAppointmentItem {
  id: string;
  client: string;
  service: string;
  date: string;
  time: string;
}

interface AppointmentsListProps {
  storeId?: string;
}

export function AppointmentsList({ storeId }: AppointmentsListProps) {
  const [appointments, setAppointments] = useState<StoreAppointmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!storeId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const todayStr = new Date().toISOString().split("T")[0];
    setIsLoading(true);

    getStoreBookingsOverview(storeId, todayStr)
      .then((res) => {
        if (!isMounted) return;
        const mapped: StoreAppointmentItem[] = (res.bookings ?? []).map((b) => {
          const dt = new Date(b.scheduledAt);
          const dateFormatted = isNaN(dt.getTime())
            ? res.date
            : dt.toLocaleDateString("pt-BR");

          let timeFormatted = "00:00";
          if (typeof b.startTime === "string" && b.startTime.includes(":")) {
            timeFormatted = b.startTime.slice(0, 5);
          } else if (b.startTime && typeof b.startTime === "object") {
            timeFormatted = `${String(b.startTime.hour).padStart(2, "0")}:${String(b.startTime.minute).padStart(2, "0")}`;
          } else if (!isNaN(dt.getTime())) {
            timeFormatted = `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
          }

          return {
            id: b.bookingId,
            client: b.clientName || "Cliente",
            service: b.serviceTitle || "Serviço",
            date: dateFormatted,
            time: timeFormatted,
          };
        });
        setAppointments(mapped);
      })
      .catch((err) => {
        console.warn("[AppointmentsList] Erro ao carregar agendamentos da loja:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [storeId]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Agendamentos</h2>
        <Link
          href="/store/store-scheduling"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
        >
          <span>Ver todos</span>
          <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Loader2 className="size-5 animate-spin mr-2" />
          <span className="text-sm">Carregando agendamentos...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-card shadow-sm hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <span className="font-bold text-foreground flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  {appt.client}
                </span>
                <span className="text-sm text-muted-foreground ml-6">{appt.service}</span>
              </div>

              <div className="flex items-center gap-4 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-border">
                <span className="text-sm font-semibold text-primary">{appt.date}</span>
                <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-sm font-medium">
                  <Clock className="size-4" />
                  {appt.time}
                </div>
              </div>
            </div>
          ))}
          {appointments.length === 0 && (
            <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
              Nenhum agendamento para hoje.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

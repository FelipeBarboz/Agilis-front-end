"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  getStoreBookingsCalendar,
  getStoreBookingsOverview,
} from "@/lib/services/bookings-service";
import {
  mapOverviewToCalendarAppointment,
  toDateKey,
  type EmployeeCalendarAppointment,
} from "@/lib/utils/employee-bookings-mapper";
import { CalendarMonthView } from "./calendar-month-view";
import { CalendarWeekView } from "./calendar-week-view";
import { CalendarDayView } from "./calendar-day-view";

export type CalendarViewMode = "dia" | "semana" | "mes";

interface EmployeeCalendarBodyProps {
  storeId: string;
}

export function EmployeeCalendarBody({ storeId }: EmployeeCalendarBodyProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<CalendarViewMode>("mes");
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [appointments, setAppointments] = useState<
    EmployeeCalendarAppointment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth() + 1;

  useEffect(() => {
    if (!storeId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    async function loadMonthBookings() {
      try {
        const calendarRes = await getStoreBookingsCalendar(storeId, {
          year: selectedYear,
          month: selectedMonth,
        });

        const dateSet = new Set<string>(calendarRes.datesWithBookings ?? []);
        dateSet.add(toDateKey(selectedDate));

        const results = await Promise.allSettled(
          Array.from(dateSet).map((dateStr) =>
            getStoreBookingsOverview(storeId, dateStr)
          )
        );

        if (!isMounted) return;

        const all: EmployeeCalendarAppointment[] = [];
        for (const r of results) {
          if (r.status === "fulfilled" && Array.isArray(r.value.bookings)) {
            for (const b of r.value.bookings) {
              all.push(mapOverviewToCalendarAppointment(b));
            }
          }
        }
        setAppointments(all);
      } catch (err) {
        console.warn(
          "[EmployeeCalendarBody] Falha ao carregar calendário:",
          err
        );
        if (isMounted) setAppointments([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadMonthBookings();

    return () => {
      isMounted = false;
    };
  }, [storeId, selectedYear, selectedMonth, selectedDate]);

  function handleGoToToday() {
    setSelectedDate(new Date());
  }

  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      {/* Botão de voltar — padrão Agilis */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Coluna central máx 705px */}
      <main className="mx-auto flex w-full max-w-[705px] flex-col gap-5 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-bold text-foreground leading-tight tracking-tight">
              Meu calendário
            </h1>
            <p className="mt-1 text-[15px] text-muted-foreground">
              Visualize seus atendimentos por dia, semana ou mês
            </p>
          </div>
          {isLoading && (
            <Loader2 className="mt-2 size-5 animate-spin text-primary shrink-0" />
          )}
        </div>

        {/* Seletor Segmented: Dia | Semana | Mês */}
        <div
          role="group"
          aria-label="Modo de visualização"
          className="inline-flex self-start rounded-[12px] border border-border bg-card p-1 gap-1 shadow-sm"
        >
          <button
            type="button"
            onClick={() => setViewMode("dia")}
            aria-pressed={viewMode === "dia"}
            className={[
              "rounded-[9px] px-4 py-1.5 text-[13.5px] font-semibold transition-colors cursor-pointer",
              viewMode === "dia"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            Dia
          </button>
          <button
            type="button"
            onClick={() => setViewMode("semana")}
            aria-pressed={viewMode === "semana"}
            className={[
              "rounded-[9px] px-4 py-1.5 text-[13.5px] font-semibold transition-colors cursor-pointer",
              viewMode === "semana"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            Semana
          </button>
          <button
            type="button"
            onClick={() => setViewMode("mes")}
            aria-pressed={viewMode === "mes"}
            className={[
              "rounded-[9px] px-4 py-1.5 text-[13.5px] font-semibold transition-colors cursor-pointer",
              viewMode === "mes"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            Mês
          </button>
        </div>

        {/* Conteúdo visual selecionado */}
        {viewMode === "mes" && (
          <CalendarMonthView
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            appointments={appointments}
            onGoToToday={handleGoToToday}
          />
        )}

        {viewMode === "semana" && (
          <CalendarWeekView
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            appointments={appointments}
            onGoToToday={handleGoToToday}
          />
        )}

        {viewMode === "dia" && (
          <CalendarDayView
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            appointments={appointments}
            onGoToToday={handleGoToToday}
          />
        )}
      </main>
    </div>
  );
}

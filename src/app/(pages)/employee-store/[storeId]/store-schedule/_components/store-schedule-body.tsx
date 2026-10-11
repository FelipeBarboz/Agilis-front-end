"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MOCK_STORE_TEAM } from "@/lib/mocks/store-roster";
import { ScheduleWeekView } from "./schedule-week-view";
import { ScheduleDayView } from "./schedule-day-view";

export type ScheduleViewMode = "dia" | "semana";

interface StoreScheduleBodyProps {
  storeId: string;
}

export function StoreScheduleBody({ storeId: _storeId }: StoreScheduleBodyProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ScheduleViewMode>("semana");
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const team = MOCK_STORE_TEAM;

  function handleGoToToday() {
    setSelectedDate(new Date());
  }

  function handleJumpToDay(day: Date) {
    setSelectedDate(day);
    setViewMode("dia");
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
        <div>
          <h1 className="text-[28px] font-bold text-foreground leading-tight tracking-tight">
            Escala da Loja
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Veja a escala completa de todos os funcionários
          </p>
        </div>

        {/* Seletor Segmented: Dia | Semana */}
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
              "rounded-[9px] px-5 py-1.5 text-[13.5px] font-semibold transition-colors cursor-pointer",
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
              "rounded-[9px] px-5 py-1.5 text-[13.5px] font-semibold transition-colors cursor-pointer",
              viewMode === "semana"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            Semana
          </button>
        </div>

        {/* Conteúdo visual selecionado */}
        {viewMode === "semana" ? (
          <ScheduleWeekView
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onJumpToDay={handleJumpToDay}
            team={team}
            onGoToToday={handleGoToToday}
          />
        ) : (
          <ScheduleDayView
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            team={team}
            onGoToToday={handleGoToToday}
          />
        )}
      </main>
    </div>
  );
}

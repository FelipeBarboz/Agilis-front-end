"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarPlus, Settings2 } from "lucide-react";
import {
  getStoreTeamFromStorage,
  saveStoreTeamToStorage,
  type StoreTeamMember,
} from "@/lib/mocks/store-roster";
import { ScheduleWeekView } from "./schedule-week-view";
import { ScheduleDayView } from "./schedule-day-view";
import { ManageScheduleModal } from "./manage-schedule-modal";

export type ScheduleViewMode = "dia" | "semana";

interface StoreScheduleBodyProps {
  storeId?: string;
  canEdit?: boolean;
}

export function StoreScheduleBody({
  storeId = "store-super-pinturas",
  canEdit = true,
}: StoreScheduleBodyProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ScheduleViewMode>("semana");
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [team, setTeam] = useState<StoreTeamMember[]>(() =>
    getStoreTeamFromStorage(storeId)
  );
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  useEffect(() => {
    const handleSync = () => {
      setTeam(getStoreTeamFromStorage(storeId));
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("roster-update", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("roster-update", handleSync);
    };
  }, [storeId]);

  function handleGoToToday() {
    setSelectedDate(new Date());
  }

  function handleJumpToDay(day: Date) {
    setSelectedDate(day);
    setViewMode("dia");
  }

  function handleOpenCreateModal() {
    setEditingMemberId("new");
    setIsManageModalOpen(true);
  }

  function handleOpenEditModal(memberId?: string) {
    setEditingMemberId(memberId ?? (team[0]?.id || "new"));
    setIsManageModalOpen(true);
  }

  function handleSaveTeam(updatedTeam: StoreTeamMember[]) {
    setTeam(updatedTeam);
    saveStoreTeamToStorage(updatedTeam, storeId);
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

      {/* Coluna central máx 760px */}
      <main className="mx-auto flex w-full max-w-[760px] flex-col gap-5 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-foreground leading-tight tracking-tight">
              Escala da Loja
            </h1>
            <p className="mt-1 text-[15px] text-muted-foreground">
              Veja, crie e edite a escala de turnos de todos os colaboradores
            </p>
          </div>

          {canEdit && (
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95 cursor-pointer"
              >
                <CalendarPlus className="size-4" />
                <span>+ Criar Escala</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenEditModal()}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer shadow-2xs"
              >
                <Settings2 className="size-4 text-muted-foreground" />
                <span className="hidden sm:inline">Gerenciar</span>
              </button>
            </div>
          )}
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
            onOpenEditModal={handleOpenEditModal}
            canEdit={canEdit}
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

      {/* Modal de Criar / Editar Escala */}
      <ManageScheduleModal
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setEditingMemberId(null);
        }}
        team={team}
        onSaveTeam={handleSaveTeam}
        initialMemberId={editingMemberId}
      />
    </div>
  );
}

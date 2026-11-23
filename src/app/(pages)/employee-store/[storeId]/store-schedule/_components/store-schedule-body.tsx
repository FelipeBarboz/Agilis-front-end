"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarPlus,
  RefreshCw,
  AlertCircle,
  Building2,
} from "lucide-react";
import {
  getStoreWeeklySchedule,
  getStoreDailySchedule,
  removeEmployeeFromSchedule,
  type StoreWeeklyScheduleResponse,
  type StoreDailyScheduleResponse,
} from "@/lib/services/employee-schedules-service";
import { getMyStores } from "@/lib/services/stores-service";
import { ScheduleWeekView } from "./schedule-week-view";
import { ScheduleDayView } from "./schedule-day-view";
import { ManageScheduleModal } from "./manage-schedule-modal";

export type ScheduleViewMode = "dia" | "semana";

interface StoreScheduleBodyProps {
  storeId?: string;
  canEdit?: boolean;
}

function getTodayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function StoreScheduleBody({
  storeId: initialStoreId,
  canEdit = true,
}: StoreScheduleBodyProps) {
  const router = useRouter();

  const [resolvedStoreId, setResolvedStoreId] = useState<string>(
    initialStoreId && !initialStoreId.startsWith("store-super") ? initialStoreId : ""
  );
  const [storeName, setStoreName] = useState<string>("");

  const [viewMode, setViewMode] = useState<ScheduleViewMode>("semana");
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  const [weeklyData, setWeeklyData] = useState<StoreWeeklyScheduleResponse | null>(null);
  const [dailyData, setDailyData] = useState<StoreDailyScheduleResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);

  // 1. Resolve Store ID se não fornecido via URL ou se genérico
  useEffect(() => {
    if (initialStoreId && !initialStoreId.startsWith("store-super") && initialStoreId !== resolvedStoreId) {
      setResolvedStoreId(initialStoreId);
    }
  }, [initialStoreId, resolvedStoreId]);

  useEffect(() => {
    let isMounted = true;
    if (!resolvedStoreId) {
      getMyStores()
        .then((stores) => {
          if (isMounted && stores && stores.length > 0) {
            const firstStore = stores[0];
            if (firstStore) {
              setResolvedStoreId(firstStore.storeId);
              setStoreName(firstStore.storeName || "Minha Loja");
            }
          }
        })
        .catch((err) => {
          console.warn("Erro ao buscar lojas do usuário:", err);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [resolvedStoreId]);

  // 2. Carrega os dados de escala (semanal ou diária)
  const loadScheduleData = useCallback(async () => {
    if (!resolvedStoreId) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (viewMode === "semana") {
        const res = await getStoreWeeklySchedule(resolvedStoreId, selectedDate);
        setWeeklyData(res);
      } else {
        const res = await getStoreDailySchedule(resolvedStoreId, selectedDate);
        setDailyData(res);
      }
    } catch (err: unknown) {
      console.warn("Falha ao carregar escala:", err);
      const msg = err instanceof Error ? err.message : "Erro ao carregar escala da loja.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedStoreId, viewMode, selectedDate]);

  useEffect(() => {
    if (resolvedStoreId) {
      void loadScheduleData();
    }
  }, [resolvedStoreId, viewMode, selectedDate, loadScheduleData]);

  // 3. Ações de criação e edição
  function handleOpenCreateModal() {
    setEditingEmployeeId(null);
    setIsManageModalOpen(true);
  }

  function handleOpenEditModal(empId?: string) {
    setEditingEmployeeId(empId ?? null);
    setIsManageModalOpen(true);
  }

  async function handleDeleteEmployee(empId: string) {
    if (!resolvedStoreId) return;
    try {
      await removeEmployeeFromSchedule(resolvedStoreId, empId);
      await loadScheduleData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao remover funcionário da escala.";
      alert(msg);
    }
  }

  return (
    <div className="relative flex flex-1 flex-col bg-muted/40 min-h-screen pb-20">
      {/* Botão de voltar */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-border text-foreground transition-colors hover:bg-muted cursor-pointer shadow-2xs"
      >
        <ArrowLeft size={18} />
      </button>

      {/* Conteúdo central */}
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pt-14 pb-12 sm:px-6 sm:py-8 lg:px-8">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Escala de Funcionários
              </h1>
              {storeName && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  <Building2 size={12} />
                  {storeName}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Gerencie turnos, folgas semanais e disponibilidade da sua equipe
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => {
                void loadScheduleData();
              }}
              aria-label="Atualizar dados"
              disabled={isLoading}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>

            {canEdit && (
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all active:scale-95 cursor-pointer"
              >
                <CalendarPlus size={15} />
                <span>Configurar Escala</span>
              </button>
            )}
          </div>
        </div>

        {/* Mensagem de Erro de Conexão ou Carregamento */}
        {errorMsg && (
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-700 dark:text-amber-300">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={18} className="shrink-0 text-amber-600" />
              <span>{errorMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                void loadScheduleData();
              }}
              className="font-bold underline hover:opacity-80 cursor-pointer"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Alternador de Visualização: Dia / Semana */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div
            role="group"
            aria-label="Modo de visualização"
            className="inline-flex rounded-xl border border-border bg-card p-1 gap-1 shadow-2xs"
          >
            <button
              type="button"
              onClick={() => setViewMode("semana")}
              aria-pressed={viewMode === "semana"}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                viewMode === "semana"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Visualização Semanal
            </button>
            <button
              type="button"
              onClick={() => setViewMode("dia")}
              aria-pressed={viewMode === "dia"}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                viewMode === "dia"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Visualização Diária
            </button>
          </div>
        </div>

        {/* Visualização Ativa */}
        {viewMode === "semana" ? (
          <ScheduleWeekView
            data={weeklyData}
            isLoading={isLoading}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onOpenEditModal={handleOpenEditModal}
            onDeleteEmployee={handleDeleteEmployee}
            canEdit={canEdit}
          />
        ) : (
          <ScheduleDayView
            data={dailyData}
            isLoading={isLoading}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        )}
      </main>

      {/* Modal de Gestão de Escala Semanal */}
      <ManageScheduleModal
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setEditingEmployeeId(null);
        }}
        storeId={resolvedStoreId}
        employees={weeklyData?.employees ?? []}
        initialEmployeeId={editingEmployeeId}
        onSuccess={loadScheduleData}
      />
    </div>
  );
}

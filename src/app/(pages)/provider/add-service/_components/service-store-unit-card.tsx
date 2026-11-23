import { Building2, ChevronDown, Store, AlertCircle, Plus } from "lucide-react";
import Link from "next/link";
import type { MyStore, StoreUnitResponse } from "@/lib/services/stores-service";

interface ServiceStoreUnitCardProps {
  stores: MyStore[];
  selectedStoreId: string;
  onStoreChange: (storeId: string) => void;
  units: StoreUnitResponse[];
  selectedUnitId: string;
  onUnitChange: (unitId: string) => void;
  isLoadingStores: boolean;
  isLoadingUnits: boolean;
}

export function ServiceStoreUnitCard({
  stores,
  selectedStoreId,
  onStoreChange,
  units,
  selectedUnitId,
  onUnitChange,
  isLoadingStores,
  isLoadingUnits,
}: ServiceStoreUnitCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Store className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Loja e Unidade
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Vincule o serviço à sua loja e unidade responsável
          </p>
        </div>
      </div>

      {isLoadingStores ? (
        <div className="flex items-center gap-3 py-3 text-sm text-muted-foreground">
          <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Carregando suas lojas...</span>
        </div>
      ) : stores.length === 0 ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-300">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Nenhuma loja encontrada</span>
          </div>
          <p className="text-xs">
            Para publicar e gerenciar serviços, você precisa cadastrar sua loja primeiro.
          </p>
          <div>
            <Link
              href="/provider/create-store"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-700 transition-colors"
            >
              <Plus className="size-3.5" />
              Cadastrar Loja
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Loja */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="storeSelect" className="text-xs font-bold text-foreground">
              Loja prestadora <span className="text-primary">*</span>
            </label>
            {stores.length === 1 ? (
              <div className="flex h-11 items-center justify-between rounded-xl border border-border bg-muted/40 px-3.5 text-sm font-medium text-foreground">
                <span className="truncate">{stores[0]?.storeName ?? "Loja"}</span>
                <span className="text-[11px] font-semibold text-muted-foreground">Única</span>
              </div>
            ) : (
              <div className="relative">
                <select
                  id="storeSelect"
                  value={selectedStoreId}
                  onChange={(e) => onStoreChange(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-input bg-background px-3.5 pr-10 text-sm text-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  {stores.map((s) => (
                    <option key={s.storeId} value={s.storeId}>
                      {s.storeName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Unidade */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="unitSelect" className="text-xs font-bold text-foreground">
              Unidade responsável <span className="text-primary">*</span>
            </label>
            {isLoadingUnits ? (
              <div className="flex h-11 items-center gap-2 rounded-xl border border-border bg-muted/40 px-3.5 text-xs text-muted-foreground">
                <div className="size-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Buscando unidades...</span>
              </div>
            ) : units.length === 0 ? (
              <div className="flex h-11 items-center justify-between rounded-xl border border-border bg-muted/40 px-3.5 text-xs text-muted-foreground">
                <span>Unidade principal padrão</span>
                <Building2 className="size-3.5 text-muted-foreground" />
              </div>
            ) : units.length === 1 ? (
              <div className="flex h-11 items-center justify-between rounded-xl border border-border bg-muted/40 px-3.5 text-sm font-medium text-foreground">
                <span className="truncate">{units[0]?.name || "Unidade Principal"}</span>
                <span className="text-[11px] font-semibold text-muted-foreground">Principal</span>
              </div>
            ) : (
              <div className="relative">
                <select
                  id="unitSelect"
                  value={selectedUnitId}
                  onChange={(e) => onUnitChange(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-input bg-background px-3.5 pr-10 text-sm text-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  {units.map((u, idx) => {
                    const uId = u.unitId || u.id || `unit-${idx}`;
                    return (
                      <option key={uId} value={uId}>
                        {u.name || `Unidade ${idx + 1}`}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

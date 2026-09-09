"use client";

import { useState } from "react";
import {
  MapPin,
  SlidersHorizontal,
  Star,
  Store as StoreIcon,
  Briefcase,
  Layers,
  RotateCcw,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type EntityType = "todos" | "servicos" | "lojas";

export type Filters = {
  type: EntityType;
  state: string;
  city: string;
  minPrice: number | "";
  maxPrice: number | "";
  priceRange: [number, number];
  rating: number;
};

interface FilterPanelProps {
  onApply: (filters: Filters) => void;
  onClear: () => void;
  initialFilters?: Partial<Filters>;
}

const BRAZILIAN_STATES = [
  { uf: "", name: "Todos os estados (UF)" },
  { uf: "AC", name: "AC - Acre" },
  { uf: "AL", name: "AL - Alagoas" },
  { uf: "AP", name: "AP - Amapá" },
  { uf: "AM", name: "AM - Amazonas" },
  { uf: "BA", name: "BA - Bahia" },
  { uf: "CE", name: "CE - Ceará" },
  { uf: "DF", name: "DF - Distrito Federal" },
  { uf: "ES", name: "ES - Espírito Santo" },
  { uf: "GO", name: "GO - Goiás" },
  { uf: "MA", name: "MA - Maranhão" },
  { uf: "MT", name: "MT - Mato Grosso" },
  { uf: "MS", name: "MS - Mato Grosso do Sul" },
  { uf: "MG", name: "MG - Minas Gerais" },
  { uf: "PA", name: "PA - Pará" },
  { uf: "PB", name: "PB - Paraíba" },
  { uf: "PR", name: "PR - Paraná" },
  { uf: "PE", name: "PE - Pernambuco" },
  { uf: "PI", name: "PI - Piauí" },
  { uf: "RJ", name: "RJ - Rio de Janeiro" },
  { uf: "RN", name: "RN - Rio Grande do Norte" },
  { uf: "RS", name: "RS - Rio Grande do Sul" },
  { uf: "RO", name: "RO - Rondônia" },
  { uf: "RR", name: "RR - Roraima" },
  { uf: "SC", name: "SC - Santa Catarina" },
  { uf: "SP", name: "SP - São Paulo" },
  { uf: "SE", name: "SE - Sergipe" },
  { uf: "TO", name: "TO - Tocantins" },
];

const ratingOptions = [
  { value: 0, label: "Todas" },
  { value: 3, label: "3.0+" },
  { value: 4, label: "4.0+" },
  { value: 4.5, label: "4.5+" },
  { value: 5, label: "5.0" },
];

export function FilterPanel({ onApply, onClear, initialFilters }: FilterPanelProps) {
  const [type, setType] = useState<EntityType>(initialFilters?.type ?? "todos");
  const [state, setState] = useState(initialFilters?.state ?? "");
  const [city, setCity] = useState(initialFilters?.city ?? "");
  const [minPrice, setMinPrice] = useState<number | "">(initialFilters?.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState<number | "">(initialFilters?.maxPrice ?? "");
  const [rating, setRating] = useState<number>(initialFilters?.rating ?? 0);

  const hasActiveFilters =
    type !== "todos" ||
    state !== "" ||
    city !== "" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    rating !== 0;

  function handleApply() {
    const minVal = minPrice === "" ? 0 : Number(minPrice);
    const maxVal = maxPrice === "" ? 10000 : Number(maxPrice);
    onApply({
      type,
      state,
      city,
      minPrice,
      maxPrice,
      priceRange: [minVal, maxVal],
      rating,
    });
  }

  function handleClear() {
    setType("todos");
    setState("");
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setRating(0);
    onClear();
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs transition-all">
      {/* Topo do Painel de Filtros */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3.5">
        {/* Título & Indicador de Filtros */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <SlidersHorizontal size={15} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Filtros</span>
            {hasActiveFilters && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                Ativos
              </span>
            )}
          </div>
        </div>

        {/* Filtro de Tipo: Serviços vs Lojas vs Todos */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-muted p-1 border border-border/60">
            <button
              type="button"
              onClick={() => setType("todos")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                type === "todos"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers size={13} />
              <span>Todos</span>
            </button>
            <button
              type="button"
              onClick={() => setType("servicos")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                type === "servicos"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase size={13} />
              <span>Serviços</span>
            </button>
            <button
              type="button"
              onClick={() => setType("lojas")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                type === "lojas"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <StoreIcon size={13} />
              <span>Lojas</span>
            </button>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Limpar todos os filtros"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid Principal dos Filtros */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 items-end">
        {/* 1. Localização: Estado (UF) e Cidade */}
        <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-4">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin size={13} className="text-primary" />
            <span>Localização (Estado e Cidade)</span>
          </label>
          <div className="flex items-center gap-2">
            {/* Seletor de Estado */}
            <div className="relative w-28 sm:w-32 shrink-0">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="h-9 w-full rounded-xl border border-input bg-background px-2.5 text-xs font-medium text-foreground shadow-2xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {BRAZILIAN_STATES.map((st) => (
                  <option key={st.uf} value={st.uf}>
                    {st.uf ? st.uf : "UF (Todos)"}
                  </option>
                ))}
              </select>
            </div>

            {/* Input de Cidade */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Nome da cidade..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-9 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* 2. Preço: Inputs de Mínimo e Máximo */}
        <div className="flex flex-col gap-1.5 sm:col-span-1 lg:col-span-3">
          <label className="text-xs font-medium text-muted-foreground">
            Faixa de Preço (R$)
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground">
                R$
              </span>
              <input
                type="number"
                min={0}
                placeholder="Mín"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))
                }
                className="h-9 w-full rounded-xl border border-input bg-background pl-7 pr-2 text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground">à</span>
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground">
                R$
              </span>
              <input
                type="number"
                min={0}
                placeholder="Máx"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))
                }
                className="h-9 w-full rounded-xl border border-input bg-background pl-7 pr-2 text-xs text-foreground placeholder:text-muted-foreground/60 shadow-2xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* 3. Avaliação: Seletor Interativo e Prático com Estrelas */}
        <div className="flex flex-col gap-1.5 sm:col-span-1 lg:col-span-3">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>Avaliação Mínima</span>
          </label>
          <div className="flex items-center gap-1 flex-wrap">
            {ratingOptions.map((opt) => {
              const isSelected = rating === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRating(opt.value)}
                  className={`flex items-center gap-1 h-9 px-2.5 rounded-xl text-xs font-medium border transition-all active:scale-95 ${
                    isSelected
                      ? "bg-amber-500/15 border-amber-500/60 text-amber-700 dark:text-amber-300 font-semibold shadow-2xs"
                      : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                >
                  {opt.value > 0 && (
                    <Star
                      size={12}
                      className={
                        isSelected
                          ? "fill-amber-500 text-amber-500"
                          : "fill-amber-400 text-amber-400"
                      }
                    />
                  )}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Botão de Aplicar */}
        <div className="flex sm:col-span-2 lg:col-span-2">
          <Button
            type="button"
            onClick={handleApply}
            className="h-9 w-full rounded-xl gap-1.5 font-semibold shadow-2xs active:scale-98 transition-all"
          >
            <Check size={14} />
            <span>Aplicar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
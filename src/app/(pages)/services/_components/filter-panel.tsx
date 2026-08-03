"use client";

import { useState } from "react";
import { MapPin, SlidersHorizontal, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PriceSlider } from "./price-slider";

export type Filters = {
  city: string;
  priceRange: [number, number];
  rating: number;
};

interface FilterPanelProps {
  onApply: (filters: Filters) => void;
  onClear: () => void;
}

const PRICE_MIN = 0;
const PRICE_MAX = 1000;

const ratingOptions = [
  { value: 0,   label: "Qualquer avaliação" },
  { value: 3,   label: "3+ estrelas" },
  { value: 4,   label: "4+ estrelas" },
  { value: 4.5, label: "4.5+ estrelas" },
];

export function FilterPanel({ onApply, onClear }: FilterPanelProps) {
  const [city, setCity] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [rating, setRating] = useState(0);

  function handleApply() {
    onApply({ city, priceRange, rating });
  }

  function handleClear() {
    setCity("");
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setRating(0);
    onClear();
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal size={15} />
          Filtros
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-medium text-primary hover:underline"
        >
          Limpar
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-4">

        {/* Localização */}
        <div className="flex min-w-48 flex-1 flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Localização
          </label>
          <Input
            placeholder="Digite sua cidade"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            leftIcon={<MapPin size={14} />}
            className="h-9 text-xs"
          />
        </div>

        {/* Preço */}
        <div className="flex min-w-48 flex-1 flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Preço (R$)
          </label>
          <PriceSlider
            min={PRICE_MIN}
            max={PRICE_MAX}
            value={priceRange}
            onChange={setPriceRange}
          />
        </div>

        {/* Avaliação */}
        <div className="flex min-w-40 flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Avaliação
          </label>
          <div className="relative">
            <Star size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-xs text-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {ratingOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botão aplicar */}
        <Button
          type="button"
          size="sm"
          onClick={handleApply}
          className="h-9 shrink-0"
        >
          Aplicar
        </Button>

      </div>
    </div>
  );
}
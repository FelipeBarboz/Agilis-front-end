"use client";

import { useState } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ServiceCoverageAreaInput } from "@/lib/services/services-service";

interface ServiceCoverageAreasCardProps {
  areas: ServiceCoverageAreaInput[];
  onChange: (areas: ServiceCoverageAreaInput[]) => void;
}

export function ServiceCoverageAreasCard({
  areas,
  onChange,
}: ServiceCoverageAreasCardProps) {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const handleAdd = () => {
    const trimmedCity = city.trim();
    const trimmedState = state.trim().toUpperCase().slice(0, 2);
    if (!trimmedCity || trimmedState.length !== 2) return;

    const alreadyExists = areas.some(
      (a) =>
        a.city.toLowerCase() === trimmedCity.toLowerCase() &&
        a.state.toUpperCase() === trimmedState
    );
    if (alreadyExists) return;

    onChange([...areas, { city: trimmedCity, state: trimmedState }]);
    setCity("");
    setState("");
  };

  const handleRemove = (index: number) => {
    onChange(areas.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MapPin className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Áreas de Cobertura
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Opcional: defina cidades específicas atendidas por este serviço
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Cidade (ex: São Paulo)"
          className="h-10 flex-1 rounded-xl"
        />
        <Input
          value={state}
          onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
          placeholder="UF"
          maxLength={2}
          className="h-10 w-full rounded-xl sm:w-20 uppercase"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          disabled={!city.trim() || state.trim().length !== 2}
          className="h-10 rounded-xl gap-1.5"
        >
          <Plus className="size-4" />
          Adicionar
        </Button>
      </div>

      {areas.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
          Nenhuma cidade específica informada. Será usada a área padrão da loja.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {areas.map((area, index) => (
            <span
              key={`${area.city}-${area.state}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            >
              {area.city} - {area.state}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label={`Remover ${area.city}`}
                className="rounded-full p-0.5 hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

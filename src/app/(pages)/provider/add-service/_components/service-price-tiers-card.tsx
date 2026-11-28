"use client";

import { Layers, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ServicePriceTierInput } from "@/lib/services/services-service";

interface ServicePriceTiersCardProps {
  tiers: ServicePriceTierInput[];
  onChange: (tiers: ServicePriceTierInput[]) => void;
}

export function ServicePriceTiersCard({
  tiers,
  onChange,
}: ServicePriceTiersCardProps) {
  const handleAddTier = () => {
    onChange([...tiers, { name: "", description: "", price: 0 }]);
  };

  const handleRemoveTier = (index: number) => {
    onChange(tiers.filter((_, i) => i !== index));
  };

  const handleUpdateTier = (
    index: number,
    field: keyof ServicePriceTierInput,
    value: string | number
  ) => {
    onChange(
      tiers.map((tier, i) => (i === index ? { ...tier, [field]: value } : tier))
    );
  };

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Layers className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Faixas de Preço (Pacotes)
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Opcional: crie pacotes com preços diferentes (ex: Básico, Completo)
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddTier}
          className="rounded-xl gap-1.5"
        >
          <Plus className="size-4" />
          Adicionar faixa
        </Button>
      </div>

      {tiers.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
          Nenhuma faixa adicionada. Será usado apenas o valor base do serviço.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/20 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-foreground">
                  Faixa #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveTier(index)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                  Remover
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-foreground">
                    Nome do pacote
                  </label>
                  <Input
                    value={tier.name}
                    onChange={(e) =>
                      handleUpdateTier(index, "name", e.target.value)
                    }
                    placeholder="Ex: Básico"
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-foreground">
                    Preço (R$)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={tier.price || ""}
                    onChange={(e) =>
                      handleUpdateTier(
                        index,
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0,00"
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">
                  Descrição
                </label>
                <Input
                  value={tier.description}
                  onChange={(e) =>
                    handleUpdateTier(index, "description", e.target.value)
                  }
                  placeholder="Ex: Atendimento padrão até 2 horas"
                  className="h-10 rounded-xl"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

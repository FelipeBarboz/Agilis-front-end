"use client";

import { useState } from "react";
import { type Service } from "@/lib/mocks/services";
import { Check, Layers } from "lucide-react";

interface ServicePackagesProps {
  service: Service;
  onSelect: (price: number, label: string) => void;
}

export function ServicePackages({ service, onSelect }: ServicePackagesProps) {
  const [selected, setSelected] = useState(0);

  function handleSelect(index: number, price: number, label: string) {
    setSelected(index);
    onSelect(price, label);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 sm:p-7 shadow-xs ring-1 ring-foreground/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers size={16} />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Escolha o pacote ideal</h2>
            <p className="text-xs text-muted-foreground">Selecione o plano conforme o tamanho da sua necessidade</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {service.packages.map((pkg, index) => {
          const isSelected = selected === index;

          return (
            <button
              key={pkg.label}
              type="button"
              onClick={() => handleSelect(index, pkg.price, pkg.label)}
              className={`group flex items-center justify-between rounded-xl border p-4 text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/30"
                  : "border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                      : "border-muted-foreground/30 bg-transparent group-hover:border-primary/60"
                  }`}
                >
                  {isSelected && <Check className="size-3.5 stroke-[3]" />}
                </div>

                <div className="flex flex-col">
                  <span className={`text-sm font-bold transition-colors ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {pkg.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{pkg.description}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-base font-extrabold text-foreground">
                  R$ {pkg.price.toFixed(2).replace(".", ",")}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">valor total</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
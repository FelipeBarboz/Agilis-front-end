"use client";

import { useState } from "react";
import { type Service } from "@/lib/mocks/services";
import { Check } from "lucide-react";

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
    <div className="flex flex-col gap-3 border-t pt-4">
      <div>
        <h2 className="text-base font-bold text-foreground">Escolha seu pacote</h2>
        <p className="text-xs text-muted-foreground">Selecione o plano ideal para a sua necessidade</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {service.packages.map((pkg, index) => {
          const isSelected = selected === index;

          return (
            <button
              key={pkg.label}
              type="button"
              onClick={() => handleSelect(index, pkg.price, pkg.label)}
              className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30"
                  : "border-border bg-white hover:border-primary/40 hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-muted-foreground/30 bg-transparent"
                  }`}
                >
                  {isSelected && <Check className="size-3.5" />}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">{pkg.label}</span>
                  <span className="text-xs text-muted-foreground">{pkg.description}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-sm font-extrabold text-primary">
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
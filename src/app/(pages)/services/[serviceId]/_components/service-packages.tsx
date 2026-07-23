"use client";

import { useState } from "react";
import { type Service } from "@/lib/mocks/services";

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
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-bold text-foreground">Preços e pacotes</h2>
      <div className="flex flex-col gap-2">
        {service.packages.map((pkg, index) => (
          <button
            key={pkg.label}
            type="button"
            onClick={() => handleSelect(index, pkg.price, pkg.label)}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
              selected === index
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${
                selected === index ? "bg-primary" : "bg-muted-foreground/30"
              }`} />
              <div>
                <p className="text-sm font-semibold text-foreground">{pkg.label}</p>
                <p className="text-xs text-muted-foreground">{pkg.description}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-primary">
              R$ {pkg.price.toFixed(2).replace(".", ",")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
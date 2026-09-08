"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPinned, Store, Users, ChevronDown, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AttendanceType = "CLIENT_LOCATION" | "FIXED_LOCATION" | "BOTH";

const ATTENDANCE_OPTIONS: {
  value: AttendanceType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "CLIENT_LOCATION",
    label: "No cliente",
    description: "Você vai até o local do cliente",
    icon: <MapPinned className="size-6" strokeWidth={1.5} />,
  },
  {
    value: "FIXED_LOCATION",
    label: "Local fixo",
    description: "Cliente vem ao seu estabelecimento",
    icon: <Store className="size-6" strokeWidth={1.5} />,
  },
  {
    value: "BOTH",
    label: "Ambos",
    description: "Flexível para os dois modelos",
    icon: <Users className="size-6" strokeWidth={1.5} />,
  },
];

export function AttendanceTypeForm() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<AttendanceType>("CLIENT_LOCATION");
  const [cities, setCities] = useState<string[]>([]);

  const handleRemoveCity = (cityToRemove: string) => {
    setCities(cities.filter((city) => city !== cityToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("form_attendanceArea", "true");
    router.push("/provider/create-store");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Tipo de atendimento */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-foreground">
          Tipo de atendimento <span className="text-primary">*</span>
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {ATTENDANCE_OPTIONS.map((opt) => {
            const isSelected = selectedType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedType(opt.value)}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus:ring-4 focus:ring-primary/20 sm:flex-col sm:items-center sm:gap-2 sm:text-center ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <div className={`shrink-0 ${
                  isSelected ? "text-primary" : "text-muted-foreground"
                }`}>
                  {opt.icon}
                </div>
                <div className="flex flex-col sm:items-center">
                  <span className="text-sm font-bold leading-tight">{opt.label}</span>
                  <span
                    className={`mt-0.5 text-xs leading-tight ${
                      isSelected ? "text-primary/70" : "text-muted-foreground"
                    }`}
                  >
                    {opt.description}
                  </span>
                </div>
                {isSelected && (
                  <div className="ml-auto shrink-0 flex size-5 items-center justify-center rounded-full bg-primary sm:hidden">
                    <div className="size-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Separador */}
      <div className="h-px bg-border" />

      {/* Raio de atendimento */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="radius" className="text-xs font-bold text-foreground">
          Raio de atendimento
        </label>
        <div className="relative">
          <select
            id="radius"
            className="h-11 w-full appearance-none rounded-xl border border-input bg-background px-3.5 pr-10 text-sm text-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            defaultValue="10"
          >
            <option value="5">Até 5 km</option>
            <option value="10">Até 10 km</option>
            <option value="20">Até 20 km</option>
            <option value="50">Até 50 km</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        </div>
      </div>

      {/* Endereço de referência */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="address" className="text-xs font-bold text-foreground">
          Endereço de referência
        </label>
        <textarea
          id="address"
          rows={2}
          placeholder="Ex: R. Cristóbal Cláudio Elilo, 88 - Parque Cecap, Guarulhos"
          className="w-full resize-none rounded-xl border border-input bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <p className="text-xs text-muted-foreground">
          Ponto de partida para calcular o raio de atendimento
        </p>
      </div>

      {/* Cidades atendidas */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-foreground">Cidades atendidas</p>

        {cities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <div
                key={city}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-muted px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                <span>{city}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCity(city)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm font-semibold text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20 cursor-pointer"
        >
          <Plus className="size-4" />
          Adicionar cidade
        </button>
      </div>

      {/* Separador */}
      <div className="h-px bg-border" />

      {/* Botões */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <Link
          href="/provider/create-store"
          className="flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:flex-1"
        >
          Cancelar
        </Link>
        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 sm:flex-[2] cursor-pointer"
        >
          Salvar e continuar
        </Button>
      </div>

    </form>
  );
}

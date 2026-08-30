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
        <p className="text-sm font-semibold text-white/80">
          Tipo de atendimento <span className="text-white/40">*</span>
        </p>
        <div className="grid grid-cols-3 gap-3">
          {ATTENDANCE_OPTIONS.map((opt) => {
            const isSelected = selectedType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedType(opt.value)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all focus:outline-none focus:ring-4 focus:ring-white/30 md:p-4 ${
                  isSelected
                    ? "border-white bg-white text-primary shadow-md"
                    : "border-transparent bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {opt.icon}
                <span className="text-xs font-bold leading-tight">{opt.label}</span>
                <span
                  className={`hidden text-[10px] leading-tight md:block ${
                    isSelected ? "text-muted-foreground" : "text-white/60"
                  }`}
                >
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Separador */}
      <div className="h-px bg-white/20" />

      {/* Raio de atendimento */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="radius" className="text-sm font-semibold text-white/80">
          Raio de atendimento
        </label>
        <div className="relative">
          <select
            id="radius"
            className="h-12 w-full appearance-none rounded-xl border-0 bg-white/95 px-4 pr-10 text-foreground shadow-sm focus:outline-none focus:ring-4 focus:ring-white/30 cursor-pointer"
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
        <label htmlFor="address" className="text-sm font-semibold text-white/80">
          Endereço de referência
        </label>
        <textarea
          id="address"
          rows={2}
          placeholder="Ex: R. Cristóbal Cláudio Elilo, 88 - Parque Cecap, Guarulhos"
          className="w-full resize-none rounded-xl border-0 bg-white/95 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 shadow-sm focus:outline-none focus:ring-4 focus:ring-white/30"
        />
        <p className="text-xs text-white/40">
          Ponto de partida para calcular o raio de atendimento
        </p>
      </div>

      {/* Cidades atendidas */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-white/80">Cidades atendidas</p>

        {cities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <div
                key={city}
                className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm"
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
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/30 text-sm font-semibold text-white transition-all hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/30 cursor-pointer"
        >
          <Plus className="size-4" />
          Adicionar cidade
        </button>
      </div>

      {/* Separador */}
      <div className="h-px bg-white/20" />

      {/* Botões */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/provider/create-store"
          className="flex h-12 w-full items-center justify-center rounded-xl border-2 border-white/25 text-sm font-bold text-white transition-all hover:bg-white/10 sm:flex-1"
        >
          Cancelar
        </Link>
        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-black text-sm font-bold text-white shadow-lg transition-all hover:bg-black/80 sm:flex-[2] cursor-pointer"
        >
          Salvar e continuar
        </Button>
      </div>

    </form>
  );
}

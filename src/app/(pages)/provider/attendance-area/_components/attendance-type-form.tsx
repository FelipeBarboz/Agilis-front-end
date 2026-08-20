"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPinned, Store, Users, ChevronDown, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

type AttendanceType = "CLIENT_LOCATION" | "FIXED_LOCATION" | "BOTH";

export function AttendanceTypeForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("form_attendanceArea", "true");
    router.push("/provider/create-store");
  };
  const [selectedType, setSelectedType] = useState<AttendanceType>("CLIENT_LOCATION");
  const [cities, setCities] = useState<string[]>([]);

  const handleRemoveCity = (cityToRemove: string) => {
    setCities(cities.filter(city => city !== cityToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      
      {/* Attendance Type Cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {/* No local do cliente */}
        <button
          type="button"
          onClick={() => setSelectedType("CLIENT_LOCATION")}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all focus:outline-none focus:ring-4 focus:ring-white/30 md:p-6 ${
            selectedType === "CLIENT_LOCATION"
              ? "border-[#008A5E] bg-white text-[#008A5E]"
              : "border-transparent bg-white text-foreground"
          }`}
        >
          <MapPinned className="size-8 md:size-10" strokeWidth={1.5} />
          <span className="text-center text-xs font-medium md:text-sm">
            No local do cliente
          </span>
        </button>

        {/* Local fixo */}
        <button
          type="button"
          onClick={() => setSelectedType("FIXED_LOCATION")}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all focus:outline-none focus:ring-4 focus:ring-white/30 md:p-6 ${
            selectedType === "FIXED_LOCATION"
              ? "border-[#008A5E] bg-white text-[#008A5E]"
              : "border-transparent bg-white text-foreground"
          }`}
        >
          <Store className="size-8 md:size-10" strokeWidth={1.5} />
          <span className="text-center text-xs font-medium md:text-sm">
            Local fixo
          </span>
        </button>

        {/* Ambos */}
        <button
          type="button"
          onClick={() => setSelectedType("BOTH")}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all focus:outline-none focus:ring-4 focus:ring-white/30 md:p-6 ${
            selectedType === "BOTH"
              ? "border-[#008A5E] bg-white text-[#008A5E]"
              : "border-transparent bg-white text-foreground"
          }`}
        >
          <Users className="size-8 md:size-10" strokeWidth={1.5} />
          <span className="text-center text-xs font-medium md:text-sm">
            Ambos
          </span>
        </button>
      </div>

      {/* Raio de atendimento */}
      <div className="flex flex-col gap-2">
        <label htmlFor="radius" className="text-sm font-medium text-white/90">
          Raio de atendimento
        </label>
        <div className="relative">
          <select
            id="radius"
            className="w-full appearance-none rounded-xl border-0 bg-white px-4 py-3 text-foreground shadow-sm focus:outline-none focus:ring-4 focus:ring-white/30 md:py-4 md:text-base cursor-pointer"
            defaultValue="10"
          >
            <option value="5">5km</option>
            <option value="10">10km</option>
            <option value="20">20km</option>
            <option value="50">50km</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground">
            <ChevronDown className="size-5" />
          </div>
        </div>
      </div>

      {/* Endereço da referência */}
      <div className="flex flex-col gap-2">
        <label htmlFor="address" className="text-sm font-medium text-white/90">
          Endereço da referência
        </label>
        <div className="relative">
          <textarea
            id="address"
            rows={2}
            placeholder="Ex: R. Cristóbal Cláudio Elilo, 88 - Parque Cecap, Guarulhos"
            className="w-full resize-none rounded-xl border-0 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-4 focus:ring-white/30 md:py-4 md:text-base"
          />
        </div>
      </div>

      {/* Cidades atendidas */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-white/90">
          Cidades atendidas
        </label>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {cities.map((city) => (
            <div
              key={city}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm"
            >
              <span>{city}</span>
              <button
                type="button"
                onClick={() => handleRemoveCity(city)}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006b49] px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#005a3d] focus:outline-none focus:ring-4 focus:ring-white/30 md:py-4 md:text-base"
        >
          <Plus className="size-5" />
          Adicionar cidade
        </button>
      </div>

      {/* Salvar */}
      <Button
        type="submit"
        className="mt-2 w-full rounded-xl bg-black py-6 text-base font-bold text-white shadow-lg transition-all hover:bg-black/80 hover:shadow-xl focus:ring-4 focus:ring-black/30 md:py-7 md:text-lg"
      >
        Salvar
      </Button>

    </form>
  );
}

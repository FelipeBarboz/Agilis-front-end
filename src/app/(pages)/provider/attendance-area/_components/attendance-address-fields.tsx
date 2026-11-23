"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ChevronDown, MapPin, Loader2 } from "lucide-react";

import type { AttendanceType } from "./attendance-type-selector";

export const BRAZILIAN_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export function formatCep(value: string): string {
  const digits = (value || "").replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

interface AttendanceAddressFieldsProps {
  selectedType: AttendanceType;
  cep: string;
  onCepChange: (value: string) => void;
  street: string;
  onStreetChange: (value: string) => void;
  number: string;
  onNumberChange: (value: string) => void;
  complement: string;
  onComplementChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  state: string;
  onStateChange: (value: string) => void;
}

export function AttendanceAddressFields({
  selectedType,
  cep,
  onCepChange,
  street,
  onStreetChange,
  number,
  onNumberChange,
  complement,
  onComplementChange,
  city,
  onCityChange,
  state,
  onStateChange,
}: AttendanceAddressFieldsProps) {
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  // Não exibe campos de endereço para atendimento exclusivo no cliente
  if (selectedType === "ON_CLIENT") {
    return null;
  }

  const handleCepChange = async (val: string) => {
    const formatted = formatCep(val);
    onCepChange(formatted);

    const clean = formatted.replace(/\D/g, "");
    if (clean.length === 8) {
      try {
        setIsSearchingCep(true);
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        if (res.ok) {
          const data = await res.json();
          if (!data.erro) {
            if (data.logradouro) onStreetChange(data.logradouro);
            if (data.localidade) onCityChange(data.localidade);
            if (data.uf) onStateChange(data.uf);
          }
        }
      } catch {
        // Fallback silencioso se offline ou bloqueado
      } finally {
        setIsSearchingCep(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <MapPin className="size-4 text-primary" />
        <h2 className="text-sm font-bold text-foreground">
          Endereço da unidade
        </h2>
      </div>
      <p className="-mt-2 text-xs text-muted-foreground">
        Endereço físico obrigatório do estabelecimento onde os clientes serão atendidos
      </p>

      {/* CEP */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="cep" className="text-xs font-bold text-foreground">
            CEP <span className="text-primary">*</span>
          </label>
          {isSearchingCep && (
            <span className="flex items-center gap-1 text-[11px] text-primary">
              <Loader2 className="size-3 animate-spin" />
              Buscando endereço...
            </span>
          )}
        </div>
        <Input
          id="cep"
          required
          inputMode="numeric"
          placeholder="00000-000"
          value={cep}
          onChange={(e) => handleCepChange(e.target.value)}
          className="h-11 rounded-xl"
        />
      </div>

      {/* Rua e Número */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1.5 sm:col-span-3">
          <label htmlFor="street" className="text-xs font-bold text-foreground">
            Rua / Logradouro <span className="text-primary">*</span>
          </label>
          <Input
            id="street"
            required
            placeholder="Ex: Av. Paulista, Rua Cristóbal Cláudio Elilo"
            value={street}
            onChange={(e) => onStreetChange(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-1">
          <label htmlFor="number" className="text-xs font-bold text-foreground">
            Número <span className="text-primary">*</span>
          </label>
          <Input
            id="number"
            required
            placeholder="Ex: 88 ou S/N"
            value={number}
            onChange={(e) => onNumberChange(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      {/* Complemento */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="complement" className="text-xs font-bold text-foreground">
          Complemento <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
        </label>
        <Input
          id="complement"
          placeholder="Ex: Sala 4, Bloco B, Galpão 2"
          value={complement}
          onChange={(e) => onComplementChange(e.target.value)}
          className="h-11 rounded-xl"
        />
      </div>

      {/* Cidade e Estado */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="city" className="text-xs font-bold text-foreground">
            Cidade <span className="text-primary">*</span>
          </label>
          <Input
            id="city"
            required
            placeholder="Ex: Guarulhos, São Paulo"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-1">
          <label htmlFor="state" className="text-xs font-bold text-foreground">
            UF <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <select
              id="state"
              required
              className="h-11 w-full appearance-none rounded-xl border border-input bg-background px-3.5 pr-8 text-sm text-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              value={state}
              onChange={(e) => onStateChange(e.target.value)}
            >
              {BRAZILIAN_STATES.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

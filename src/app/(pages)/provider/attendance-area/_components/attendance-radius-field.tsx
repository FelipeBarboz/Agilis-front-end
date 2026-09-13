import { ChevronDown } from "lucide-react";

export function AttendanceRadiusField() {
  return (
    <>
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
    </>
  );
}

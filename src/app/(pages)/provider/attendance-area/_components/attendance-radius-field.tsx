import { ChevronDown } from "lucide-react";
import type { AttendanceType } from "./attendance-type-selector";

interface AttendanceRadiusFieldProps {
  selectedType: AttendanceType;
  radiusKm: number;
  onRadiusChange: (value: number) => void;
}

export function AttendanceRadiusField({
  selectedType,
  radiusKm,
  onRadiusChange,
}: AttendanceRadiusFieldProps) {
  if (selectedType === "FIXED_LOCATION") {
    return (
      <div className="rounded-xl border border-border bg-muted/40 p-3.5 text-xs text-muted-foreground">
        O raio de deslocamento não é aplicável para atendimento exclusivo em local fixo.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="radius" className="text-xs font-bold text-foreground">
        Raio de atendimento <span className="text-primary">*</span>
      </label>
      <div className="relative">
        <select
          id="radius"
          className="h-11 w-full appearance-none rounded-xl border border-input bg-background px-3.5 pr-10 text-sm text-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          value={radiusKm}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
        >
          <option value="5">Até 5 km</option>
          <option value="10">Até 10 km</option>
          <option value="20">Até 20 km</option>
          <option value="50">Até 50 km</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      </div>
      <p className="text-xs text-muted-foreground">
        Distância máxima que sua equipe atende a partir do ponto base (valores aceitos: 5, 10, 20 ou 50 km)
      </p>
    </div>
  );
}

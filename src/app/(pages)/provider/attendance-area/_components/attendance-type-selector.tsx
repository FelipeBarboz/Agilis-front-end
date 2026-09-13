import type { ReactNode } from "react";
import { MapPinned, Store, Users } from "lucide-react";

export type AttendanceType = "CLIENT_LOCATION" | "FIXED_LOCATION" | "BOTH";

interface AttendanceOption {
  value: AttendanceType;
  label: string;
  description: string;
  icon: ReactNode;
}

const ATTENDANCE_OPTIONS: AttendanceOption[] = [
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

interface AttendanceTypeSelectorProps {
  selectedType: AttendanceType;
  onChange: (type: AttendanceType) => void;
}

export function AttendanceTypeSelector({
  selectedType,
  onChange,
}: AttendanceTypeSelectorProps) {
  return (
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
              onClick={() => onChange(opt.value)}
              className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus:ring-4 focus:ring-primary/20 sm:flex-col sm:items-center sm:gap-2 sm:text-center ${
                isSelected
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <div
                className={`shrink-0 ${
                  isSelected ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {opt.icon}
              </div>
              <div className="flex flex-col sm:items-center">
                <span className="text-sm font-bold leading-tight">
                  {opt.label}
                </span>
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
  );
}

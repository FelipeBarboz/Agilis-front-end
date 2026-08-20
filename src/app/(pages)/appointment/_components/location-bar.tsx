import { MapPin, ChevronRight } from "lucide-react";

interface LocationBarProps {
  address: string;
  onClick?: () => void;
}

export function LocationBar({ address, onClick }: LocationBarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between bg-primary/90 px-4 py-3 text-sm text-primary-foreground"
    >
      <span className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Agendar para {address}
      </span>
      <ChevronRight className="h-4 w-4" />
    </button>
  );
}
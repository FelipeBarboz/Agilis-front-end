import { ChevronDown, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";

export type PriceType = "FIXED" | "HOURLY" | "VARIABLE";

export const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  FIXED: "Preço fixo",
  HOURLY: "Por hora",
  VARIABLE: "A combinar",
};

interface ServicePricingCardProps {
  priceType: PriceType;
  price: string;
  duration: string;
  onPriceTypeChange: (type: PriceType) => void;
  onPriceChange: (value: string) => void;
  onDurationChange: (value: string) => void;
}

export function ServicePricingCard({
  priceType,
  price,
  duration,
  onPriceTypeChange,
  onPriceChange,
  onDurationChange,
}: ServicePricingCardProps) {
  const handlePriceInput = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) {
      onPriceChange("");
      return;
    }
    const numberValue = Number(digits) / 100;
    onPriceChange(
      numberValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    );
  };

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <DollarSign className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Valores e Tempo Estimado
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Defina o modelo de cobrança e a duração média
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Tipo de Preço */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="priceType" className="text-xs font-bold text-foreground">
            Tipo de preço <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <select
              id="priceType"
              value={priceType}
              onChange={(e) => onPriceTypeChange(e.target.value as PriceType)}
              className="h-11 w-full appearance-none rounded-xl border border-input bg-background px-3.5 pr-10 text-sm text-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              {(
                Object.entries(PRICE_TYPE_LABELS) as [PriceType, string][]
              ).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          </div>
        </div>

        {/* Valor */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="price" className="text-xs font-bold text-foreground">
            {priceType === "VARIABLE" ? "Valor de referência" : "Valor"}{" "}
            <span className="text-primary">*</span>
          </label>
          <Input
            id="price"
            value={price}
            onChange={(e) => handlePriceInput(e.target.value)}
            placeholder="R$ 0,00"
            className="h-11 rounded-xl"
          />
        </div>

        {/* Duração Estimada */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="duration" className="text-xs font-bold text-foreground">
            Duração estimada
          </label>
          <div className="relative">
            <select
              id="duration"
              value={duration}
              onChange={(e) => onDurationChange(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-input bg-background px-3.5 pr-10 text-sm text-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option value="">Selecione uma duração</option>
              <option value="30">30 minutos</option>
              <option value="60">1 hora</option>
              <option value="90">1 hora e 30 minutos</option>
              <option value="120">2 horas</option>
              <option value="180">3 horas</option>
              <option value="240">4 horas</option>
              <option value="480">Diária (8 horas)</option>
              <option value="custom">A combinar / Personalizada</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

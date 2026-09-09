"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, ShieldCheck, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScheduleButtonProps {
  serviceId: string;
  storeId: string;
  selectedPrice: number;
  selectedPackage: string;
}

export function ScheduleButton({
  serviceId,
  storeId,
  selectedPrice,
  selectedPackage,
}: ScheduleButtonProps) {
  const router = useRouter();

  function handleSchedule() {
    const params = new URLSearchParams({
      storeId,
      serviceId,
      price: String(selectedPrice),
      package: selectedPackage,
    });
    router.push(`/services/${serviceId}/schedule?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-xs ring-1 ring-foreground/10">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium">Plano selecionado</span>
          <span className="text-sm font-bold text-foreground">{selectedPackage || "Padrão"}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground font-medium">Total</span>
          <span className="text-2xl font-extrabold text-foreground">
            R$ {selectedPrice.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleSchedule}
        className="w-full h-12 gap-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <CalendarDays size={18} />
        Agendar Serviço Agora
      </Button>

      {/* Garantias Agilis */}
      <div className="flex flex-col gap-2 pt-1 border-t border-border/60 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Check size={14} className="text-primary shrink-0" />
          <span>Confirmação instantânea do pedido</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-primary shrink-0" />
          <span>Garantia de atendimento e satisfação Agilis</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-primary shrink-0" />
          <span>Profissionais capacitados e avaliados</span>
        </div>
      </div>
    </div>
  );
}
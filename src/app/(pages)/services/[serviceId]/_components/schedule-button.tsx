"use client";

import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";
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
    // TODO: redirecionar para tela de agendamento
    router.push(`/services/${serviceId}/schedule?${params.toString()}`);
  }

  return (
    <Button
      size="lg"
      className="w-full gap-2"
      onClick={handleSchedule}
    >
      <CalendarDays size={18} />
      Agendar serviço por R$ {selectedPrice.toFixed(2).replace(".", ",")}
    </Button>
  );
}
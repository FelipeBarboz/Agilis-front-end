import { Plus, Scissors, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServicesList() {
  const services = [
    { id: 1, name: "Limpeza Completa", price: "R$ 150,00", duration: "2h", icon: Droplet },
    { id: 2, name: "Manutenção", price: "R$ 80,00", duration: "1h", icon: Scissors },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Serviços da Loja</h2>
        <Button className="gap-2 rounded-xl bg-brand-dark text-white hover:bg-brand-dark-2">
          <Plus className="size-4" />
          <span className="hidden sm:inline">Novo Serviço</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((svc) => (
          <div key={svc.id} className="flex items-start gap-4 p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
              <svc.icon className="size-6" />
            </div>
            <div className="flex flex-col flex-1">
              <h3 className="font-bold text-foreground">{svc.name}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="font-semibold text-black">{svc.price}</span>
                <span>•</span>
                <span>{svc.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

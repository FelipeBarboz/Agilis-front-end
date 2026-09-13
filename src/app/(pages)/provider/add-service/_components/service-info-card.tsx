import { Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ServiceInfoCardProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function ServiceInfoCard({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: ServiceInfoCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Briefcase className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Informações do serviço
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Dê um título e uma descrição clara para seus clientes
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Nome do Serviço */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-xs font-bold text-foreground">
            Nome do serviço <span className="text-primary">*</span>
          </label>
          <Input
            id="title"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Ex: Limpeza de piscina, Manutenção preventiva..."
            className="h-11 rounded-xl"
          />
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="description"
              className="text-xs font-bold text-foreground"
            >
              Descrição
            </label>
            <span className="text-[11px] text-muted-foreground">
              {description.length}/250
            </span>
          </div>
          <textarea
            id="description"
            rows={4}
            maxLength={250}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Descreva o que está incluso no serviço, diferenciais, materiais utilizados, etc."
            className="w-full resize-none rounded-xl border border-input bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>
    </div>
  );
}

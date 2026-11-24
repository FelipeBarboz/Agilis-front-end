import { Briefcase, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

export const SERVICE_CATEGORIES = [
  { value: "LIMPEZA", label: "Limpeza" },
  { value: "ELETRICA", label: "Elétrica" },
  { value: "HIDRAULICA", label: "Hidráulica" },
  { value: "PINTURA", label: "Pintura" },
  { value: "TECNOLOGIA_TV", label: "Tecnologia e TV" },
  { value: "REPAROS", label: "Reparos e Reformas" },
  { value: "CONSTRUCAO", label: "Construção Civil" },
  { value: "MARCENARIA", label: "Marcenaria" },
  { value: "CLIMATIZACAO", label: "Climatização e Ar Condicionado" },
  { value: "SEGURANCA", label: "Segurança" },
  { value: "MUDANCA", label: "Mudança" },
  { value: "JARDINAGEM", label: "Jardinagem" },
  { value: "PET", label: "Pet" },
  { value: "VIDRACARIA", label: "Vidraçaria" },
  { value: "GAS", label: "Gás" },
  { value: "LAVANDERIA", label: "Lavanderia" },
] as const;

interface ServiceInfoCardProps {
  name: string;
  description: string;
  category?: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange?: (value: string) => void;
}

export function ServiceInfoCard({
  name,
  description,
  category = "LIMPEZA",
  onNameChange,
  onDescriptionChange,
  onCategoryChange,
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
            Dê um título, categoria e uma descrição clara para seus clientes
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

        {/* Categoria do Serviço */}
        {onCategoryChange && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-xs font-bold text-foreground">
              Categoria <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                id="category"
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-input bg-background px-3.5 pr-10 text-sm text-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
          </div>
        )}

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

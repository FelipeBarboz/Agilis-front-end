import { Headphones } from "lucide-react";

export function SupportHeaderMobile() {
  return (
    <div className="flex items-center gap-3 pb-1">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
        <Headphones size={20} />
      </div>
      <div>
        <h1 className="text-lg font-bold leading-tight text-foreground">Suporte</h1>
        <p className="text-xs text-muted-foreground">
          Dúvidas? Fale com nossa equipe
        </p>
      </div>
    </div>
  );
}

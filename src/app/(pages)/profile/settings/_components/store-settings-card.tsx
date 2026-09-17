import Link from "next/link";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StoreSettingsCard() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Store className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">
              Configurações da Loja
            </h2>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary border border-primary/20">
              Loja Ativa
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Acesse os atalhos de gerenciamento do perfil da sua loja, equipe e horários
          </p>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <Button
          asChild
          variant="outline"
          className="w-full sm:w-auto rounded-xl border-border hover:bg-muted text-foreground cursor-pointer"
        >
          <Link href="/store/store-profile">Ir para Perfil da Loja</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full sm:w-auto rounded-xl border-border hover:bg-muted text-foreground cursor-pointer"
        >
          <Link href="/store/store-settings">Configurações da Empresa</Link>
        </Button>
      </div>
    </div>
  );
}

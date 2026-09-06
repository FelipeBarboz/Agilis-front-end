import { HeartOff, Compass } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyFavorites() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center shadow-xs">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4 shadow-xs">
        <HeartOff className="h-8 w-8" />
      </div>

      <h2 className="text-lg font-semibold text-foreground">
        Você ainda não tem favoritos
      </h2>

      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        Toque no coração de qualquer serviço do catálogo para salvá-lo aqui e encontrar mais rápido da próxima vez.
      </p>

      <Button asChild className="mt-6 rounded-xl" size="lg">
        <Link href="/services" className="flex items-center gap-2">
          <Compass className="h-4 w-4" />
          Explorar Serviços
        </Link>
      </Button>
    </div>
  );
}
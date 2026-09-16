import Link from "next/link";
import { ArrowLeft, MessageSquare, RefreshCw } from "lucide-react";

export function CancelledActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <Link
        href="/history"
        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 cursor-pointer text-center"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Histórico
      </Link>
      <Link
        href="/services"
        className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium text-center text-foreground transition-colors hover:bg-muted cursor-pointer"
      >
        <RefreshCw className="h-4 w-4 text-primary" />
        Contratar Novo Serviço
      </Link>
      <Link
        href="/support"
        className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium text-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
      >
        <MessageSquare className="h-4 w-4" />
        Suporte
      </Link>
    </div>
  );
}

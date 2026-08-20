import Link from "next/link";
import { Settings, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeaderProfile() {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border">
      {/* Avatar */}
      <div className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-brand-dark text-white text-4xl sm:text-5xl font-light shrink-0">
        CP
      </div>

      {/* Info & Actions */}
      <div className="flex flex-col items-center sm:items-start flex-1 gap-4 pt-2">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-foreground">Carlão Piscinas</h1>
          <p className="text-sm text-muted-foreground mt-1">Sua loja está ativa e recebendo clientes.</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
          <Button asChild variant="outline" className="gap-2 rounded-xl border-gray-300 hover:bg-muted">
            <Link href="/store/employees">
              <Users className="size-4" />
              Funcionários
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2 rounded-xl border-gray-300 hover:bg-muted">
            <Link href="/store/store-positions">
              <Briefcase className="size-4" />
              Cargos
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2 rounded-xl border-gray-300 hover:bg-muted">
            <Link href="/store/store-settings">
              <Settings className="size-4" />
              Configurações
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


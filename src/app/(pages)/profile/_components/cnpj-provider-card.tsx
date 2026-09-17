"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, ChevronRight, Plus, CheckCircle2 } from "lucide-react";

export function CnpjProviderCard() {
  const [mounted, setMounted] = useState(false);
  const [cnpj, setCnpj] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const storedCnpj = localStorage.getItem("provider_cnpj");
    setCnpj(storedCnpj);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[74px] items-center rounded-2xl border border-dashed border-border bg-card p-4 sm:p-5" />
    );
  }

  const formatCnpj = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length === 14) {
      return digits.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5"
      );
    }
    return val;
  };

  if (cnpj) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-card p-4 shadow-sm sm:p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Building2 className="size-5" />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">CNPJ Cadastrado</span>
            <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="size-3" />
              Provedor Ativo
            </span>
          </div>
          <span className="text-xs font-mono font-medium text-muted-foreground mt-0.5">
            {formatCnpj(cnpj)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/register/provider"
      id="btn-add-cnpj"
      className="flex items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-card p-4 shadow-sm transition-all hover:bg-muted/40 hover:border-primary group sm:p-5"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
        <Building2 className="size-5" />
      </div>
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-bold text-foreground">CNPJ</span>
        <span className="text-xs text-muted-foreground">Adicione seu CNPJ para se tornar provedor</span>
      </div>
      <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors group-hover:bg-primary/20">
        <Plus className="size-3.5" />
        Adicionar
      </div>
      <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}

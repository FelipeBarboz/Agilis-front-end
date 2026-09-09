"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function EnterpriseInfosForm() {
  const router = useRouter();
  const [cnpj, setCnpj] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("form_enterpriseInfos", "true");
    router.push("/provider/create-store");
  };

  function formatCnpj(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 14);
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Nome de Exibição */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="displayName" className="text-xs font-bold text-foreground">
          Nome de exibição <span className="text-primary">*</span>
        </label>
        <Input
          id="displayName"
          placeholder="Ex: Carlão Piscinas ME"
          className="h-11 rounded-xl"
        />
        <p className="text-xs text-muted-foreground">
          Nome que aparecerá publicamente para os clientes
        </p>
      </div>

      {/* Separador */}
      <div className="h-px bg-border" />

      {/* CNPJ */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cnpj" className="text-xs font-bold text-foreground">
          CNPJ
        </label>
        <Input
          id="cnpj"
          inputMode="numeric"
          placeholder="00.000.000/0000-00"
          value={cnpj}
          onChange={(e) => setCnpj(formatCnpj(e.target.value))}
          className="h-11 rounded-xl"
        />
        <p className="text-xs text-muted-foreground">
          Opcional — deixe em branco se for pessoa física (CPF)
        </p>
      </div>

      {/* Separador */}
      <div className="h-px bg-border" />

      {/* Botões */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/provider/create-store"
          className="flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:flex-1"
        >
          Cancelar
        </Link>
        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 sm:flex-[2] cursor-pointer"
        >
          Salvar e continuar
        </Button>
      </div>

    </form>
  );
}

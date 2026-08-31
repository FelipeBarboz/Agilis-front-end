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
        <label htmlFor="displayName" className="text-sm font-semibold text-white/80">
          Nome de exibição <span className="text-white/40">*</span>
        </label>
        <Input
          id="displayName"
          placeholder="Ex: Carlão Piscinas ME"
          className="h-12 border-0 bg-white/95 px-4 text-black shadow-sm placeholder:text-neutral-500 focus-visible:ring-4 focus-visible:ring-white/30 rounded-xl"
        />
        <p className="text-xs text-white/40">
          Nome que aparecerá publicamente para os clientes
        </p>
      </div>

      {/* Separador */}
      <div className="h-px bg-white/20" />

      {/* CNPJ */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cnpj" className="text-sm font-semibold text-white/80">
          CNPJ
        </label>
        <Input
          id="cnpj"
          inputMode="numeric"
          placeholder="00.000.000/0000-00"
          value={cnpj}
          onChange={(e) => setCnpj(formatCnpj(e.target.value))}
          className="h-12 border-0 bg-white/95 px-4 text-black shadow-sm placeholder:text-neutral-500 focus-visible:ring-4 focus-visible:ring-white/30 rounded-xl"
        />
        <p className="text-xs text-white/40">
          Opcional — deixe em branco se for pessoa física (CPF)
        </p>
      </div>

      {/* Separador */}
      <div className="h-px bg-white/20" />

      {/* Botões */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/provider/create-store"
          className="flex h-12 w-full items-center justify-center rounded-xl border-2 border-white/25 text-sm font-bold text-white transition-all hover:bg-white/10 sm:flex-1"
        >
          Cancelar
        </Link>
        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-black text-sm font-bold text-white shadow-lg transition-all hover:bg-black/80 sm:flex-[2] cursor-pointer"
        >
          Salvar e continuar
        </Button>
      </div>

    </form>
  );
}

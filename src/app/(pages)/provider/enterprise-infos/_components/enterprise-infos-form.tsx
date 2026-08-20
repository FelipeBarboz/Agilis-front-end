"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function EnterpriseInfosForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("form_enterpriseInfos", "true");
    router.push("/provider/create-store");
  };
  const [cnpj, setCnpj] = useState("");

  function formatCnpj(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 14);
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Nome */}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-white/90">
          Nome
        </label>
        <Input
          id="name"
          placeholder="Ex: Carlão Piscinas"
          className="border-0 bg-white px-4 py-3 text-foreground shadow-sm focus:ring-4 focus:ring-white/30 md:py-4"
        />
      </div>

      {/* URL */}
      <div className="flex flex-col gap-2">
        <label htmlFor="url" className="text-sm font-medium text-white/90">
          URL
        </label>
        <div className="flex w-full overflow-hidden rounded-xl bg-white shadow-sm">
          <span className="flex shrink-0 items-center bg-white/80 px-4 text-sm font-medium text-foreground/60 select-none border-r border-border/20 md:text-base">
            Agilis.com/
          </span>
          <input
            id="url"
            placeholder="carlao-piscinas"
            className="min-w-0 flex-1 bg-white px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-4 focus:ring-primary/20 md:py-4 md:text-base"
          />
        </div>
      </div>

      {/* Nome de Exibição */}
      <div className="flex flex-col gap-2">
        <label htmlFor="displayName" className="text-sm font-medium text-white/90">
          Nome de Exibição
        </label>
        <Input
          id="displayName"
          placeholder=""
          className="border-0 bg-white px-4 py-3 text-foreground shadow-sm focus:ring-4 focus:ring-white/30 md:py-4"
        />
      </div>

      {/* CNPJ */}
      <div className="flex flex-col gap-2">
        <label htmlFor="cnpj" className="text-sm font-medium text-white/90">
          CNPJ
        </label>
        <Input
          id="cnpj"
          inputMode="numeric"
          placeholder="00.000.000/0000-00"
          value={cnpj}
          onChange={(e) => setCnpj(formatCnpj(e.target.value))}
          className="border-0 bg-white px-4 py-3 text-foreground shadow-sm focus:ring-4 focus:ring-white/30 md:py-4"
        />
      </div>

      {/* Salvar */}
      <Button
        type="submit"
        className="mt-2 w-full rounded-xl bg-black py-6 text-base font-bold text-white shadow-lg transition-all hover:bg-black/80 hover:shadow-xl focus:ring-4 focus:ring-black/30 md:py-7 md:text-lg"
      >
        Salvar
      </Button>

    </form>
  );
}

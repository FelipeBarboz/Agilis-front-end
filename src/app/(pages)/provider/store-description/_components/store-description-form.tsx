"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function StoreDescriptionForm() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const maxLength = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("form_storeDescription", "true");
    router.push("/provider/create-store");
  };

  const charCount = description.length;
  const isNearLimit = charCount >= maxLength * 0.8;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Descrição */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="description" className="text-xs font-bold text-foreground">
            Descrição da loja <span className="text-primary">*</span>
          </label>
          <span
            className={`text-[11px] font-medium select-none ${
              isNearLimit ? "text-amber-600" : "text-muted-foreground"
            }`}
          >
            {charCount}/{maxLength}
          </span>
        </div>
        <textarea
          id="description"
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, maxLength))}
          placeholder="Descreva sua empresa, os serviços que oferece, diferenciais, experiência no mercado..."
          className="w-full resize-none rounded-xl border border-input bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <p className="text-xs text-muted-foreground">
          Uma boa descrição aumenta sua credibilidade e conversões
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

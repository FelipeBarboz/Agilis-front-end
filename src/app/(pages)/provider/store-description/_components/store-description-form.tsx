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
        <label htmlFor="description" className="text-sm font-semibold text-white/80">
          Descrição da loja <span className="text-white/40">*</span>
        </label>
        <div className="relative">
          <textarea
            id="description"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, maxLength))}
            placeholder="Descreva sua empresa, os serviços que oferece, diferenciais, experiência no mercado..."
            className="w-full resize-none rounded-xl border-0 bg-white/95 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 shadow-sm focus:outline-none focus:ring-4 focus:ring-white/30"
          />
          <span
            className={`absolute bottom-3 right-3 text-xs font-medium select-none ${
              isNearLimit ? "text-amber-600" : "text-muted-foreground/60"
            }`}
          >
            {charCount}/{maxLength}
          </span>
        </div>
        <p className="text-xs text-white/40">
          Uma boa descrição aumenta sua credibilidade e conversões
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

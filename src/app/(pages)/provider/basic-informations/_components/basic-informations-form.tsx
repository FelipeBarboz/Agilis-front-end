"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function BasicInformationsForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("form_basicInfos", "true");
    router.push("/provider/create-store");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Nome da loja */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="storeName" className="text-sm font-semibold text-white/80">
          Nome da loja <span className="text-white/40">*</span>
        </label>
        <Input
          id="storeName"
          placeholder="Ex: Carlão Piscinas"
          className="h-12 border-0 bg-white/95 px-4 text-black shadow-sm placeholder:text-neutral-500 focus-visible:ring-4 focus-visible:ring-white/30 rounded-xl"
        />
      </div>

      {/* URL */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="url" className="text-sm font-semibold text-white/80">
          URL personalizada <span className="text-white/40">*</span>
        </label>
        <div className="flex h-12 items-center overflow-hidden rounded-xl bg-white/95 shadow-sm focus-within:ring-4 focus-within:ring-white/30">
          <span className="flex h-full items-center border-r border-muted-foreground/20 bg-white/60 px-4 text-sm font-medium text-neutral-600 select-none whitespace-nowrap">
            agilis.com/
          </span>
          <input
            id="url"
            type="text"
            className="h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-black placeholder:text-neutral-500 focus:outline-none"
            placeholder="carlao-piscinas"
          />
        </div>
        <p className="text-xs text-white/40">
          Apenas letras minúsculas, números e hífens
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

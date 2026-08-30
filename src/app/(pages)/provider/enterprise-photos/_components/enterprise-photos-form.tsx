"use client";

import { Button } from "@/components/ui/button";
import { Camera, ImagePlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export function EnterprisePhotosForm() {
  const router = useRouter();
  const [photoCount] = useState(0);
  const maxPhotos = 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("form_enterprisePhotos", "true");
    router.push("/provider/create-store");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Logo da loja */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-white/80">Logo da loja</p>
        <button
          type="button"
          className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/30 bg-white/10 py-8 transition-all hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/30 cursor-pointer"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 transition-transform group-hover:scale-110">
            <Camera className="size-7 text-white" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-white">Adicionar logo</p>
            <p className="mt-0.5 text-xs text-white/50">PNG ou JPG • Até 2MB</p>
          </div>
        </button>
      </div>

      {/* Separador */}
      <div className="h-px bg-white/20" />

      {/* Fotos dos serviços */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white/80">Fotos dos serviços</p>
          <span className="text-xs text-white/40">{photoCount}/{maxPhotos} fotos</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: maxPhotos }).map((_, index) => (
            <button
              key={index}
              type="button"
              className="group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-white/25 bg-white/10 transition-all hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/30 cursor-pointer"
            >
              <ImagePlus className="size-6 text-white/50 transition-transform group-hover:scale-110 group-hover:text-white" strokeWidth={1.5} />
              <span className="text-[10px] font-medium text-white/40 group-hover:text-white/70">
                Adicionar
              </span>
            </button>
          ))}
        </div>

        <p className="text-xs text-white/40">
          Fotos de alta qualidade aumentam a confiança dos clientes
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

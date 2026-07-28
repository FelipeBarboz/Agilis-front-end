"use client";

import { Button } from "@/components/ui/button";
import { Camera, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function EnterprisePhotosForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("form_enterprisePhotos", "true");
    router.push("/provider");
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      
      {/* Logo da loja */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-white/90">
          Logo da loja
        </label>
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-white p-6 transition-all hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/30 md:p-8"
        >
          <Camera className="size-8 text-foreground/70 md:size-10" strokeWidth={1.5} />
          <span className="text-xs font-medium text-foreground/70 md:text-sm">
            PNG ou JPG até 2MB
          </span>
        </button>
      </div>

      {/* Fotos dos serviços */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-white/90">
          Fotos dos serviços
        </label>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {[1, 2, 3].map((index) => (
            <button
              key={index}
              type="button"
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-white p-2 transition-all hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/30"
            >
              <Plus className="size-6 text-foreground/70 md:size-8" strokeWidth={1.5} />
              <span className="text-center text-[10px] font-medium leading-tight text-foreground/70 md:text-xs">
                Adicionar<br />foto
              </span>
            </button>
          ))}
        </div>
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

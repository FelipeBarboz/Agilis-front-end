"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function BasicInformationsForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("form_basicInfos", "true");
    router.push("/provider");
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      
      {/* Nome da loja */}
      <div className="flex flex-col gap-2">
        <label htmlFor="storeName" className="text-sm font-medium text-white/90">
          Nome da loja
        </label>
        <Input
          id="storeName"
          placeholder="Ex: Carlão Piscinas"
          className="h-12 md:h-14 rounded-xl border-0 bg-white px-4 text-foreground shadow-sm focus-visible:ring-4 focus-visible:ring-white/30"
        />
      </div>

      {/* URL */}
      <div className="flex flex-col gap-2">
        <label htmlFor="url" className="text-sm font-medium text-white/90">
          URL
        </label>
        <div className="flex items-center overflow-hidden rounded-xl bg-white shadow-sm focus-within:ring-4 focus-within:ring-white/30">
          <span className="flex items-center justify-center bg-gray-100 px-4 py-3 md:py-4 text-sm font-medium text-muted-foreground border-r">
            agilis.com/
          </span>
          <input
            id="url"
            type="text"
            className="flex-1 min-w-0 border-0 bg-transparent px-4 py-3 md:py-4 text-sm text-foreground focus:outline-none"
            placeholder="carlao-piscinas"
          />
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

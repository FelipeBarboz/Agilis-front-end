"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function StoreDescriptionForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("form_storeDescription", "true");
    router.push("/provider");
  };
  const [description, setDescription] = useState("");
  const maxLength = 500;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      
      {/* Descrição da loja */}
      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium text-white/90">
          Descrição da loja
        </label>
        <div className="relative">
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, maxLength))}
            className="w-full resize-none rounded-xl border-0 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-4 focus:ring-white/30 md:py-4 md:text-base"
          />
          <div className="absolute bottom-3 right-3 text-xs font-medium text-muted-foreground bg-white px-1">
            {description.length}/{maxLength}
          </div>
        </div>
      </div>

      {/* Salvar */}
      <Button
        type="submit"
        className="w-full rounded-xl bg-black py-6 text-base font-bold text-white shadow-lg transition-all hover:bg-black/80 hover:shadow-xl focus:ring-4 focus:ring-black/30 md:py-7 md:text-lg"
      >
        Salvar
      </Button>

    </form>
  );
}

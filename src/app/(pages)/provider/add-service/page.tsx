import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ChevronDown, Plus, UploadCloud } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AddServicePage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-muted/30">
      {/* Navbar / Header (Desktop) */}
      <header className="sticky top-0 z-10 w-full bg-primary text-primary-foreground shadow-sm">
        <div className="flex h-16 w-full items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-4">
            <Link
              href="/provider"
              className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-white/20"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="text-lg font-semibold tracking-tight md:text-xl">
              Criar novo serviço
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/img/logo-opened.png"
              alt="Agilis"
              width={80}
              height={32}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-8">

          {/* Main Photo Area (Outside green card, on gray background) */}
          <div className="flex flex-col items-center justify-center">
            <button
              type="button"
              className="group relative flex size-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-white text-primary transition-all hover:bg-primary/5 hover:border-primary/80 focus:outline-none focus:ring-4 focus:ring-primary/20 md:size-48"
            >
              <Plus className="size-8 transition-transform group-hover:scale-110 md:size-10" />
              <span className="font-medium text-sm md:text-base">Adicionar foto</span>
            </button>
            <p className="mt-3 text-sm text-muted-foreground text-center">
              Esta será a foto principal do seu serviço
            </p>
          </div>

          {/* Form Area (Green Card) */}
          <div className="overflow-hidden rounded-3xl bg-primary shadow-xl">
            <form className="flex flex-col gap-6 p-6 md:p-10">

              {/* Nome do serviço */}
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-sm font-medium text-white/90">
                  Nome do serviço
                </label>
                <Input
                  id="title"
                  placeholder="Ex: Limpeza de piscina"
                  className="border-0 bg-white px-4 py-3 text-foreground shadow-sm focus:ring-4 focus:ring-white/30 md:py-4"
                />
              </div>

              {/* Descrição */}
              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-sm font-medium text-white/90">
                  Descrição
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Ex: Realizamos limpeza completa de piscinas com tratamento de água..."
                    className="w-full resize-none rounded-xl border-0 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-4 focus:ring-white/30 md:py-4 md:text-base"
                  />
                  <div className="absolute bottom-3 right-3 text-xs font-medium text-muted-foreground">
                    0/250
                  </div>
                </div>
              </div>

              {/* Grid for Price Type and Price */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Tipo de Preço */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="priceType" className="text-sm font-medium text-white/90">
                    Tipo de Preço
                  </label>
                  <div className="relative">
                    <select
                      id="priceType"
                      className="w-full appearance-none rounded-xl border-0 bg-white px-4 py-3 text-foreground shadow-sm focus:outline-none focus:ring-4 focus:ring-white/30 md:py-4 md:text-base cursor-pointer"
                      defaultValue="FIXED"
                    >
                      <option value="FIXED">Preço fixo</option>
                      <option value="HOURLY">Por hora</option>
                      <option value="VARIABLE">A combinar</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground">
                      <ChevronDown className="size-5" />
                    </div>
                  </div>
                </div>

                {/* Preço */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="price" className="text-sm font-medium text-white/90">
                    Preço
                  </label>
                  <Input
                    id="price"
                    placeholder="R$ 227,00"
                    className="border-0 bg-white px-4 py-3 text-foreground shadow-sm focus:ring-4 focus:ring-white/30 md:py-4"
                  />
                </div>
              </div>

              {/* Duração média */}
              <div className="flex flex-col gap-2">
                <label htmlFor="duration" className="text-sm font-medium text-white/90">
                  Duração média (minutos)
                </label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="Ex: 120"
                  className="border-0 bg-white px-4 py-3 text-foreground shadow-sm focus:ring-4 focus:ring-white/30 md:py-4"
                />
              </div>

              {/* Adicionar imagens */}
              <div className="flex flex-col gap-2 pt-2">
                <label className="text-sm font-medium text-white/90">
                  Adicionar imagens
                </label>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border-0 bg-white px-4 py-3 text-left text-sm text-foreground shadow-sm transition-colors hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/30 md:py-4 md:text-base"
                >
                  <span className="font-medium text-foreground/80">Selecione os Arquivos (0/5)</span>
                  <UploadCloud className="size-5 text-muted-foreground" />
                </button>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <Button
                  type="button"
                  className="w-full rounded-xl bg-black py-6 text-base font-bold text-white shadow-lg transition-all hover:bg-black/80 hover:shadow-xl focus:ring-4 focus:ring-black/30 md:py-7 md:text-lg"
                >
                  Criar serviço
                </Button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

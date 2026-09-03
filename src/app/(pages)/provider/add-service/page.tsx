"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ChevronDown, ImagePlus, UploadCloud, X } from "lucide-react";
import Link from "next/link";

type PriceType = "FIXED" | "HOURLY" | "VARIABLE";

const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  FIXED: "Preço fixo",
  HOURLY: "Por hora",
  VARIABLE: "A combinar",
};

export default function AddServicePage() {
  const [priceType, setPriceType] = useState<PriceType>("FIXED");

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted/30 pb-20">
      {/* Seta de voltar flutuante — redireciona para tela de prestador */}
      <Link
        href="/provider"
        aria-label="Voltar para tela de prestador"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-white cursor-pointer"
      >
        <ArrowLeft size={20} />
      </Link>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 pt-14 pb-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Criar novo serviço
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Preencha as informações para disponibilizar um novo serviço
          </p>
        </div>

        {/* Photo Upload Card */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border bg-white p-6 shadow-sm">
          <button
            type="button"
            className="group relative flex h-36 w-36 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 text-primary transition-all hover:border-primary hover:bg-primary/10 focus:outline-none focus:ring-4 focus:ring-primary/20 cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
              <ImagePlus className="size-6" />
            </div>
            <span className="text-xs font-semibold">Adicionar foto</span>
          </button>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Foto principal do serviço</p>
            <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG ou WEBP • Máx. 5MB</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-3xl bg-primary shadow-xl">
          <div className="px-6 py-5 md:px-10 md:py-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/50">
              Informações do serviço
            </p>
          </div>

          <form className="flex flex-col gap-5 px-6 pb-8 md:px-10 md:pb-10">

            {/* Nome */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-sm font-semibold text-white/80">
                Nome do serviço <span className="text-white/40">*</span>
              </label>
              <Input
                id="title"
                placeholder="Ex: Limpeza de piscina"
                className="h-12 border-0 bg-white/95 px-4 text-black shadow-sm placeholder:text-neutral-500 focus:ring-4 focus:ring-white/30 rounded-xl"
              />
            </div>

            {/* Descrição */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-semibold text-white/80">
                Descrição
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  rows={4}
                  maxLength={250}
                  placeholder="Descreva o que está incluso no serviço, diferenciais, etc."
                  className="w-full resize-none rounded-xl border-0 bg-white/95 px-4 py-3 text-sm text-black placeholder:text-neutral-500 shadow-sm focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <span className="absolute bottom-3 right-3 text-xs text-muted-foreground/60 select-none">
                  0/250
                </span>
              </div>
            </div>

            {/* Separador */}
            <div className="h-px bg-white/20" />

            {/* Tipo de Preço */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="priceType" className="text-sm font-semibold text-white/80">
                Tipo de preço <span className="text-white/40">*</span>
              </label>
              <div className="relative">
                <select
                  id="priceType"
                  value={priceType}
                  onChange={(e) => setPriceType(e.target.value as PriceType)}
                  className="h-12 w-full appearance-none rounded-xl border-0 bg-white/95 px-4 pr-10 text-black shadow-sm focus:outline-none focus:ring-4 focus:ring-white/30 cursor-pointer"
                >
                  {(Object.entries(PRICE_TYPE_LABELS) as [PriceType, string][]).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
            </div>

            {/* Badge "A combinar" ou campo de preço */}
            {priceType === "VARIABLE" ? (
              <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3.5">
                <X className="size-4 text-white/60 shrink-0" />
                <p className="text-sm text-white/80">
                  O preço será negociado diretamente com o cliente — nenhum valor será exibido.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="price" className="text-sm font-semibold text-white/80">
                  Valor {priceType === "HOURLY" ? "(por hora)" : ""}{" "}
                  <span className="text-white/40">*</span>
                </label>
                <Input
                  id="price"
                  placeholder="R$ 0,00"
                  className="h-12 border-0 bg-white/95 px-4 text-black shadow-sm placeholder:text-neutral-500 focus:ring-4 focus:ring-white/30 rounded-xl"
                />
              </div>
            )}

            {/* Duração */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="duration" className="text-sm font-semibold text-white/80">
                Duração estimada (minutos)
              </label>
              <Input
                id="duration"
                type="number"
                min={5}
                step={5}
                placeholder="Ex: 60"
                className="h-12 border-0 bg-white/95 px-4 text-black shadow-sm placeholder:text-neutral-500 focus:ring-4 focus:ring-white/30 rounded-xl"
              />
            </div>

            {/* Separador */}
            <div className="h-px bg-white/20" />

            {/* Imagens adicionais */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-white/80">
                Imagens adicionais{" "}
                <span className="text-xs font-normal text-white/40">(até 5)</span>
              </label>
              <button
                type="button"
                className="flex h-12 w-full items-center justify-between rounded-xl border-0 bg-white/95 px-4 text-sm text-black shadow-sm transition-colors hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/30 cursor-pointer"
              >
                <span className="text-neutral-500">Selecionar arquivos</span>
                <UploadCloud className="size-5 text-neutral-500" />
              </button>
            </div>

            {/* Botões */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/provider"
                className="flex h-12 w-full items-center justify-center rounded-xl border-2 border-white/25 text-sm font-bold text-white transition-all hover:bg-white/10 sm:flex-1"
              >
                Cancelar
              </Link>
              <Button
                type="button"
                className="h-12 w-full rounded-xl bg-black text-sm font-bold text-white shadow-lg transition-all hover:bg-black/80 sm:flex-[2] cursor-pointer"
              >
                Criar serviço
              </Button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ChevronDown, ImageIcon, Trash2, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import { mockProfileServices } from "@/lib/mocks/profile-services";
import { notFound } from "next/navigation";
import { use } from "react";

type PriceType = "FIXED" | "HOURLY" | "VARIABLE";

const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  FIXED: "Preço fixo",
  HOURLY: "Por hora",
  VARIABLE: "A combinar",
};

interface EditServicePageProps {
  params: Promise<{ serviceId: string }>;
}

function EditServiceContent({ serviceId }: { serviceId: string }) {
  const service = mockProfileServices.find((s) => s.id === Number(serviceId));

  if (!service) {
    notFound();
  }

  const [priceType, setPriceType] = useState<PriceType>("FIXED");

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted/30 pb-20">
      {/* Seta de voltar flutuante — padrão Agilis */}
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              Editar serviço
            </h1>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              Atualizando{" "}
              <span className="font-semibold text-primary">{service.name}</span>
            </p>
          </div>
          <button
            type="button"
            className="mt-1 flex shrink-0 items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            Excluir
          </button>
        </div>

        {/* Photo Upload Card */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="group relative flex h-36 w-36 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 text-primary cursor-pointer">
            <ImageIcon className="size-10 opacity-30" />
            <span className="text-xs font-medium text-muted-foreground">Sem foto</span>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-primary/85 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <UploadCloud className="size-8" />
              <span className="text-xs font-semibold">Alterar foto</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Foto principal do serviço</p>
            <p className="text-xs text-muted-foreground mt-0.5">Clique na imagem para alterar • PNG, JPG, WEBP</p>
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
                defaultValue={service.name}
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
                  defaultValue={service.price}
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
                defaultValue={service.duration.replace("h", "")}
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
                Salvar alterações
              </Button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const { serviceId } = use(params);
  return <EditServiceContent serviceId={serviceId} />;
}

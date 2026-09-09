"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Navigation,
  Hash,
  Building,
  Check,
  X,
  ChevronRight,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { addressSchema, type AddressSchema } from "./address-schema";
import { formatCep } from "@/lib/masks/cep-mask";
import { useAddresses } from "@/hooks/use-addresses";

export function AddressForm() {
  const router = useRouter();
  const { addAddress, isLoading } = useAddresses();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: { cep: "", street: "", number: "", complement: "" },
  });

  async function onSubmit(values: AddressSchema) {
    await addAddress(values);
    router.push("/addresses");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Card principal com os campos */}
      <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <div>
          <h2 className="text-lg font-bold text-foreground">Dados do local</h2>
          <p className="text-sm text-muted-foreground">
            Informe o CEP e o endereço completo para atendimento
          </p>
        </div>

        <div className="flex flex-col gap-5 pt-2">
          {/* CEP */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="field-cep"
              className="flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin size={14} />
              </div>
              CEP
            </label>
            <Controller
              control={control}
              name="cep"
              render={({ field }) => (
                <Input
                  {...field}
                  id="field-cep"
                  placeholder="00000-000"
                  inputMode="numeric"
                  className="h-11 rounded-xl bg-muted/40 px-4 text-sm text-foreground focus:bg-card border-border"
                  onChange={(e) => field.onChange(formatCep(e.target.value))}
                />
              )}
            />
            {errors.cep && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <X size={12} />
                {errors.cep.message}
              </p>
            )}
          </div>

          {/* Rua/Avenida */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="field-street"
              className="flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Navigation size={14} />
              </div>
              Rua / Avenida
            </label>
            <Input
              id="field-street"
              placeholder="Ex: Avenida Paulista"
              className="h-11 rounded-xl bg-muted/40 px-4 text-sm text-foreground focus:bg-card border-border"
              {...register("street")}
            />
            {errors.street && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <X size={12} />
                {errors.street.message}
              </p>
            )}
          </div>

          {/* Número e Complemento */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="field-number"
                className="flex items-center gap-2 text-sm font-semibold text-foreground"
              >
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Hash size={14} />
                </div>
                Número
              </label>
              <Input
                id="field-number"
                placeholder="Ex: 1578"
                className="h-11 rounded-xl bg-muted/40 px-4 text-sm text-foreground focus:bg-card border-border"
                {...register("number")}
              />
              {errors.number && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <X size={12} />
                  {errors.number.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="field-complement"
                className="flex items-center gap-2 text-sm font-semibold text-foreground"
              >
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building size={14} />
                </div>
                Complemento (opcional)
              </label>
              <Input
                id="field-complement"
                placeholder="Ex: Apto 302, Bloco B"
                className="h-11 rounded-xl bg-muted/40 px-4 text-sm text-foreground focus:bg-card border-border"
                {...register("complement")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Ação no padrão dos cards Agilis */}
      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={isLoading}
          id="btn-save-address"
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-muted/40 hover:border-primary/40 group sm:p-5 text-left cursor-pointer disabled:opacity-80"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
            <Check className="size-5" />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-bold text-foreground">
              {isLoading ? "Salvando endereço..." : "Salvar endereço"}
            </span>
            <span className="text-xs text-muted-foreground">
              Confirmar e cadastrar este endereço para seus agendamentos
            </span>
          </div>
          <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </button>

        <Link
          href="/addresses"
          id="btn-cancel-address"
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-muted/40 hover:border-destructive/40 group sm:p-5 text-left cursor-pointer"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive group-hover:scale-105 transition-transform">
            <X className="size-5" />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-bold text-destructive">Cancelar</span>
            <span className="text-xs text-muted-foreground">
              Descartar alterações e voltar para a lista de endereços
            </span>
          </div>
          <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </form>
  );
}
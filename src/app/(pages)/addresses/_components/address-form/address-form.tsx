"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeInSection } from "@/components/ui/motion";

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
    router.push("/adresses");
  }

  return (
    <FadeInSection>
      <div className="w-full max-w-xl rounded-2xl bg-primary p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-primary-foreground">
              CEP
            </label>
            <Controller
              control={control}
              name="cep"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="00000-000"
                  className="bg-white"
                  onChange={(e) => field.onChange(formatCep(e.target.value))}
                />
              )}
            />
            {errors.cep && (
              <span className="text-xs text-destructive">{errors.cep.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-primary-foreground">
              Rua/Avenida
            </label>
            <Input className="bg-white" {...register("street")} />
            {errors.street && (
              <span className="text-xs text-destructive">{errors.street.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-primary-foreground">
                Número
              </label>
              <Input className="bg-white" {...register("number")} />
              {errors.number && (
                <span className="text-xs text-destructive">{errors.number.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-primary-foreground">
                Complemento (opcional)
              </label>
              <Input className="bg-white" {...register("complement")} />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="mt-2 w-full"
          >
            {isLoading ? "Salvando..." : "Continuar"}
          </Button>
        </form>
      </div>
    </FadeInSection>
  );
}
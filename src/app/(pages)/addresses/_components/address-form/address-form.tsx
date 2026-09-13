"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { addressSchema, type AddressSchema } from "./address-schema";
import { useAddresses } from "@/hooks/use-addresses";
import { AddressFields } from "./address-fields";
import { AddressActions } from "./address-actions";

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
      <AddressFields control={control} register={register} errors={errors} />
      <AddressActions isLoading={isLoading} />
    </form>
  );
}
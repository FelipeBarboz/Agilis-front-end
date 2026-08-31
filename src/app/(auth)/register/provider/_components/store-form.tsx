"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TermsCheckbox } from "./terms-checkbox";
import { storeSchema, type StoreFormData } from "./store";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9\s-]/g, "") // remove caracteres inválidos
    .trim()
    .replace(/\s+/g, "-") // espaços viram hífen
    .replace(/-+/g, "-"); // remove hífens duplicados
}

import { useRouter } from "next/navigation";

export function StoreForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StoreFormData>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    resolver: zodResolver(storeSchema),
  });

  async function onSubmit(data: StoreFormData) {
    console.log(data);
    router.push("/provider");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

      {/* Nome da loja */}
      <motion.div
        className="flex flex-col gap-1"
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <label className="text-xs font-medium text-white">Nome da loja:</label>
        <Input
          type="text"
          autoComplete="organization"
          placeholder="Ex: Carlão Piscinas"
          className="border-white/20 bg-white text-black placeholder:text-neutral-500"
          {...register("storeName")}
        />
        {errors.storeName && (
          <p className="text-xs text-red-200">{errors.storeName.message}</p>
        )}
      </motion.div>

      {/* URL da loja */}
      <motion.div
        className="flex flex-col gap-1"
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <label className="text-xs font-medium text-white">
          Escolha o URL da sua loja:
        </label>
        <Input
          type="text"
          inputMode="text"
          placeholder="Ex: agilis.com/carlao-piscinas"
          className="border-white/20 bg-white text-black placeholder:text-neutral-500"
          {...register("storeUrl")}
          onInput={(e) => {
            const input = e.currentTarget;
            input.value = slugify(input.value);
          }}
        />
        {errors.storeUrl && (
          <p className="text-xs text-red-200">{errors.storeUrl.message}</p>
        )}
      </motion.div>

      {/* Termos */}
      <motion.div
        className="flex flex-col gap-1"
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <TermsCheckbox className="border-white/40" {...register("terms")} />
        {errors.terms && (
          <p className="text-xs text-red-200">{errors.terms.message}</p>
        )}
      </motion.div>

      {/* Submit */}
      <motion.div
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.35 }}
      >
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="mt-1 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Aguarde..." : "Continuar"}
        </Button>
      </motion.div>

    </form>
  );
}
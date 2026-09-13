"use client";

import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import type { UseFormRegister, FieldError } from "react-hook-form";
import type { RegisterFormData } from "@/lib/validations/register";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const inputClassName =
  "border-white/20 bg-white text-black placeholder:text-neutral-500 dark:bg-white dark:text-black dark:[color-scheme:light]";

interface NameFieldProps {
  register: UseFormRegister<RegisterFormData>;
  error?: FieldError;
}

export function NameField({ register, error }: NameFieldProps) {
  return (
    <motion.div
      className="flex flex-col gap-1"
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <label className="text-xs font-medium text-white">Nome</label>
      <Input
        type="text"
        autoComplete="name"
        inputMode="text"
        placeholder="Seu nome completo"
        className={inputClassName}
        {...register("name")}
        onInput={(e) => {
          const input = e.currentTarget;
          input.value = input.value.replace(/[^\p{L}\s'-]/gu, "");
        }}
      />
      {error && <p className="text-xs text-red-200">{error.message}</p>}
    </motion.div>
  );
}

"use client";

import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import type { UseFormRegister, FieldError } from "react-hook-form";
import type { LoginFormData } from "@/lib/validations/login";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const inputClassName =
  "border-white/20 bg-white text-black placeholder:text-neutral-500 dark:bg-white dark:text-black dark:[color-scheme:light]";

interface EmailFieldProps {
  register: UseFormRegister<LoginFormData>;
  error?: FieldError;
}

export function EmailField({ register, error }: EmailFieldProps) {
  return (
    <motion.div
      className="flex flex-col gap-1"
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <label className="text-xs font-medium text-white">E-mail</label>
      <Input
        type="email"
        autoComplete="email"
        placeholder="seu.email@exemplo.com"
        className={inputClassName}
        {...register("email")}
      />
      {error && <p className="text-xs text-red-200">{error.message}</p>}
    </motion.div>
  );
}

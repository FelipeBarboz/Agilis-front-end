"use client";

import { motion } from "motion/react";
import { CnpjInput } from "../cnpj-input";
import type { UseFormRegister, FieldError } from "react-hook-form";
import type { StoreFormData } from "../store";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

interface CnpjFieldProps {
  register: UseFormRegister<StoreFormData>;
  error?: FieldError;
}

export function CnpjField({ register, error }: CnpjFieldProps) {
  return (
    <motion.div
      className="flex flex-col gap-1"
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <label className="text-xs font-medium text-white">CNPJ</label>
      <CnpjInput {...register("cnpj")} />
      {error && <p className="text-xs text-red-200">{error.message}</p>}
    </motion.div>
  );
}

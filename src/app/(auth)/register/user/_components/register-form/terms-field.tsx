"use client";

import { motion } from "motion/react";
import { TermsCheckbox } from "../terms-checkbox";
import type { UseFormRegister, FieldError } from "react-hook-form";
import type { RegisterFormData } from "@/lib/validations/register";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

interface TermsFieldProps {
  register: UseFormRegister<RegisterFormData>;
  error?: FieldError;
}

export function TermsField({ register, error }: TermsFieldProps) {
  return (
    <motion.div
      className="flex flex-col gap-1"
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <TermsCheckbox className="border-white/40" {...register("terms")} />
      {error && <p className="text-xs text-red-200">{error.message}</p>}
    </motion.div>
  );
}

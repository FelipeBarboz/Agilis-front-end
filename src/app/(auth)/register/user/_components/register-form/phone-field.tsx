"use client";

import { motion } from "motion/react";
import { PhoneInput } from "../phone-input";
import type { UseFormRegister, FieldError } from "react-hook-form";
import type { RegisterFormData } from "@/lib/validations/register";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

interface PhoneFieldProps {
  register: UseFormRegister<RegisterFormData>;
  error?: FieldError;
}

export function PhoneField({ register, error }: PhoneFieldProps) {
  return (
    <motion.div
      className="flex flex-col gap-1"
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3, delay: 0.35 }}
    >
      <label className="text-xs font-medium text-white">DDD + número</label>
      <PhoneInput {...register("phone")} />
      {error && <p className="text-xs text-red-200">{error.message}</p>}
    </motion.div>
  );
}

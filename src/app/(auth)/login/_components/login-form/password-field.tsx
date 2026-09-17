"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { UseFormRegister, FieldError } from "react-hook-form";
import type { LoginFormData } from "@/lib/validations/login";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const inputClassName =
  "border-white/20 bg-white text-black placeholder:text-neutral-500 dark:bg-white dark:text-black dark:[color-scheme:light]";

interface PasswordFieldProps {
  register: UseFormRegister<LoginFormData>;
  error?: FieldError;
}

export function PasswordField({ register, error }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      className="flex flex-col gap-1"
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3, delay: 0.35 }}
    >
      <label className="text-xs font-medium text-white">Senha</label>
      <Input
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        placeholder="••••••••"
        className={inputClassName}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="text-neutral-500 transition-colors hover:text-black"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        {...register("password")}
      />
      {error && <p className="text-xs text-red-200">{error.message}</p>}
    </motion.div>
  );
}

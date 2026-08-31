"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "./google-button";
import { PhoneInput } from "./phone-input";
import { TermsCheckbox } from "./terms-checkbox";
import { registerSchema, type RegisterFormData } from "@/lib/validations/register";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    console.log(data);
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Google */}
      <motion.div
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <GoogleButton />
      </motion.div>

      {/* Divider */}
      <motion.div
        className="flex items-center gap-3"
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <div className="h-px flex-1 bg-white/30" />
        <span className="text-xs text-white/70">Ou Digite seu e-mail</span>
        <div className="h-px flex-1 bg-white/30" />
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

        {/* E-mail */}
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
            className="border-white/20 bg-white text-black placeholder:text-neutral-500 dark:bg-white dark:text-black dark:[color-scheme:light]"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-200">{errors.email.message}</p>
          )}
        </motion.div>

        {/* Telefone */}
        <motion.div
          className="flex flex-col gap-1"
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <label className="text-xs font-medium text-white">DDD + número</label>
          <PhoneInput {...register("phone")} />
          {errors.phone && (
            <p className="text-xs text-red-200">{errors.phone.message}</p>
          )}
        </motion.div>

        {/* Nome */}
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
            className="border-white/20 bg-white text-black placeholder:text-neutral-500 dark:bg-white dark:text-black dark:[color-scheme:light]"
            {...register("name")}
            onInput={(e) => {
              const input = e.currentTarget;
              input.value = input.value.replace(/[^\p{L}\s'-]/gu, "");
            }}
          />
          {errors.name && (
            <p className="text-xs text-red-200">{errors.name.message}</p>
          )}
        </motion.div>

        {/* Senha */}
        <motion.div
          className="flex flex-col gap-1"
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.45 }}
        >
          <label className="text-xs font-medium text-white">Senha</label>
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            className="border-white/20 bg-white text-black placeholder:text-neutral-500 dark:bg-white dark:text-black dark:[color-scheme:light]"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="text-neutral-500 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-200">{errors.password.message}</p>
          )}
        </motion.div>

        {/* Termos */}
        <motion.div
          className="flex flex-col gap-1"
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.5 }}
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
          transition={{ duration: 0.3, delay: 0.55 }}
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
    </div>
  );
}
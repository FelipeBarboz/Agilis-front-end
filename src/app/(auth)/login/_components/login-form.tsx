"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "../../register/user/_components/google-button";
import { loginSchema, type LoginFormData } from "@/lib/validations/login";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    resolver: zodResolver(loginSchema) as Resolver<LoginFormData>,
  });

  async function onSubmit(data: LoginFormData) {
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

        {/* Senha */}
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

        {/* Esqueci a senha */}
        <motion.div
          className="flex justify-end"
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          
          <a href="/auth/forgot-password"
          className="text-xs text-white/70 hover:text-white hover:underline">
            Esqueci minha senha
          </a>
        </motion.div>

        {/* Submit */}
        <motion.div
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.45 }}
        >
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-1 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Aguarde..." : "Entrar"}
          </Button>
        </motion.div>

      </form>
    </div>
  );
}
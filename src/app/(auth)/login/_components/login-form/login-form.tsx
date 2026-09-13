"use client";

import { Suspense } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "../../../../../components/google-button";
import { loginSchema, type LoginFormData } from "@/lib/validations/login";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { EmailField } from "./email-field";
import { PasswordField } from "./password-field";
import { ForgotPasswordLink } from "./forgot-password-link";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as Resolver<LoginFormData>,
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data.email, data.password);
      const redirectUrl = searchParams.get("redirect") || "/home";
      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      console.error("[Login] Erro ao autenticar:", error);
    }
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
        <EmailField register={register} error={errors.email} />
        <PasswordField register={register} error={errors.password} />
        <ForgotPasswordLink />

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

export function LoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginFormInner />
    </Suspense>
  );
}

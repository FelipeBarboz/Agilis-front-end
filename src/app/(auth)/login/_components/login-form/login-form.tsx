"use client";

import { Suspense, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/google-button";
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
  // Pode vir do Route Handler /auth/callback quando o OAuth falha
  const oauthError = searchParams.get("error");
  const [errorMessage, setErrorMessage] = useState<string | null>(oauthError);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as Resolver<LoginFormData>,
  });

  async function onSubmit(data: LoginFormData) {
    try {
      setErrorMessage(null);
      await login(data.email, data.password);
      const redirectUrl = searchParams.get("redirect") || "/home";
      router.push(redirectUrl);
      router.refresh();
    } catch (error: unknown) {
      console.error("[Login] Erro ao autenticar:", error);
      let message = "Erro ao realizar login. Tente novamente.";
      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          message = "E-mail ou senha incorretos.";
        } else if (error.message.includes("Email not confirmed")) {
          message = "Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.";
        } else if (error.message.includes("Too many requests")) {
          message = "Muitas tentativas consecutivas. Aguarde alguns instantes e tente novamente.";
        } else {
          message = error.message;
        }
      }
      setErrorMessage(message);
    }
  }

  const redirectUrl = searchParams.get("redirect") ?? undefined;

  return (
    <div className="flex flex-col gap-4">
      {errorMessage && (
        <div className="rounded-lg bg-red-500/10 p-3 text-xs text-red-400">
          {errorMessage}
        </div>
      )}

      {/* Google */}
      <motion.div
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <GoogleButton
          redirect={redirectUrl}
          onError={(err) => setErrorMessage(err.message)}
        />
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

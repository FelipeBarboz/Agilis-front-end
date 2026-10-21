"use client";

import { useState, Suspense } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "../../../../../../components/google-button";
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validations/register";
import { EmailField } from "./email-field";
import { PhoneField } from "./phone-field";
import { NameField } from "./name-field";
import { CpfField } from "./cpf-field";
import { PasswordField } from "./password-field";
import { TermsField } from "./terms-field";
import {
  validateEmail,
  signUpWithEmail,
  verifyOtpCode,
  registerClientProfile,
} from "@/lib/auth/auth-service";
import { useAuth } from "@/lib/auth/auth-context";
import { ArrowLeft, KeyRound } from "lucide-react";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function RegisterFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUserProfile } = useAuth();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [cachedFormData, setCachedFormData] = useState<RegisterFormData | null>(
    null
  );
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterFormData>,
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      setGeneralError(null);

      // 1. Valida o e-mail na API do backend
      const check = await validateEmail(data.email);
      if (!check.valid) {
        setError("email", {
          type: "manual",
          message: check.reason ?? "E-mail indisponível ou inválido",
        });
        return;
      }

      // 2. Dispara criação da conta no Supabase (envia código por e-mail)
      const { data: signUpData, error: signUpErr } = await signUpWithEmail(
        data.email,
        data.password,
        {
          name: data.name,
          phone: data.phone,
          cpf: data.cpf,
        }
      );

      if (signUpErr) {
        if (
          signUpErr.message.toLowerCase().includes("already registered") ||
          signUpErr.message.toLowerCase().includes("already exists")
        ) {
          throw new Error(
            "Este e-mail já está cadastrado. Faça login ou recupere sua senha."
          );
        }
        throw signUpErr;
      }

      setCachedFormData(data);

      // Se a confirmação de e-mail estiver desabilitada no Supabase e já tiver retornado sessão:
      if (signUpData.session) {
        await registerClientProfile({
          name: data.name,
          email: data.email,
          phone: data.phone,
          cpf: data.cpf,
        });
        await refreshUserProfile();
        const redirectUrl = searchParams.get("redirect") || "/home";
        router.push(redirectUrl);
        return;
      }

      // Caso padrão: aguarda o código de 8 dígitos enviado por e-mail
      setStep("otp");
    } catch (err: unknown) {
      console.error("[Register] Erro no cadastro:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao processar cadastro. Tente novamente.";
      setGeneralError(msg);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!cachedFormData) return;
    if (otpCode.trim().length < 8) {
      setOtpError("Digite o código de 8 dígitos");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      setOtpError(null);

      // 3. Usuário digita o código (isso abre a sessão no Supabase)
      const { error: otpErr } = await verifyOtpCode(
        cachedFormData.email,
        otpCode.trim(),
        "signup"
      );

      if (otpErr) {
        throw otpErr;
      }

      // 4. Cria o perfil na API do backend (agora autenticado com o Bearer token)
      await registerClientProfile({
        name: cachedFormData.name,
        email: cachedFormData.email,
        phone: cachedFormData.phone,
        cpf: cachedFormData.cpf,
      });

      await refreshUserProfile();

      const redirectUrl = searchParams.get("redirect") || "/home";
      router.push(redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      console.error("[Register OTP] Erro ao validar código:", err);
      const msg =
        err instanceof Error
          ? err.message === "Token has expired or is invalid"
            ? "Código inválido ou expirado. Tente novamente."
            : err.message
          : "Código incorreto. Verifique e tente novamente.";
      setOtpError(msg);
    } finally {
      setIsVerifyingOtp(false);
    }
  }

  async function handleResendCode() {
    if (!cachedFormData) return;
    try {
      setOtpError(null);
      await signUpWithEmail(cachedFormData.email, cachedFormData.password);
      alert("Novo código enviado para o seu e-mail!");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao reenviar código.";
      setOtpError(msg);
    }
  }

  if (step === "otp" && cachedFormData) {
    return (
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setStep("form")}
          className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Voltar e alterar dados
        </button>

        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
            <KeyRound size={22} />
          </div>
          <h3 className="text-base font-semibold text-white">
            Confirme seu e-mail
          </h3>
          <p className="text-xs text-white/70">
            Enviamos um código de 8 dígitos para <br />
            <strong className="text-white">{cachedFormData.email}</strong>
          </p>
        </div>

        {otpError && (
          <div className="rounded-lg bg-red-500/10 p-3 text-xs text-red-400 text-center">
            {otpError}
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/90 text-center">
              Código de verificação
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={8}
              value={otpCode}
              onChange={(e) =>
                setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 8))
              }
              placeholder="00000000"
              autoFocus
              className="w-full rounded-lg border border-white/20 bg-white py-3 text-center text-xl font-bold tracking-widest text-black placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-white dark:text-black"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isVerifyingOtp || otpCode.length < 8}
          >
            {isVerifyingOtp ? "Confirmando..." : "Confirmar e Cadastrar"}
          </Button>

          <button
            type="button"
            onClick={handleResendCode}
            className="text-xs text-white/70 hover:text-white hover:underline text-center"
          >
            Não recebeu? Clique para reenviar
          </button>
        </form>
      </div>
    );
  }

  const redirectUrl = searchParams.get("redirect") ?? undefined;

  return (
    <div className="flex flex-col gap-4">
      {generalError && (
        <div className="rounded-lg bg-red-500/10 p-3 text-xs text-red-400 text-center">
          {generalError}
        </div>
      )}

      {/* Google */}
      <motion.div
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <GoogleButton redirect={redirectUrl} />
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
        <PhoneField register={register} error={errors.phone} />
        <NameField register={register} error={errors.name} />
        <CpfField register={register} error={errors.cpf} />
        <PasswordField register={register} error={errors.password} />
        <TermsField register={register} error={errors.terms} />

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

export function RegisterForm() {
  return (
    <Suspense fallback={null}>
      <RegisterFormInner />
    </Suspense>
  );
}


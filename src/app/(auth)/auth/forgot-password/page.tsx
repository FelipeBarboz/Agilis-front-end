"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  requestPasswordReset,
  verifyOtpCode,
  updateUserPassword,
} from "@/lib/auth/auth-service";
import { ArrowLeft, CheckCircle2, KeyRound, Mail, Lock } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "otp" | "newPassword" | "success">("email");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Envia o código por e-mail
  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Digite seu e-mail.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const { error } = await requestPasswordReset(email.trim());
      if (error) throw error;
      setStep("otp");
    } catch (err: unknown) {
      console.error("[ForgotPassword] Erro ao enviar email:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao enviar código de recuperação.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  // 2. Confirma o OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otpCode.trim().length < 8) {
      setErrorMessage("Digite o código de 8 dígitos.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const { error } = await verifyOtpCode(email.trim(), otpCode.trim(), "recovery");
      if (error) throw error;
      setStep("newPassword");
    } catch (err: unknown) {
      console.error("[ForgotPassword] Erro ao validar OTP:", err);
      const msg =
        err instanceof Error
          ? err.message === "Token has expired or is invalid"
            ? "Código inválido ou expirado."
            : err.message
          : "Código incorreto.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  // 3. Define nova senha
  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setErrorMessage("A senha deve ter ao menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const { error } = await updateUserPassword(newPassword);
      if (error) throw error;
      setStep("success");
    } catch (err: unknown) {
      console.error("[ForgotPassword] Erro ao redefinir senha:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao atualizar senha. Tente novamente.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <motion.div
        className="bg-brand-green-dark px-6 pb-28 pt-6 text-center"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-xl font-bold text-primary-foreground">
          Recuperação de Senha
        </h1>
        <p className="mt-1 text-xs text-white/70">
          Redefina sua senha com segurança
        </p>
      </motion.div>

      {/* Form card */}
      <div className="mx-auto w-full max-w-md px-6">
        <motion.div
          className="-mt-20 rounded-2xl bg-primary p-6 shadow-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
        >
          {errorMessage && (
            <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-xs text-red-400 text-center">
              {errorMessage}
            </div>
          )}

          {/* Passo 1: Digitar E-mail */}
          {step === "email" && (
            <form onSubmit={handleSendEmail} className="flex flex-col gap-4">
              <div className="flex flex-col items-center text-center gap-1.5 mb-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                  <Mail size={22} />
                </div>
                <p className="text-xs text-white/80">
                  Informe o e-mail cadastrado para receber o código de 8 dígitos.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-white/90">E-mail</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white px-3 py-2.5 text-sm text-black placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="mt-2 w-full"
                disabled={loading || !email}
              >
                {loading ? "Enviando..." : "Enviar Código"}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white"
                >
                  <ArrowLeft size={14} /> Voltar para o login
                </Link>
              </div>
            </form>
          )}

          {/* Passo 2: Digitar Código OTP */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div className="flex flex-col items-center text-center gap-1.5 mb-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                  <KeyRound size={22} />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Código de Verificação
                </h3>
                <p className="text-xs text-white/80">
                  Enviamos o código para <strong className="text-white">{email}</strong>
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
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
                  className="w-full rounded-lg border border-white/20 bg-white py-3 text-center text-xl font-bold tracking-widest text-black placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading || otpCode.length < 8}
              >
                {loading ? "Validando..." : "Validar Código"}
              </Button>

              <div className="flex justify-between items-center text-xs text-white/70 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft size={12} /> Alterar e-mail
                </button>
                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="hover:text-white hover:underline"
                >
                  Reenviar código
                </button>
              </div>
            </form>
          )}

          {/* Passo 3: Nova Senha */}
          {step === "newPassword" && (
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3.5">
              <div className="flex flex-col items-center text-center gap-1.5 mb-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                  <Lock size={22} />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Criar Nova Senha
                </h3>
                <p className="text-xs text-white/80">
                  Escolha uma senha forte com no mínimo 8 caracteres.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-white/90">
                  Nova Senha
                </label>
                <input
                  type="password"
                  placeholder="No mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white px-3 py-2.5 text-sm text-black placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-white/90">
                  Confirme a Nova Senha
                </label>
                <input
                  type="password"
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white px-3 py-2.5 text-sm text-black placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="mt-2 w-full"
                disabled={loading || !newPassword || !confirmPassword}
              >
                {loading ? "Salvando..." : "Redefinir Senha"}
              </Button>
            </form>
          )}

          {/* Passo 4: Sucesso */}
          {step === "success" && (
            <div className="flex flex-col items-center text-center gap-4 py-2">
              <CheckCircle2 size={48} className="text-brand-green-primary" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  Senha alterada com sucesso!
                </h3>
                <p className="text-xs text-white/70">
                  Você já pode fazer login na sua conta com a nova senha.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                onClick={() => router.push("/login")}
              >
                Ir para o Login
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

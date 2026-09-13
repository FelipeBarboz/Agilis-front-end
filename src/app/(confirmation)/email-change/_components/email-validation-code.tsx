"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { PageHeader } from "./page-header";
import { OtpInput } from "./otp-input";

interface EmailValidationCodeProps {
  email: string;
  onBack: () => void;
  onConfirm: (code: string) => void;
}

export default function EmailValidationCode({
  email,
  onBack,
  onConfirm,
}: EmailValidationCodeProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      onConfirm(fullCode);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#D9D9D9]">
      <PageHeader onBack={onBack} />

      {/* Hero section */}
      <motion.div
        className="bg-brand-green-dark px-6 pb-32 pt-10 text-center"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="mx-auto max-w-[300px] text-2xl font-bold leading-snug text-primary-foreground">
          Preencha o código para finalizar a alteração
        </h1>
      </motion.div>

      {/* Form card */}
      <div className="mx-auto w-full max-w-[460px] px-6">
        <motion.div
          className="-mt-24 rounded-[12px] bg-brand-green p-8 pb-10 shadow-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
        >
          <div className="mb-8 text-center text-sm text-white">
            <p>Enviamos seu código por e-mail para</p>
            <p className="mt-1 font-semibold underline underline-offset-4">
              {email || "seuemail@email.com"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="mb-10 w-full">
              <OtpInput code={code} onChange={setCode} />
            </div>

            <button
              type="button"
              className="mb-10 text-sm font-semibold text-black underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              Reenviar código
            </button>

            <button
              type="submit"
              disabled={code.join("").length !== 6}
              className="h-11 w-full rounded-md bg-black font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-70"
            >
              Continuar
            </button>
          </form>
        </motion.div>
      </div>

      <div className="flex-1" />

      <div className="w-full pb-12 text-center text-sm text-black/80">
        <p>
          Já possui uma conta?{" "}
          <Link href="/login" className="text-[#3b82f6] hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

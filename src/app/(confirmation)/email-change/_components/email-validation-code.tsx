"use client";

import { useState, useRef, type KeyboardEvent, type ClipboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface EmailValidationCodeProps {
  email: string;
  onBack: () => void;
  onConfirm: (code: string) => void;
}

export default function EmailValidationCode({ email, onBack, onConfirm }: EmailValidationCodeProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    if (value.length > 1) {
        value = value.slice(-1);
    }
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if there's a value
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim().slice(0, 6);
    // Only allow numbers
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newCode[i] = pastedData[i] as string;
    }
    setCode(newCode);
    
    // Focus last filled input
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      onConfirm(fullCode);
    }
  };

  return (
    <div className="min-h-screen bg-[#D9D9D9] relative flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-brand-green-dark px-6 py-4">
        <button
          onClick={onBack}
          type="button"
          aria-label="Voltar"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
        >
          <ArrowLeft size={24} />
        </button>
        <Image
          src="/img/logo-opened.png"
          alt="Agilis"
          width={80}
          height={32}
          className="object-contain"
          priority
        />
      </header>

      {/* Hero section */}
      <motion.div
        className="bg-brand-green-dark px-6 pb-32 pt-10 text-center"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="mx-auto max-w-[300px] text-2xl font-bold text-primary-foreground leading-snug">
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
            <p className="font-semibold underline underline-offset-4 mt-1">{email || "seuemail@email.com"}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="mb-10 flex w-full justify-between gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="h-14 w-12 rounded-md bg-white text-center text-xl font-bold text-foreground outline-none focus:ring-2 focus:ring-brand-green-dark transition-shadow"
                />
              ))}
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
      
      <div className="w-full text-center text-sm text-black/80 pb-12">
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

"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export default function ChangeEmailPage() {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (email !== confirmEmail) {
      // TODO: exibir erro de validação
      return;
    }

    // TODO: chamar service/API para atualizar o e-mail
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="flex items-center justify-between bg-brand-green-dark px-6 py-4">
        <Link
          href="/profile"
          aria-label="Voltar"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </Link>
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
        className="bg-brand-green-dark px-6 pb-32 pt-6 text-center"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-xl font-bold text-primary-foreground">
          Altere seu E-mail
        </h1>
      </motion.div>

      {/* Form card */}
      <div className="mx-auto w-full max-w-md px-6">
        <motion.div
          className="-mt-24 rounded-2xl bg-primary p-6 shadow-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs font-medium text-white">
                Novo E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-md bg-white px-3 text-foreground outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="confirmEmail" className="text-xs font-medium text-white">
                Confirmar E-mail
              </label>
              <input
                id="confirmEmail"
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className="h-10 w-full rounded-md bg-white px-3 text-foreground outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-4 h-11 w-full rounded-md bg-black font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Continuar
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
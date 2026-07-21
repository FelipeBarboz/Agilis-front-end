"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      {/* Faixa verde escura do topo */}
      <div className="relative bg-brand-green-dark px-8 pt-6 pb-18">
        <Link
          href="/profile"
          aria-label="Voltar"
          className="absolute left-6 top-6 flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </Link>

        <Image
          src="/img/logo-opened.png"
          alt="Agilis"
          width={80}
          height={32}
          className="absolute right-6 top-6 object-contain"
          priority
        />

        <h1 className="pt-2 text-center text-2xl font-bold text-white">
          Altere seu E-mail
        </h1>
      </div>

      {/* Card sobrepondo só a borda da faixa verde */}
      <div className="flex justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="mt-16 w-full max-w-md flex flex-col gap-4 rounded-2xl bg-brand-green p-6"
        >
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
      </div>
    </div>
  );
}
"use client";

import { useRef, type FormEvent } from "react";

interface EmailFormProps {
  email: string;
  confirmEmail: string;
  onEmailChange: (value: string) => void;
  onConfirmEmailChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function EmailForm({
  email,
  confirmEmail,
  onEmailChange,
  onConfirmEmailChange,
  onSubmit,
}: EmailFormProps) {
  const confirmEmailRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (email !== confirmEmail) {
      if (confirmEmailRef.current) {
        confirmEmailRef.current.setCustomValidity(
          "Os e-mails informados não coincidem."
        );
        confirmEmailRef.current.reportValidity();
      }
      return;
    }

    onSubmit(e);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-xs font-medium text-white">
          Novo E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            onEmailChange(e.target.value);
            confirmEmailRef.current?.setCustomValidity("");
          }}
          className="h-10 w-full rounded-md bg-white px-3 text-foreground outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="confirmEmail" className="text-xs font-medium text-white">
          Confirmar E-mail
        </label>
        <input
          id="confirmEmail"
          ref={confirmEmailRef}
          type="email"
          value={confirmEmail}
          onChange={(e) => {
            onConfirmEmailChange(e.target.value);
            e.target.setCustomValidity("");
          }}
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
  );
}

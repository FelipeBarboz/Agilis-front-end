"use client";

import { useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { api } from "@/trpc/react"; // TODO: integrar com o backend

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function DocumentForm() {
  const [cpf, setCpf] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const updateDocument = api.user.updateDocument.useMutation();

  const isValidCpf = cpf.replace(/\D/g, "").length === 11;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValidCpf) return;

    setIsSubmitting(true);
    // updateDocument.mutate(
    //   { cpf: cpf.replace(/\D/g, "") },
    //   { onSettled: () => setIsSubmitting(false) },
    // );
    console.log("CPF do titular:", cpf);
    setIsSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-primary p-6 shadow-lg"
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="cpf"
          className="text-left text-xs font-medium text-white"
        >
          Digite o CPF do titular da conta
        </label>

        <Input
          id="cpf"
          value={cpf}
          onChange={(event) => setCpf(formatCpf(event.target.value))}
          placeholder="000.000.000-00"
          inputMode="numeric"
          className="h-10 w-full rounded-md border-none bg-white px-3 text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <Button
        type="submit"
        disabled={!isValidCpf || isSubmitting}
        className="mt-2 h-11 w-full rounded-md bg-black font-medium text-white transition-colors hover:bg-neutral-800"
      >
        Continuar
      </Button>
    </form>
  );
}
"use client";

import { useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { api } from "@/trpc/react"; // TODO: integrar com o backend

export function PreferredNameForm() {
  const [preferredName, setPreferredName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const updatePreferredName = api.user.updatePreferredName.useMutation();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!preferredName.trim()) return;

    setIsSubmitting(true);
    // updatePreferredName.mutate(
    //   { preferredName },
    //   { onSettled: () => setIsSubmitting(false) },
    // );
    console.log("Nome de preferência:", preferredName);
    setIsSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-3 rounded-2xl bg-primary p-6"
    >
      <label
        htmlFor="preferredName"
        className="text-left text-xs font-medium text-primary-foreground"
      >
        Nome de preferência
      </label>

      <Input
        id="preferredName"
        value={preferredName}
        onChange={(event) => setPreferredName(event.target.value)}
        placeholder="Digite seu nome"
        className="border-none bg-white text-foreground placeholder:text-muted-foreground"
      />

      <Button
        type="submit"
        disabled={!preferredName.trim() || isSubmitting}
        className="w-full rounded-xl bg-black py-6 text-base font-semibold text-white hover:bg-black/90"
        >
     Continuar
    </Button>
    </form>
  );
}
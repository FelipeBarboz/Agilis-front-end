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
      className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-primary p-6 shadow-lg"
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="preferredName"
          className="text-left text-xs font-medium text-white"
        >
          Nome de preferência
        </label>

        <Input
          id="preferredName"
          value={preferredName}
          onChange={(event) => setPreferredName(event.target.value)}
          placeholder="Digite seu nome"
          className="h-10 w-full rounded-md border-none bg-white px-3 text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <Button
        type="submit"
        disabled={!preferredName.trim() || isSubmitting}
        className="mt-2 h-11 w-full rounded-md bg-black font-medium text-white transition-colors hover:bg-neutral-800"
      >
        Continuar
      </Button>
    </form>
  );
}
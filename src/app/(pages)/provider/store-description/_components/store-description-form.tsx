"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { StoreDescriptionField } from "./store-description-field";
import { StoreDescriptionActions } from "./store-description-actions";

export function StoreDescriptionForm() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const maxLength = 500;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("form_storeDescription", "true");
    router.push("/provider/create-store");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <StoreDescriptionField
        description={description}
        maxLength={maxLength}
        onChange={setDescription}
      />

      {/* Separador */}
      <div className="h-px bg-border" />

      <StoreDescriptionActions />
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { StoreDescriptionField } from "./store-description-field";
import { StoreDescriptionActions } from "./store-description-actions";

export function StoreDescriptionForm() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const maxLength = 500;

  useEffect(() => {
    const saved = sessionStorage.getItem("provider_description");
    if (saved) setDescription(saved);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("provider_description", description.trim());
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

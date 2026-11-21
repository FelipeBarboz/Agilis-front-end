"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BasicInformationsFields } from "./basic-informations-fields";
import { BasicInformationsActions } from "./basic-informations-actions";

export function BasicInformationsForm() {
  const router = useRouter();
  const [storeName, setStoreName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    const savedName = sessionStorage.getItem("provider_storeName");
    const savedSlug = sessionStorage.getItem("provider_slug");
    if (savedName) setStoreName(savedName);
    if (savedSlug) setSlug(savedSlug);
  }, []);

  const handleStoreNameChange = (val: string) => {
    setStoreName(val);
    const autoSlug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(autoSlug);
  };

  const handleSlugChange = (val: string) => {
    const cleanSlug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]+/g, "");
    setSlug(cleanSlug);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;

    const finalSlug =
      slug.trim() ||
      storeName
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    sessionStorage.setItem("provider_storeName", storeName.trim());
    sessionStorage.setItem("provider_slug", finalSlug);
    sessionStorage.setItem("form_basicInfos", "true");
    router.push("/provider/create-store");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <BasicInformationsFields
        storeName={storeName}
        slug={slug}
        onStoreNameChange={handleStoreNameChange}
        onSlugChange={handleSlugChange}
      />

      {/* Separador */}
      <div className="h-px bg-border" />

      <BasicInformationsActions />
    </form>
  );
}

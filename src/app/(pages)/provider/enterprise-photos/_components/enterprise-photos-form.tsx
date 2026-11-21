"use client";

import { useRef, useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EnterpriseLogoField } from "./enterprise-logo-field";
import { EnterprisePhotosActions } from "./enterprise-photos-actions";

export function EnterprisePhotosForm() {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    const savedLogo = sessionStorage.getItem("provider_profileImgUrl");
    if (savedLogo) setLogoPreview(savedLogo);
  }, []);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        sessionStorage.setItem("provider_profileImgUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoRemove = () => {
    setLogoPreview(null);
    sessionStorage.removeItem("provider_profileImgUrl");
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (logoPreview) {
      sessionStorage.setItem("provider_profileImgUrl", logoPreview);
    }
    sessionStorage.setItem("form_enterprisePhotos", "true");
    router.push("/provider/create-store");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <EnterpriseLogoField
        inputRef={logoInputRef}
        logoPreview={logoPreview}
        onChange={handleLogoChange}
        onRemove={handleLogoRemove}
      />

      {/* Separador */}
      <div className="h-px bg-border" />

      <EnterprisePhotosActions />
    </form>
  );
}

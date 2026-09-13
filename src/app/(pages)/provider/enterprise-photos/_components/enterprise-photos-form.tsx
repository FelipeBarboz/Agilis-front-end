"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EnterpriseLogoField } from "./enterprise-logo-field";
import { EnterpriseGalleryField } from "./enterprise-gallery-field";
import { EnterprisePhotosActions } from "./enterprise-photos-actions";

export function EnterprisePhotosForm() {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const maxPhotos = 6;

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleLogoRemove = () => {
    setLogoPreview(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handlePhotoAdd = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = maxPhotos - photos.length;
    const newPhotos = Array.from(files)
      .slice(0, remaining)
      .map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = "";
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
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

      <EnterpriseGalleryField
        photos={photos}
        maxPhotos={maxPhotos}
        inputRef={photosInputRef}
        onAddPhotos={handlePhotoAdd}
        onRemovePhoto={handleRemovePhoto}
      />

      {/* Separador */}
      <div className="h-px bg-border" />

      <EnterprisePhotosActions />
    </form>
  );
}

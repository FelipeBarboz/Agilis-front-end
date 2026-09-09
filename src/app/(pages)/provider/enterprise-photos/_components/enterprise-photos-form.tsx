"use client";

import { Button } from "@/components/ui/button";
import { Camera, ImagePlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRef, useState } from "react";

export function EnterprisePhotosForm() {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const maxPhotos = 6;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("form_enterprisePhotos", "true");
    router.push("/provider/create-store");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Logo da loja */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-foreground">Logo da loja</p>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleLogoChange}
          className="hidden"
          id="logo-input"
        />

        {logoPreview ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <img
                src={logoPreview}
                alt="Logo da loja"
                className="h-24 w-24 rounded-2xl object-cover border-2 border-border shadow-sm"
              />
              <button
                type="button"
                onClick={() => setLogoPreview(null)}
                className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white shadow-sm cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="text-xs font-semibold text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer"
            >
              Trocar logo
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/20 py-8 transition-all hover:border-primary/50 hover:bg-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/20 cursor-pointer"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-transform group-hover:scale-110">
              <Camera className="size-7 text-primary" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Adicionar logo</p>
              <p className="mt-0.5 text-xs text-muted-foreground">PNG ou JPG • Até 2MB</p>
            </div>
          </button>
        )}
      </div>

      {/* Separador */}
      <div className="h-px bg-border" />

      {/* Fotos dos serviços */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-foreground">Fotos dos serviços</p>
          <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {photos.length}/{maxPhotos}
          </span>
        </div>

        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/webp"
          onChange={handlePhotoAdd}
          className="hidden"
          id="photos-input"
        />

        <div className="grid grid-cols-3 gap-3">
          {photos.map((photoUrl, idx) => (
            <div
              key={idx}
              className="relative aspect-square overflow-hidden rounded-xl border border-border group shadow-xs"
            >
              <img
                src={photoUrl}
                alt={`Foto ${idx + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(idx)}
                className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-destructive text-white shadow-sm opacity-90 hover:opacity-100 cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}

          {photos.length < maxPhotos && (
            <button
              type="button"
              onClick={() => document.getElementById("photos-input")?.click()}
              className="group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border bg-muted/20 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20 cursor-pointer"
            >
              <ImagePlus className="size-6 transition-transform group-hover:scale-110" strokeWidth={1.5} />
              <span className="text-[10px] font-semibold">Adicionar</span>
            </button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Fotos de alta qualidade aumentam a confiança dos clientes
        </p>
      </div>

      {/* Separador */}
      <div className="h-px bg-border" />

      {/* Botões */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/provider/create-store"
          className="flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:flex-1"
        >
          Cancelar
        </Link>
        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 sm:flex-[2] cursor-pointer"
        >
          Salvar e continuar
        </Button>
      </div>

    </form>
  );
}

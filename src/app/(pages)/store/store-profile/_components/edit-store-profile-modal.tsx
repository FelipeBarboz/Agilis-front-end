"use client";

import { useState, useRef, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { X, Store, Camera, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateStoreProfile,
  getAuthenticatedUserId,
  type StoreProfileDTO,
} from "@/lib/services/stores-service";
import { useAuth } from "@/lib/auth/auth-context";

interface EditStoreProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: StoreProfileDTO | null;
  onStoreUpdated: (updated: StoreProfileDTO) => void;
}

export function EditStoreProfileModal({
  isOpen,
  onClose,
  store,
  onStoreUpdated,
}: EditStoreProfileModalProps) {
  const { user, supabaseUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [profileImgUrl, setProfileImgUrl] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (store && isOpen) {
      setStoreName(store.storeName || "");
      setDescription(store.description || "");
      setSlug(store.slug || "");
      setProfileImgUrl(store.profileImgUrl || "");
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [store, isOpen]);

  if (!isOpen || !store) return null;

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setProfileImgUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImgUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!storeName.trim()) {
      setErrorMessage("Por favor, preencha o nome da loja.");
      return;
    }

    try {
      setIsSaving(true);
      const requesterId =
        user?.id ||
        supabaseUser?.id ||
        (await getAuthenticatedUserId()) ||
        store.id;

      const storeId = store.id || (store as unknown as { storeId?: string }).storeId || "";

      const updated = await updateStoreProfile(storeId, {
        requesterId,
        storeId,
        storeName: storeName.trim(),
        description: description.trim(),
        slug: slug.trim() || store.slug,
        profileImgUrl: profileImgUrl.trim(),
      });

      setSuccessMessage("Perfil atualizado com sucesso!");
      onStoreUpdated(updated);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      console.error("[EditStoreProfileModal] Erro ao atualizar perfil da loja:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao atualizar informações da loja.";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Store className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Editar Perfil da Loja</h2>
              <p className="text-xs text-muted-foreground">
                Atualize o nome, logotipo e dados públicos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Feedback Messages */}
        {successMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs font-medium text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          {/* Logo / Imagem da Loja */}
          <div className="flex flex-col items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />
            <div className="relative group">
              {profileImgUrl ? (
                <img
                  src={profileImgUrl}
                  alt={storeName || "Logo da loja"}
                  className="size-24 rounded-full object-cover border-2 border-border shadow-xs"
                />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-2xl border-2 border-dashed border-primary/30">
                  <Store className="size-8" />
                </div>
              )}
              {profileImgUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-destructive text-white shadow-xs hover:scale-110 transition-transform cursor-pointer"
                  title="Remover imagem"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-border hover:bg-muted text-xs font-semibold cursor-pointer"
            >
              <Camera className="size-3.5 mr-1.5" />
              {profileImgUrl ? "Trocar imagem" : "Enviar logotipo"}
            </Button>
          </div>

          {/* Nome da Loja */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="modalStoreName" className="text-xs font-bold text-foreground">
              Nome da loja <span className="text-primary">*</span>
            </label>
            <Input
              id="modalStoreName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Ex: Super Pinturas, Carlão Piscinas..."
              className="h-11 rounded-xl"
            />
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="modalStoreSlug" className="text-xs font-bold text-foreground">
              Link personalizado (Slug)
            </label>
            <div className="flex items-center rounded-xl border border-input bg-muted/40 px-3 text-xs text-muted-foreground focus-within:border-primary">
              <span className="shrink-0 font-medium select-none">agilis.com.br/loja/</span>
              <input
                id="modalStoreSlug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="nome-da-loja"
                className="h-11 w-full bg-transparent px-1 text-sm text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="modalStoreDesc" className="text-xs font-bold text-foreground">
                Descrição da loja
              </label>
              <span className="text-[11px] text-muted-foreground">
                {description.length}/300
              </span>
            </div>
            <textarea
              id="modalStoreDesc"
              rows={3}
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conte brevemente sobre sua loja, diferenciais e especialidades..."
              className="w-full resize-none rounded-xl border border-input bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border-border hover:bg-muted text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

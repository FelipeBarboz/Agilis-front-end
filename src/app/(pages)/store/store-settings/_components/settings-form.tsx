"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { SettingsIdentityCard } from "./settings-identity-card";
import { SettingsPresenceCard } from "./settings-presence-card";
import { SettingsChannelsCard } from "./settings-channels-card";
import { SettingsActions } from "./settings-actions";
import {
  getStoreById,
  updateStoreProfile,
  getAuthenticatedUserId,
  formatCnpj,
} from "@/lib/services/stores-service";
import { useAuth } from "@/lib/auth/auth-context";

export function SettingsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeIdParam = searchParams.get("storeId");
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStoreId, setCurrentStoreId] = useState("");

  // Estados de identificação da loja
  const [storeName, setStoreName] = useState("Minha Loja");
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [category, setCategory] = useState(
    "Manutenção e Limpeza de Piscinas"
  );
  const [region, setRegion] = useState(
    "Guarulhos e Região Metropolitana de SP"
  );
  const [storeSlug, setStoreSlug] = useState("");

  // Logo da loja
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Redes Sociais e Canais de Contato
  const [whatsapp, setWhatsapp] = useState("(11) 99999-8888");
  const [instagram, setInstagram] = useState("carlaopiscinas");
  const [facebook, setFacebook] = useState("carlaopiscinasoficial");
  const [website, setWebsite] = useState("www.carlaopiscinas.com.br");

  // Preferências de Aplicação da Marca
  const [reportsChecked, setReportsChecked] = useState(true);
  const [emailsChecked, setEmailsChecked] = useState(true);
  const [publicBadgeChecked, setPublicBadgeChecked] = useState(true);

  // Estados de feedback
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    let idToLoad = storeIdParam;
    if (!idToLoad && typeof window !== "undefined") {
      idToLoad = localStorage.getItem("current_store_id") || "";
    }
    if (idToLoad) {
      setCurrentStoreId(idToLoad);
      getStoreById(idToLoad)
        .then((data) => {
          if (data) {
            if (data.storeName) setStoreName(data.storeName);
            if (data.cnpj) setCnpj(formatCnpj(data.cnpj));
            if (data.slug) setStoreSlug(data.slug);
            if (data.profileImgUrl) setLogoPreview(data.profileImgUrl);
          }
        })
        .catch((err) => {
          console.warn("[SettingsForm] Erro ao carregar dados da loja:", err);
        });
    }
  }, [storeIdParam]);

  // Upload de imagem do logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLogoPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Copiar URL da loja
  const handleCopySlug = () => {
    void navigator.clipboard.writeText(
      `https://agilis.com.br/loja/${storeSlug}`
    );
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2500);
  };

  // Salvar formulário via PUT /api/v1/stores/{storeId}
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      if (currentStoreId) {
        const requesterId = user?.id || (await getAuthenticatedUserId()) || currentStoreId;
        await updateStoreProfile(currentStoreId, {
          requesterId,
          storeId: currentStoreId,
          storeName: storeName.trim(),
          description: "",
          slug: storeSlug.trim(),
          profileImgUrl: logoPreview || "",
        });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.warn("[SettingsForm] Erro ao atualizar perfil da loja:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(
      currentStoreId
        ? `/store/store-profile?storeId=${encodeURIComponent(currentStoreId)}`
        : "/store/store-profile"
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Alerta de Sucesso Flutuante/Topo */}
      {saveSuccess && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-700 dark:text-emerald-400 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="flex flex-col">
            <span className="font-bold">Alterações salvas com sucesso!</span>
            <span className="text-xs text-muted-foreground">
              As novas informações já estão atualizadas no perfil público da sua loja.
            </span>
          </div>
        </div>
      )}

      {/* CARD 1: Identidade da Loja & Logotipo */}
      <SettingsIdentityCard
        storeName={storeName}
        onStoreNameChange={setStoreName}
        companyName={companyName}
        onCompanyNameChange={setCompanyName}
        cnpj={cnpj}
        onCnpjChange={setCnpj}
        category={category}
        onCategoryChange={setCategory}
        logoPreview={logoPreview}
        onLogoUpload={handleLogoUpload}
        onRemoveLogo={handleRemoveLogo}
        fileInputRef={fileInputRef}
      />

      {/* CARD 2: Região de Atendimento & Link da Loja */}
      <SettingsPresenceCard
        region={region}
        onRegionChange={setRegion}
        storeSlug={storeSlug}
        onStoreSlugChange={setStoreSlug}
        copiedSlug={copiedSlug}
        onCopySlug={handleCopySlug}
      />

      {/* CARD 3: Contatos & Redes Sociais */}
      <SettingsChannelsCard
        whatsapp={whatsapp}
        onWhatsappChange={setWhatsapp}
        instagram={instagram}
        onInstagramChange={setInstagram}
        facebook={facebook}
        onFacebookChange={setFacebook}
        website={website}
        onWebsiteChange={setWebsite}
      />


      {/* Botões de Ação */}
      <SettingsActions isSaving={isSaving} onCancel={handleCancel} />
    </form>
  );
}

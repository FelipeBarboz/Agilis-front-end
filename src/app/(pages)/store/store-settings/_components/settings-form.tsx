"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { SettingsIdentityCard } from "./settings-identity-card";
import { SettingsPresenceCard } from "./settings-presence-card";
import { SettingsChannelsCard } from "./settings-channels-card";
import { SettingsActions } from "./settings-actions";

export function SettingsForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de identificação da loja
  const [storeName, setStoreName] = useState("Carlão Piscinas");
  const [companyName, setCompanyName] = useState(
    "Carlos Eduardo da Silva Manutenções ME"
  );
  const [cnpj, setCnpj] = useState("12.345.678/0001-90");
  const [category, setCategory] = useState(
    "Manutenção e Limpeza de Piscinas"
  );
  const [region, setRegion] = useState(
    "Guarulhos e Região Metropolitana de SP"
  );
  const [storeSlug, setStoreSlug] = useState("carlao-piscinas");

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

  // Upload de imagem do logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
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

  // Salvar formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 600);
  };

  const handleCancel = () => {
    router.push("/store/store-profile");
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

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  MapPin,
  Globe,
  Phone,
  Camera,
  Check,
  CheckCircle2,
  Copy,
  Save,
  RotateCcw,
  Sparkles,
  FileText,
  Mail,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Ícones de Redes Sociais Estilizados ──────────────────────────────────────

function InstagramIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export function SettingsForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de identificação da loja
  const [storeName, setStoreName] = useState("Carlão Piscinas");
  const [companyName, setCompanyName] = useState("Carlos Eduardo da Silva Manutenções ME");
  const [cnpj, setCnpj] = useState("12.345.678/0001-90");
  const [category, setCategory] = useState("Manutenção e Limpeza de Piscinas");
  const [region, setRegion] = useState("Guarulhos e Região Metropolitana de SP");
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
    navigator.clipboard.writeText(`https://agilis.com.br/loja/${storeSlug}`);
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
      <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
        {/* Cabeçalho da Seção */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Store className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Identidade &amp; Logotipo</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Personalize a marca da sua empresa exibida para clientes e parceiros
            </p>
          </div>
        </div>

        {/* Bloco do Logotipo */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-2xl border border-border bg-muted/20 p-4 sm:p-6">
          <div className="relative group">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logotipo da Loja"
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-2 border-border shadow-xs"
              />
            ) : (
              <div className="flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-2xl bg-[#006b49] text-3xl sm:text-4xl font-light text-white shadow-sm">
                CP
              </div>
            )}
            
            {/* Badge de Verificado */}
            <div
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-primary text-white shadow-xs"
              title="Loja Verificada"
            >
              <Check className="size-3.5" strokeWidth={3} />
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center sm:items-start gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">Logotipo da Empresa</span>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Ativo
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-md">
              Envie uma imagem em PNG, JPG ou WebP de até 5MB. Recomendamos formato quadrado (500x500px).
            </p>

            <div className="flex items-center gap-2 mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-file-input"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-border text-xs font-semibold hover:bg-card cursor-pointer"
              >
                <Camera className="size-3.5 mr-1.5" />
                Alterar logotipo
              </Button>

              {logoPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveLogo}
                  className="rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <Trash2 className="size-3.5 mr-1.5" />
                  Remover
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Campos de Dados da Empresa */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground">Nome Fantasia da Loja</label>
            <Input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Ex: Carlão Piscinas"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground">Razão Social</label>
            <Input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Razão social oficial"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground">CNPJ</label>
            <Input
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0001-00"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground">Segmento / Categoria</label>
            <Input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Manutenção de Piscinas"
              className="h-11 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* CARD 2: Região de Atendimento & Link da Loja */}
      <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Presença &amp; Atendimento</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Defina sua área de atuação e sua URL pública exclusiva
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground">Área / Região de Cobertura</label>
            <Input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Ex: São Paulo, SP ou Região Metropolitana"
              leftIcon={<MapPin className="size-4" />}
              className="h-11 rounded-xl"
            />
          </div>

          {/* Link Público da Loja */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground">Endereço Web da Loja (URL)</label>
            <div className="flex rounded-xl border border-input bg-background overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="inline-flex items-center gap-1.5 bg-muted/60 px-3.5 text-xs sm:text-sm font-medium text-muted-foreground border-r border-input select-none shrink-0">
                <Globe className="size-3.5 text-primary" />
                agilis.com.br/loja/
              </span>
              <input
                type="text"
                value={storeSlug}
                onChange={(e) => setStoreSlug(e.target.value)}
                placeholder="sua-loja"
                className="w-full bg-transparent px-3.5 py-2.5 text-sm text-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopySlug}
                className="inline-flex items-center gap-1 bg-muted/40 hover:bg-muted px-3.5 text-xs font-medium text-foreground transition-colors border-l border-input cursor-pointer shrink-0"
              >
                {copiedSlug ? (
                  <>
                    <Check className="size-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold hidden sm:inline">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span className="hidden sm:inline">Copiar</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Compartilhe esse link com clientes para que eles agendem diretamente com sua equipe.
            </p>
          </div>
        </div>
      </div>

      {/* CARD 3: Contatos & Redes Sociais */}
      <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Phone className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Canais &amp; Redes Sociais</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Facilite o contato e aumente a credibilidade da sua empresa
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* WhatsApp */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span className="flex size-5 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
                <Phone className="size-3" />
              </span>
              WhatsApp de Atendimento
            </label>
            <Input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(11) 99999-9999"
              className="h-11 rounded-xl"
            />
          </div>

          {/* Instagram */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span className="flex size-5 items-center justify-center rounded-md bg-pink-500/10 text-pink-600">
                <InstagramIcon className="size-3" />
              </span>
              Instagram da Loja
            </label>
            <div className="flex rounded-xl border border-input bg-background overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="inline-flex items-center bg-muted/60 px-3 text-xs font-medium text-muted-foreground border-r border-input select-none">
                @
              </span>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="usuario_loja"
                className="w-full bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Facebook */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span className="flex size-5 items-center justify-center rounded-md bg-blue-500/10 text-blue-600">
                <FacebookIcon className="size-3" />
              </span>
              Página no Facebook
            </label>
            <Input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="facebook.com/pagina"
              className="h-11 rounded-xl"
            />
          </div>

          {/* Website Oficial */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span className="flex size-5 items-center justify-center rounded-md bg-sky-500/10 text-sky-600">
                <Globe className="size-3" />
              </span>
              Website Oficial
            </label>
            <Input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="www.sualoja.com.br"
              className="h-11 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* CARD 4: Personalização de Marca & Aplicação nos Documentos */}
      <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Aplicação da Marca nos Documentos</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Selecione onde o logotipo e os dados da sua empresa serão exibidos
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Opção 1: Relatórios e Comprovantes */}
          <div
            onClick={() => setReportsChecked(!reportsChecked)}
            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
              reportsChecked
                ? "border-primary/40 bg-primary/5 shadow-xs"
                : "border-border bg-card hover:bg-muted/40"
            }`}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
              <FileText className="size-5" />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">Relatórios &amp; Comprovantes em PDF</span>
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                    reportsChecked
                      ? "bg-primary border-primary text-white shadow-xs"
                      : "border-input bg-background"
                  }`}
                >
                  {reportsChecked && <Check className="size-3.5" strokeWidth={3} />}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Inclui cabeçalho personalizado com seu logotipo e CNPJ nos orçamentos e comprovantes emitidos pelo Agilis.
              </p>
            </div>
          </div>

          {/* Opção 2: E-mails e Notificações */}
          <div
            onClick={() => setEmailsChecked(!emailsChecked)}
            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
              emailsChecked
                ? "border-primary/40 bg-primary/5 shadow-xs"
                : "border-border bg-card hover:bg-muted/40"
            }`}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
              <Mail className="size-5" />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">Notificações por E-mail e WhatsApp</span>
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                    emailsChecked
                      ? "bg-primary border-primary text-white shadow-xs"
                      : "border-input bg-background"
                  }`}
                >
                  {emailsChecked && <Check className="size-3.5" strokeWidth={3} />}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Exibe o nome e logotipo da loja nos lembretes automáticos de agendamento enviados aos clientes.
              </p>
            </div>
          </div>

          {/* Opção 3: Selo de Empresa Verificada */}
          <div
            onClick={() => setPublicBadgeChecked(!publicBadgeChecked)}
            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
              publicBadgeChecked
                ? "border-primary/40 bg-primary/5 shadow-xs"
                : "border-border bg-card hover:bg-muted/40"
            }`}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
              <ShieldCheck className="size-5" />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">Selo de Loja Verificada na Busca</span>
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                    publicBadgeChecked
                      ? "bg-primary border-primary text-white shadow-xs"
                      : "border-input bg-background"
                  }`}
                >
                  {publicBadgeChecked && <Check className="size-3.5" strokeWidth={3} />}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Destaca sua loja com selo oficial de confiança no catálogo de prestadores do Agilis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ações de Rodapé */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="w-full sm:w-auto rounded-xl px-6 h-11 text-sm font-medium border-border hover:bg-muted text-foreground transition-colors cursor-pointer"
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto rounded-xl px-8 h-11 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all focus:ring-4 focus:ring-primary/20 cursor-pointer"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <RotateCcw className="size-4 animate-spin" />
              Salvando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="size-4" />
              Salvar alterações
            </span>
          )}
        </Button>
      </div>

    </form>
  );
}

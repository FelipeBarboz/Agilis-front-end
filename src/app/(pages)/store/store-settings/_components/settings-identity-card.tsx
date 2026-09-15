import { type RefObject } from "react";
import { Store, Camera, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SettingsIdentityCardProps {
  storeName: string;
  onStoreNameChange: (value: string) => void;
  companyName: string;
  onCompanyNameChange: (value: string) => void;
  cnpj: string;
  onCnpjChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  logoPreview: string | null;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export function SettingsIdentityCard({
  storeName,
  onStoreNameChange,
  companyName,
  onCompanyNameChange,
  cnpj,
  onCnpjChange,
  category,
  onCategoryChange,
  logoPreview,
  onLogoUpload,
  onRemoveLogo,
  fileInputRef,
}: SettingsIdentityCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Store className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Identidade &amp; Logotipo
          </h2>
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
              onChange={onLogoUpload}
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
                onClick={onRemoveLogo}
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
            onChange={(e) => onStoreNameChange(e.target.value)}
            placeholder="Ex: Carlão Piscinas"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-foreground">Razão Social</label>
          <Input
            type="text"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            placeholder="Razão social oficial"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-foreground">CNPJ</label>
          <Input
            type="text"
            value={cnpj}
            onChange={(e) => onCnpjChange(e.target.value)}
            placeholder="00.000.000/0001-00"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-foreground">Segmento / Categoria</label>
          <Input
            type="text"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            placeholder="Ex: Manutenção de Piscinas"
            className="h-11 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

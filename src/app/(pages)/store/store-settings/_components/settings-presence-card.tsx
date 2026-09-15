import { MapPin, Globe, Check, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SettingsPresenceCardProps {
  region: string;
  onRegionChange: (value: string) => void;
  storeSlug: string;
  onStoreSlugChange: (value: string) => void;
  copiedSlug: boolean;
  onCopySlug: () => void;
}

export function SettingsPresenceCard({
  region,
  onRegionChange,
  storeSlug,
  onStoreSlugChange,
  copiedSlug,
  onCopySlug,
}: SettingsPresenceCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MapPin className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Presença &amp; Atendimento
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Defina sua área de atuação e sua URL pública exclusiva
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-foreground">
            Área / Região de Cobertura
          </label>
          <Input
            type="text"
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
            placeholder="Ex: São Paulo, SP ou Região Metropolitana"
            leftIcon={<MapPin className="size-4" />}
            className="h-11 rounded-xl"
          />
        </div>

        {/* Link Público da Loja */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-foreground">
            Endereço Web da Loja (URL)
          </label>
          <div className="flex rounded-xl border border-input bg-background overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="inline-flex items-center gap-1.5 bg-muted/60 px-3.5 text-xs sm:text-sm font-medium text-muted-foreground border-r border-input select-none shrink-0">
              <Globe className="size-3.5 text-primary" />
              agilis.com.br/loja/
            </span>
            <input
              type="text"
              value={storeSlug}
              onChange={(e) => onStoreSlugChange(e.target.value)}
              placeholder="sua-loja"
              className="w-full bg-transparent px-3.5 py-2.5 text-sm text-foreground focus:outline-none"
            />
            <button
              type="button"
              onClick={onCopySlug}
              className="inline-flex items-center gap-1 bg-muted/40 hover:bg-muted px-3.5 text-xs font-medium text-foreground transition-colors border-l border-input cursor-pointer shrink-0"
            >
              {copiedSlug ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold hidden sm:inline">
                    Copiado
                  </span>
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
  );
}

import { Phone, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InstagramIcon, FacebookIcon } from "./social-icons";

interface SettingsChannelsCardProps {
  whatsapp: string;
  onWhatsappChange: (value: string) => void;
  instagram: string;
  onInstagramChange: (value: string) => void;
  facebook: string;
  onFacebookChange: (value: string) => void;
  website: string;
  onWebsiteChange: (value: string) => void;
}

export function SettingsChannelsCard({
  whatsapp,
  onWhatsappChange,
  instagram,
  onInstagramChange,
  facebook,
  onFacebookChange,
  website,
  onWebsiteChange,
}: SettingsChannelsCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Phone className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Canais &amp; Redes Sociais
          </h2>
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
            onChange={(e) => onWhatsappChange(e.target.value)}
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
              onChange={(e) => onInstagramChange(e.target.value)}
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
            onChange={(e) => onFacebookChange(e.target.value)}
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
            onChange={(e) => onWebsiteChange(e.target.value)}
            placeholder="www.sualoja.com.br"
            className="h-11 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

import type { ChangeEvent, RefObject } from "react";
import { Camera, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnterpriseLogoFieldProps {
  inputRef: RefObject<HTMLInputElement | null>;
  logoPreview: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export function EnterpriseLogoField({
  inputRef,
  logoPreview,
  onChange,
  onRemove,
}: EnterpriseLogoFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold text-foreground">Logo da loja</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={onChange}
        className="hidden"
        id="logo-input"
      />

      {logoPreview ? (
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <img
              src={logoPreview}
              alt="Logo preview"
              className="h-28 w-28 rounded-2xl object-cover border-2 border-border shadow-md"
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white shadow-sm transition-transform hover:scale-110 cursor-pointer"
              title="Remover logo"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            className="rounded-xl border-border text-xs font-semibold hover:bg-card cursor-pointer"
          >
            <Camera className="size-3.5 mr-1.5" />
            Trocar logo
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/20 p-6 text-center transition-colors hover:bg-muted/40">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="group relative flex h-24 w-24 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 text-primary transition-all hover:border-primary hover:bg-primary/10 focus:outline-none focus:ring-4 focus:ring-primary/20 cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
              <ImagePlus className="size-5" />
            </div>
            <span className="text-[11px] font-semibold">Adicionar</span>
          </button>
          <div>
            <p className="text-xs font-medium text-foreground">
              Selecione o logo da sua empresa
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              PNG, JPG ou WEBP • Máx. 5MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

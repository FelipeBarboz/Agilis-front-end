import type { ChangeEvent, RefObject } from "react";
import { Camera, ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceMainPhotoProps {
  inputRef: RefObject<HTMLInputElement | null>;
  preview: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export function ServiceMainPhoto({
  inputRef,
  preview,
  onChange,
  onRemove,
}: ServiceMainPhotoProps) {
  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <UploadCloud className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Foto principal</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Essa imagem será a capa do serviço nas buscas e no catálogo
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-border bg-muted/20 p-6 text-center transition-colors hover:bg-muted/40">
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={onChange}
          className="hidden"
          id="main-photo-input"
        />

        {preview ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <img
                src={preview}
                alt="Foto principal do serviço"
                className="h-36 w-36 rounded-2xl object-cover border-2 border-border shadow-md"
              />
              <button
                type="button"
                onClick={onRemove}
                className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-destructive text-white shadow-sm transition-transform hover:scale-110 cursor-pointer"
                title="Remover foto"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              className="rounded-xl border-border text-xs font-semibold hover:bg-card cursor-pointer mt-1"
            >
              <Camera className="size-3.5 mr-1.5" />
              Trocar foto
            </Button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="group relative flex h-36 w-36 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 text-primary transition-all hover:border-primary hover:bg-primary/10 focus:outline-none focus:ring-4 focus:ring-primary/20 cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
                <ImagePlus className="size-6" />
              </div>
              <span className="text-xs font-semibold">Adicionar foto</span>
            </button>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Clique para selecionar uma imagem
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                PNG, JPG ou WEBP • Máx. 5MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

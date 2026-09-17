import type { ChangeEvent, RefObject } from "react";
import { ImagePlus, X } from "lucide-react";

interface EnterpriseGalleryFieldProps {
  photos: string[];
  maxPhotos: number;
  inputRef: RefObject<HTMLInputElement | null>;
  onAddPhotos: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (index: number) => void;
}

export function EnterpriseGalleryField({
  photos,
  maxPhotos,
  inputRef,
  onAddPhotos,
  onRemovePhoto,
}: EnterpriseGalleryFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-foreground">Fotos da empresa</p>
        <span className="text-[11px] text-muted-foreground">
          {photos.length}/{maxPhotos} fotos
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        multiple
        onChange={onAddPhotos}
        className="hidden"
        id="photos-input"
      />

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
        {photos.map((url, idx) => (
          <div key={idx} className="relative group aspect-square">
            <img
              src={url}
              alt={`Foto ${idx + 1}`}
              className="h-full w-full rounded-xl object-cover border border-border shadow-xs"
            />
            <button
              type="button"
              onClick={() => onRemovePhoto(idx)}
              className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-white shadow-sm transition-transform hover:scale-110 cursor-pointer"
              title="Remover foto"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}

        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border bg-muted/20 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20 cursor-pointer"
          >
            <ImagePlus className="size-5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-semibold">Adicionar</span>
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Fotos de trabalhos realizados, equipe ou instalações (até {maxPhotos} fotos)
      </p>
    </div>
  );
}

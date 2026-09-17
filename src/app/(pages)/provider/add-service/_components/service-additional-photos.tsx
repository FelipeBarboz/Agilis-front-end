import type { ChangeEvent, RefObject } from "react";
import { Camera, ImagePlus, Trash2 } from "lucide-react";

interface ServiceAdditionalPhotosProps {
  photos: string[];
  maxPhotos: number;
  inputRef: RefObject<HTMLInputElement | null>;
  onAddPhotos: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (index: number) => void;
}

export function ServiceAdditionalPhotos({
  photos,
  maxPhotos,
  inputRef,
  onAddPhotos,
  onRemovePhoto,
}: ServiceAdditionalPhotosProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Camera className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Fotos adicionais
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Mostre fotos de serviços já realizados ou detalhes do trabalho
          </p>
        </div>
      </div>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          multiple
          onChange={onAddPhotos}
          className="hidden"
          id="additional-photos-input"
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {photos.map((preview, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={preview}
                alt={`Foto adicional ${index + 1}`}
                className="h-full w-full rounded-2xl object-cover border border-border shadow-xs"
              />
              <button
                type="button"
                onClick={() => onRemovePhoto(index)}
                className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-destructive text-white shadow-sm transition-transform hover:scale-110 cursor-pointer"
                title="Remover foto"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}

          {photos.length < maxPhotos && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/20 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20 cursor-pointer"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <ImagePlus className="size-4" />
              </div>
              <span className="text-[11px] font-semibold">Adicionar foto</span>
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Até {maxPhotos} fotos • PNG, JPG ou WEBP (máx. 5MB cada)
        </p>
      </div>
    </div>
  );
}

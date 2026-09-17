import Image from "next/image";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface ServiceHeroProps {
  serviceName: string;
  category?: string;
  price: number;
  imageUrl?: string;
  imgError: boolean;
  onImgError: () => void;
}

export function ServiceHero({
  serviceName,
  category,
  price,
  imageUrl,
  imgError,
  onImgError,
}: ServiceHeroProps) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border/60 bg-muted/30 p-4 shadow-xs">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
        {imageUrl && !imgError ? (
          <Image
            src={imageUrl}
            alt={serviceName}
            width={80}
            height={80}
            className="h-full w-full object-cover"
            onError={onImgError}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-lg font-bold text-primary">
            {serviceName.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          {category && (
            <span className="mb-1 inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              {category}
            </span>
          )}
          <h3
            id="history-detail-modal-title"
            className="truncate text-base font-bold leading-snug text-foreground"
          >
            {serviceName}
          </h3>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-muted-foreground">Valor:</span>
          <span className="text-base font-extrabold text-foreground">
            {currencyFormatter.format(price)}
          </span>
        </div>
      </div>
    </div>
  );
}

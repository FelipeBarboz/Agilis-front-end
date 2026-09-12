interface ServiceCardProps {
  serviceName: string;
  counterpartName: string;
  counterpartRole: string;
  imageUrl?: string;
  totalPrice: string;
}

export function ServiceCard({
  serviceName,
  counterpartName,
  counterpartRole,
  imageUrl,
  totalPrice,
}: ServiceCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-4">
      {imageUrl && imageUrl.trim() !== "" ? (
        <img
          src={imageUrl}
          alt={serviceName}
          className="h-16 w-16 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
          {serviceName?.[0] ?? "S"}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-foreground">{serviceName}</h3>
        <p className="text-xs text-muted-foreground">
          {counterpartRole === "prestador" ? "Prestador: " : "Cliente: "}
          {counterpartName}
        </p>
        <p className="mt-1 text-xs font-semibold text-foreground">
          Valor pago: {totalPrice}
        </p>
      </div>
    </div>
  );
}

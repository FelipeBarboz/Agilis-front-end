import Image from "next/image";

interface CardProviderProps {
  providerName: string;
  providerAvatarUrl?: string;
  servicesCount: number;
}

export function CardProvider({
  providerName,
  providerAvatarUrl,
  servicesCount,
}: CardProviderProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {providerAvatarUrl && providerAvatarUrl.trim() !== "" ? (
        <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
          <Image
            src={providerAvatarUrl}
            alt={providerName}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {providerName.charAt(0)}
        </div>
      )}
      <span className="truncate font-medium text-foreground">{providerName}</span>
      <span className="text-muted-foreground">· {servicesCount} serviços</span>
    </div>
  );
}

import { Heart } from "lucide-react";

interface SectionHeaderProps {
  count: number;
}

export function SectionHeader({ count }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Heart className="h-6 w-6 fill-primary/20" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Meus Favoritos</h1>
            {count > 0 && (
              <span className="flex items-center rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {count} {count === 1 ? "serviço" : "serviços"}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Acesse e contrate rapidamente seus profissionais e serviços prediletos
          </p>
        </div>
      </div>
    </div>
  );
}
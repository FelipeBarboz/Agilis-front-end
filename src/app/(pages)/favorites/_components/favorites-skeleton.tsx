import { Card } from "@/components/ui/card";

export function FavoritesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
        >
          <div>
            {/* Imagem skeleton */}
            <div className="h-48 w-full bg-muted animate-pulse" />

            {/* Conteúdo skeleton */}
            <div className="flex flex-col gap-3 p-4">
              {/* Título e Avaliação */}
              <div className="flex items-start justify-between gap-2">
                <div className="h-5 w-3/4 rounded-md bg-muted animate-pulse" />
                <div className="h-4 w-12 rounded-md bg-muted animate-pulse" />
              </div>

              {/* Provedor */}
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-muted animate-pulse" />
                <div className="h-3.5 w-32 rounded-md bg-muted animate-pulse" />
              </div>

              {/* Disponibilidade */}
              <div className="h-3.5 w-40 rounded-md bg-muted animate-pulse" />
            </div>
          </div>

          {/* Rodapé skeleton */}
          <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 p-4 pt-3">
            <div className="flex flex-col gap-1">
              <div className="h-2.5 w-14 rounded bg-muted animate-pulse" />
              <div className="h-5 w-20 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-8 w-24 rounded-xl bg-muted animate-pulse" />
          </div>
        </Card>
      ))}
    </div>
  );
}

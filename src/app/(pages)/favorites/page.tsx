"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, RefreshCw, X } from "lucide-react";
import { SectionHeader } from "./_components/section-header";
import { EmptyFavorites } from "./_components/empty-favorites";
import { FavoritesList } from "./_components/favorites-list";
import { FavoritesSkeleton } from "./_components/favorites-skeleton";
import { PageTransition } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { useFavorites } from "./_hooks/use-favorites";

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites, isLoading, error, clearError, refetch, onToggleFavorite } = useFavorites();

  return (
    <main className="relative flex flex-1 flex-col bg-muted p-4 pt-14 sm:p-6 sm:pt-14 lg:p-8 lg:pt-8">
      {/* Seta de voltar */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="mx-auto w-full max-w-6xl space-y-6">
        <SectionHeader count={favorites.length} />

        {error && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                className="w-fit cursor-pointer gap-1.5 border-destructive/30 bg-background text-destructive hover:bg-destructive/10"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Tentar novamente
              </Button>
              <button
                type="button"
                onClick={clearError}
                aria-label="Fechar mensagem de erro"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-destructive/70 transition-colors hover:bg-destructive/20 hover:text-destructive cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <PageTransition className="flex flex-1 flex-col">
          {isLoading ? (
            <FavoritesSkeleton />
          ) : favorites.length === 0 ? (
            <EmptyFavorites />
          ) : (
            <FavoritesList
              services={favorites}
              onToggleFavorite={onToggleFavorite}
            />
          )}
        </PageTransition>
      </div>
    </main>
  );
}

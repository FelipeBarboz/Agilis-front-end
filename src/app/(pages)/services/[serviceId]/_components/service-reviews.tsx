"use client";

import { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  Send,
  CheckCircle2,
  ShieldCheck,
  ThumbsUp,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchReviewsByReviewedId,
  createReview,
  normalizeReviewToUi,
  type UiReview,
} from "@/lib/services/reviews-service";
import { getCurrentUserProfile } from "@/lib/auth/auth-service";

interface ServiceReviewsProps {
  serviceId: string;
  storeId?: string;
  initialRating: number;
  reviewCount: number;
}

export function ServiceReviews({
  serviceId,
  initialRating,
  reviewCount,
}: ServiceReviewsProps) {
  const [reviews, setReviews] = useState<UiReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  // Busca avaliações reais na API: GET /api/v1/reviews/reviewed/{reviewedId}
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    fetchReviewsByReviewedId(serviceId)
      .then((dtos) => {
        if (!isCancelled) {
          if (Array.isArray(dtos) && dtos.length > 0) {
            const mapped = dtos.map((dto) => normalizeReviewToUi(dto, authorName));
            setReviews(mapped);
          } else {
            setReviews([]);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setReviews([]);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [serviceId, authorName]);

  function toggleLike(reviewId: string) {
    setLikedReviews((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
  }

  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const displayName = authorName.trim() || "Você";

    try {
      const created = await createReview({
        reviewedId: serviceId,
        rating: userRating,
        comment: commentText.trim(),
        reviewerName: displayName,
      });

      const newUiReview = normalizeReviewToUi(created, displayName);
      setReviews((prev) => [newUiReview, ...prev]);
      setCommentText("");
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setShowForm(false);
      }, 2000);
    } catch (err) {
      console.warn("[Reviews] Erro ao enviar review:", err);
      setErrorMessage("Não foi possível enviar a avaliação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Cálculo de médias e distribuição dinâmicas
  const totalReviewsCount = reviews.length;
  const effectiveAverageRating =
    totalReviewsCount > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount
      : initialRating;

  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.max(1, Math.min(5, Math.round(r.rating)));
    starCounts[star] = (starCounts[star] ?? 0) + 1;
  });

  const getPercent = (count: number) =>
    totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;

  const totalReviewsDisplay = Math.max(reviewCount, totalReviewsCount);

  return (
    <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 sm:p-8 shadow-xs ring-1 ring-foreground/10">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquare className="size-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Avaliações e Comentários
            </h2>
            <p className="text-xs text-muted-foreground">
              Opiniões reais de clientes que já contrataram este serviço
            </p>
          </div>
        </div>
      </div>

      {/* Resumo de Notas em Formato Horizontal */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center rounded-xl bg-muted/30 p-5 border border-border/60">
        <div className="md:col-span-4 flex flex-col items-center justify-center md:border-r md:border-border/60 md:pr-6 text-center">
          <span className="text-4xl font-extrabold text-foreground tracking-tight">
            {effectiveAverageRating.toFixed(1)}
          </span>
          <div className="flex items-center gap-1 mt-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`size-4 ${
                  star <= Math.round(effectiveAverageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground mt-1.5 font-medium">
            Baseado em {totalReviewsDisplay} avaliações
          </span>
        </div>

        {/* Distribuição dinâmica de estrelas (5 a 1) */}
        <div className="md:col-span-8 flex flex-col gap-2 text-xs text-muted-foreground">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = starCounts[stars] ?? 0;
            const pct = getPercent(count);
            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="w-16 font-medium shrink-0">
                  {stars} {stars === 1 ? "estrela" : "estrelas"}
                </span>
                <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right font-medium">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formulário Interativo de Avaliação (POST /api/v1/reviews) */}
      {showForm && (
        <form
          onSubmit={handleAddReview}
          className="flex flex-col gap-4 rounded-xl border border-primary/30 bg-primary/5 p-5 sm:p-6 transition-all"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-foreground">Escreva sua avaliação</span>
            <span className="text-xs text-muted-foreground">
              Compartilhe como foi a qualidade, pontualidade e o atendimento deste profissional
            </span>
          </div>

          {/* Seleção de Estrelas */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground mr-1">Sua nota:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setUserRating(star)}
                className="p-1 cursor-pointer transition-transform hover:scale-125"
              >
                <Star
                  className={`size-6 ${
                    star <= (hoverRating || userRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-foreground ml-2">
              {hoverRating || userRating} / 5 estrelas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Seu nome"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="h-10 rounded-xl border border-border bg-card px-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>

          <textarea
            rows={3}
            required
            placeholder="Descreva detalhes sobre o atendimento, pontualidade e resultado do serviço..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
          />

          <div className="flex items-center justify-between pt-1">
            {isSubmitted ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4" />
                Avaliação enviada com sucesso!
              </span>
            ) : (
              <span />
            )}

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || isSubmitted || !commentText.trim()}
              className="gap-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 cursor-pointer px-5"
            >
              <Send className="size-3.5" />
              {isSubmitting ? "Enviando..." : "Publicar Avaliação"}
            </Button>
          </div>
        </form>
      )}

      {/* Lista de Comentários */}
      <div className="flex flex-col divide-y divide-border/60">
        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-xs">Carregando avaliações...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Nenhuma avaliação registrada ainda. Seja o primeiro a avaliar!
          </div>
        ) : (
          reviews.map((rev) => {
            const isLiked = likedReviews[rev.id] ?? false;
            const currentLikes = rev.likes + (isLiked ? 1 : 0);

            return (
              <div key={rev.id} className="flex flex-col gap-3 py-5 first:pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar com Padrão Agilis */}
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#006b49] text-xs font-bold text-white shadow-2xs">
                      {rev.initials}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{rev.author}</span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="size-3" />
                            Cliente Verificado
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground">{rev.date}</span>
                    </div>
                  </div>

                  {/* Estrelas */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-3.5 ${
                          star <= rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-13">
                  {rev.comment}
                </p>

                {/* Botão de curtir comentário */}
                <div className="pl-13 flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <button
                    type="button"
                    onClick={() => toggleLike(rev.id)}
                    className={`inline-flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                      isLiked ? "text-primary font-bold" : "hover:text-foreground"
                    }`}
                  >
                    <ThumbsUp className={`size-3.5 ${isLiked ? "fill-primary text-primary" : ""}`} />
                    <span>Útil ({currentLikes})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Star, MessageSquare, Send, CheckCircle2, ShieldCheck, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  comment: string;
  likes?: number;
  verified?: boolean;
}

const initialReviews: Review[] = [
  {
    id: "rev-1",
    author: "Mariana Santos",
    initials: "MS",
    rating: 5,
    date: "Há 3 dias",
    comment: "Excelente serviço! O profissional chegou exatamente no horário marcado, foi muito educado e executou tudo com perfeição. O acabamento ficou impecável, recomendo demais!",
    likes: 6,
    verified: true,
  },
  {
    id: "rev-2",
    author: "Ricardo Oliveira",
    initials: "RO",
    rating: 5,
    date: "Há 1 semana",
    comment: "Muito satisfeito com o resultado. Atendimento ágil, tirou todas as minhas dúvidas antes de começar e cobrou um preço muito justo pela qualidade entregue.",
    likes: 3,
    verified: true,
  },
  {
    id: "rev-3",
    author: "Camila Souza",
    initials: "CS",
    rating: 4,
    date: "Há 2 semanas",
    comment: "Muito bom trabalho! Ficou tudo muito organizado e limpo após o término do serviço. Com certeza contratarei novamente quando precisar.",
    likes: 1,
    verified: true,
  },
];

interface ServiceReviewsProps {
  serviceId: string;
  initialRating: number;
  reviewCount: number;
}

export function ServiceReviews({ initialRating, reviewCount }: ServiceReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  function toggleLike(reviewId: string) {
    setLikedReviews((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
  }

  function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;

    const name = authorName.trim() || "Você";
    const initials = name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: name,
      initials,
      rating: userRating,
      date: "Agora mesmo",
      comment: commentText.trim(),
      likes: 0,
      verified: true,
    };

    setReviews([newRev, ...reviews]);
    setCommentText("");
    setAuthorName("");
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setShowForm(false);
    }, 2000);
  }

  const totalReviewsDisplay = reviewCount + (reviews.length - initialReviews.length);

  return (
    <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 sm:p-8 shadow-xs ring-1 ring-foreground/10">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
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

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary/20 hover:scale-105 active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <MessageSquare className="size-3.5" />
          {showForm ? "Fechar formulário" : "Avaliar este serviço"}
        </button>
      </div>

      {/* Resumo de Notas em Formato Horizontal */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center rounded-xl bg-muted/30 p-5 border border-border/60">
        <div className="md:col-span-4 flex flex-col items-center justify-center md:border-r md:border-border/60 md:pr-6 text-center">
          <span className="text-4xl font-extrabold text-foreground tracking-tight">
            {initialRating.toFixed(1)}
          </span>
          <div className="flex items-center gap-1 mt-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`size-4 ${
                  star <= Math.round(initialRating)
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

        <div className="md:col-span-8 flex flex-col gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="w-14 font-medium shrink-0">5 estrelas</span>
            <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full w-[88%]" />
            </div>
            <span className="w-8 text-right font-medium">88%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-14 font-medium shrink-0">4 estrelas</span>
            <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full w-[10%]" />
            </div>
            <span className="w-8 text-right font-medium">10%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-14 font-medium shrink-0">3 estrelas</span>
            <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full w-[2%]" />
            </div>
            <span className="w-8 text-right font-medium">2%</span>
          </div>
        </div>
      </div>

      {/* Formulário Interativo de Avaliação */}
      {showForm && (
        <form
          onSubmit={handleAddReview}
          className="flex flex-col gap-4 rounded-xl border border-primary/30 bg-primary/5 p-5 sm:p-6 transition-all"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-foreground">Escreva sua avaliação</span>
            <span className="text-xs text-muted-foreground">
              Compartilhe como foi a qualidade, pontualidade e o atendimento do profissional
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
              placeholder="Seu nome (opcional)"
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
              disabled={isSubmitted}
              className="gap-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 cursor-pointer px-5"
            >
              <Send className="size-3.5" />
              Publicar Avaliação
            </Button>
          </div>
        </form>
      )}

      {/* Lista de Comentários */}
      <div className="flex flex-col divide-y divide-border/60">
        {reviews.map((rev) => {
          const isLiked = likedReviews[rev.id] ?? false;
          const currentLikes = (rev.likes ?? 0) + (isLiked ? 1 : 0);

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
        })}
      </div>
    </div>
  );
}


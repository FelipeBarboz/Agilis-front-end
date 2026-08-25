"use client";

import { useState } from "react";
import { Star, MessageSquare, Send, CheckCircle2, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  comment: string;
}

const initialReviews: Review[] = [
  {
    id: "rev-1",
    author: "Mariana Santos",
    initials: "MS",
    rating: 5,
    date: "Há 3 dias",
    comment: "Excelente serviço! O profissional chegou exatamente no horário marcado, foi muito educado e executou tudo com perfeição. Recomendo demais!",
  },
  {
    id: "rev-2",
    author: "Ricardo Oliveira",
    initials: "RO",
    rating: 5,
    date: "Há 1 semana",
    comment: "Muito satisfeito com o resultado. Atendimento ágil e preço justo pelo nível do trabalho entregue.",
  },
  {
    id: "rev-3",
    author: "Camila Souza",
    initials: "CS",
    rating: 4,
    date: "Há 2 semanas",
    comment: "Muito bom trabalho! Ficou tudo organizado e limpo após o término do serviço.",
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

  return (
    <div className="flex flex-col gap-6 rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Avaliações e Comentários</h2>
          <p className="text-xs text-muted-foreground">Veja o que outros clientes disseram sobre este serviço</p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/20 cursor-pointer"
        >
          <MessageSquare className="size-3.5" />
          {showForm ? "Fechar avaliação" : "Avaliar este serviço"}
        </button>
      </div>

      {/* Resumo de Notas */}
      <div className="flex items-center gap-6 rounded-2xl bg-muted/30 p-4 border border-border/50">
        <div className="flex flex-col items-center justify-center border-r border-border/60 pr-6">
          <span className="text-3xl font-extrabold text-foreground">{initialRating.toFixed(1)}</span>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`size-3.5 ${
                  star <= Math.round(initialRating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground mt-1">
            {reviewCount + (reviews.length - initialReviews.length)} avaliações
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-12 font-medium">5 estrelas</span>
            <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full w-[85%]" />
            </div>
            <span className="w-8 text-right font-medium">85%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12 font-medium">4 estrelas</span>
            <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full w-[12%]" />
            </div>
            <span className="w-8 text-right font-medium">12%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12 font-medium">3 estrelas</span>
            <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full w-[3%]" />
            </div>
            <span className="w-8 text-right font-medium">3%</span>
          </div>
        </div>
      </div>

      {/* Formulário Interativo de Avaliação */}
      {showForm && (
        <form onSubmit={handleAddReview} className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-foreground">Sua Avaliação</span>
            <span className="text-xs text-muted-foreground">Diga aos outros clientes como foi sua experiência</span>
          </div>

          {/* Seleção de Estrelas */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-foreground mr-2">Nota:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setUserRating(star)}
                className="p-1 cursor-pointer transition-transform hover:scale-110"
              >
                <Star
                  className={`size-6 ${
                    star <= (hoverRating || userRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted-foreground/40"
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-foreground ml-2">
              {hoverRating || userRating} / 5
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Seu nome (opcional)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="h-10 rounded-xl border border-border bg-white px-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <textarea
            rows={3}
            required
            placeholder="Conte detalhes sobre o atendimento, pontualidade e qualidade do serviço..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="rounded-xl border border-border bg-white p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between">
            {isSubmitted ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="size-4" />
                Avaliação publicada com sucesso!
              </span>
            ) : <span />}

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitted}
              className="gap-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 cursor-pointer px-5"
            >
              <Send className="size-3.5" />
              Publicar
            </Button>
          </div>
        </form>
      )}

      {/* Lista de Comentários */}
      <div className="flex flex-col divide-y border-t">
        {reviews.map((rev) => (
          <div key={rev.id} className="flex flex-col gap-2 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#006b49] text-xs font-bold text-white">
                  {rev.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">{rev.author}</span>
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

            <p className="text-xs text-muted-foreground leading-relaxed pl-12">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

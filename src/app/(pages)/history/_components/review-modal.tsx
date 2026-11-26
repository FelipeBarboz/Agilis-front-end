"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type HistoryEntry } from "../../../../types/history";
import { getBookingById } from "@/lib/services/bookings-service";
import {
  createReview,
  fetchReviewByBookingId,
  type ReviewDTO,
} from "@/lib/services/reviews-service";
import { getCurrentUserProfile } from "@/lib/auth/auth-service";
import { cn } from "@/lib/utils";

const RATING_LABELS: Record<number, string> = {
  1: "Péssimo",
  2: "Ruim",
  3: "Regular",
  4: "Bom",
  5: "Excelente",
};

interface ReviewModalProps {
  open: boolean;
  entry: HistoryEntry | null;
  onClose: () => void;
  onReviewSubmitted?: (bookingId: string, review: ReviewDTO) => void;
}

export function ReviewModal({
  open,
  entry,
  onClose,
  onReviewSubmitted,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState("");
  const [comment, setComment] = useState("");
  const [resolvedServiceId, setResolvedServiceId] = useState<string>("");
  const [existingReview, setExistingReview] = useState<ReviewDTO | null>(null);

  const [isInitializing, setIsInitializing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !entry?.id) return;

    let isCancelled = false;
    setIsInitializing(true);
    setErrorMessage(null);
    setIsSubmitted(false);
    setExistingReview(null);
    setRating(5);
    setHoverRating(0);
    setComment("");
    setResolvedServiceId(entry.serviceId ?? "");

    async function initModal() {
      if (!entry) return;

      const [existing, booking, profile] = await Promise.all([
        fetchReviewByBookingId(entry.id),
        entry.serviceId ? Promise.resolve(null) : getBookingById(entry.id).catch(() => null),
        getCurrentUserProfile().catch(() => null),
      ]);

      if (isCancelled) return;

      if (existing) {
        setExistingReview(existing);
      }

      if (booking?.serviceId) {
        setResolvedServiceId(booking.serviceId);
      }

      if (profile?.name) {
        setReviewerName(profile.name);
      }

      setIsInitializing(false);
    }

    void initModal();

    return () => {
      isCancelled = true;
    };
  }, [open, entry]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!entry) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!entry) return;

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      setErrorMessage("Escreva um comentário sobre a sua experiência.");
      return;
    }

    if (!resolvedServiceId) {
      setErrorMessage(
        "Não foi possível identificar o serviço deste agendamento para enviar a avaliação."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const created = await createReview({
        bookingId: entry.id,
        reviewedId: resolvedServiceId,
        rating,
        comment: trimmedComment,
        reviewerName: reviewerName.trim() || undefined,
      });

      setIsSubmitted(true);
      setExistingReview(created);
      onReviewSubmitted?.(entry.id, created);
    } catch (err) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : "Não foi possível enviar a avaliação. Tente novamente.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  const activeRating = hoverRating || rating;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2
                  id="review-modal-title"
                  className="text-base font-bold text-foreground"
                >
                  Avaliar Serviço
                </h2>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {entry.serviceName} • {entry.counterpartName}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar modal de avaliação"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {isInitializing ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Loader2 className="h-7 w-7 animate-spin text-primary mb-3" />
                  <p className="text-sm font-medium text-foreground">
                    Verificando agendamento...
                  </p>
                </div>
              ) : isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Avaliação enviada com sucesso!
                  </h3>
                  <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                    Obrigado por compartilhar sua opinião. Ela ajuda outros clientes e o prestador.
                  </p>
                  <Button
                    type="button"
                    onClick={onClose}
                    className="mt-5 rounded-xl cursor-pointer"
                  >
                    Concluir
                  </Button>
                </div>
              ) : existingReview ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Este agendamento já foi avaliado por você.</span>
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-4 w-4",
                            star <= existingReview.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                      <span className="ml-2 text-xs font-semibold text-foreground">
                        {RATING_LABELS[existingReview.rating] ?? `${existingReview.rating}/5`}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {existingReview.comment}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="rounded-xl cursor-pointer"
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Seletor de estrelas */}
                  <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-muted/20 p-4">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Qual nota você dá para este atendimento?
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          aria-label={`Avaliar com ${star} ${star === 1 ? "estrela" : "estrelas"}`}
                          className="rounded-lg p-1 transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star
                            className={cn(
                              "h-7 w-7 transition-colors",
                              star <= activeRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-primary">
                      {RATING_LABELS[activeRating] ?? `${activeRating} estrelas`}
                    </span>
                  </div>

                  {/* Nome */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="review-author-name"
                      className="text-xs font-semibold text-foreground"
                    >
                      Seu nome
                    </label>
                    <input
                      id="review-author-name"
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="Como deseja aparecer na avaliação"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Comentário */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="review-comment"
                      className="text-xs font-semibold text-foreground"
                    >
                      Comentário *
                    </label>
                    <textarea
                      id="review-comment"
                      rows={4}
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Conte como foi a pontualidade, qualidade e atendimento..."
                      className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  {errorMessage && (
                    <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="rounded-xl cursor-pointer"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !comment.trim()}
                      className="gap-1.5 rounded-xl cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Enviar Avaliação
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

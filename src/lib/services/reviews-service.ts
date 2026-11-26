import { api } from "@/lib/api";
import { getCurrentUserProfile } from "@/lib/auth/auth-service";

export interface ReviewDTO {
  reviewId: string;
  bookingId: string;
  reviewerId: string;
  reviewedId: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewerName?: string;
}

export interface CreateReviewDTO {
  bookingId?: string;
  reviewerId?: string;
  reviewedId: string;
  rating: number;
  comment: string;
  reviewerName?: string;
}

export interface UiReview {
  id: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
  verified: boolean;
}

function formatRelativeDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "Recentemente";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Agora mesmo";
    if (diffHours < 24) return `Há ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `Há ${diffDays} dias`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Há ${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
    }

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return "Recentemente";
  }
}

export function normalizeReviewToUi(dto: ReviewDTO, currentUserName?: string): UiReview {
  const authorName = dto.reviewerName?.trim();
  const author =
    authorName && authorName.length > 0
      ? authorName
      : (currentUserName ?? `Cliente ${dto.reviewerId ? dto.reviewerId.slice(0, 4) : "Agilis"}`);

  const initials = author
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "CA";

  return {
    id: dto.reviewId || `rev-${Date.now()}-${Math.random()}`,
    author,
    initials,
    rating: typeof dto.rating === "number" ? Math.max(1, Math.min(5, dto.rating)) : 5,
    date: formatRelativeDate(dto.createdAt),
    comment: dto.comment,
    likes: 0,
    verified: Boolean(dto.bookingId),
  };
}

/**
 * Busca todas as avaliações de um serviço ou prestador:
 * GET /api/v1/reviews/reviewed/{reviewedId}
 */
export async function fetchReviewsByReviewedId(reviewedId: string): Promise<ReviewDTO[]> {
  try {
    const res = await api<ReviewDTO[]>(`/api/v1/reviews/reviewed/${reviewedId}`);
    if (Array.isArray(res)) {
      return res;
    }
    return [];
  } catch (err) {
    console.warn(`[Reviews] Falha ao consultar /api/v1/reviews/reviewed/${reviewedId}:`, err);
    return [];
  }
}

/**
 * Busca a avaliação de um agendamento específico:
 * GET /api/v1/reviews/booking/{bookingId}
 */
export async function fetchReviewByBookingId(bookingId: string): Promise<ReviewDTO | null> {
  try {
    const res = await api<ReviewDTO>(`/api/v1/reviews/booking/${bookingId}`);
    if (res?.reviewId) {
      return res;
    }
    return null;
  } catch (err) {
    console.warn(`[Reviews] Falha ao consultar /api/v1/reviews/booking/${bookingId}:`, err);
    return null;
  }
}

/**
 * Envia uma nova avaliação:
 * POST /api/v1/reviews
 */
export async function createReview(payload: CreateReviewDTO): Promise<ReviewDTO> {
  let reviewerId = payload.reviewerId;
  let reviewerName: string | undefined = payload.reviewerName;

  if (!reviewerId) {
    try {
      const user = await getCurrentUserProfile();
      if (user?.id) {
        reviewerId = user.id;
        reviewerName = reviewerName ?? user.name;
      }
    } catch {
      // Ignora erro de usuário anônimo
    }
  }

  const effectiveReviewerId = reviewerId ?? `client-${Date.now()}`;
  const effectiveBookingId = payload.bookingId ?? `booking-${Date.now()}`;

  const body = {
    bookingId: effectiveBookingId,
    reviewerId: effectiveReviewerId,
    reviewedId: payload.reviewedId,
    rating: payload.rating,
    comment: payload.comment,
  };

  const res = await api<ReviewDTO>("/api/v1/reviews", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res?.reviewId) {
    throw new Error("O servidor não retornou a avaliação criada.");
  }

  return {
    ...res,
    reviewerName,
  };
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { HistoryEntry } from "../../../../types/history";
import { getBookingDetail, type BookingDetailResponse } from "@/lib/services/bookings-service";

import { ModalHeader } from "./modal-header";
import { ModalSkeleton } from "./modal-skeleton";
import { ModalFooterActions } from "./modal-footer-actions";
import { ServiceHero } from "./service-hero";
import { CancellationBanner } from "./cancellation-banner";
import { SchedulingInfo } from "./scheduling-info";
import { PaymentSummary } from "./payment-summary";
import { NotesSection } from "./notes-section";

const fullDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

interface HistoryDetailModalProps {
  entry: HistoryEntry | null;
  open: boolean;
  onClose: () => void;
}

export function HistoryDetailModal({ entry, open, onClose }: HistoryDetailModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [detail, setDetail] = useState<BookingDetailResponse | null>(null);

  useEffect(() => {
    let isCancelled = false;
    if (open && entry?.id) {
      setIsLoading(true);
      setImgError(false);
      setDetail(null);

      getBookingDetail(entry.id)
        .then((data) => {
          if (!isCancelled && data) {
            setDetail(data);
          }
        })
        .catch((err) => {
          console.warn("[HistoryDetailModal] Usando dados do histórico:", err);
        })
        .finally(() => {
          if (!isCancelled) setIsLoading(false);
        });
    }
    return () => {
      isCancelled = true;
    };
  }, [open, entry?.id]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!entry) return null;

  const dateObj = new Date(detail?.date ?? entry.date);
  const formattedDate = fullDateFormatter.format(dateObj);
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const bookingFee = detail?.serviceFee ?? entry.bookingFee ?? 5;
  const effectivePrice = detail?.price ?? entry.price;
  const effectiveAddress = detail?.address ?? entry.address;
  const effectiveTime = detail?.time ? detail.time.slice(0, 5) : entry.time;
  const effectiveNotes = detail?.notes ?? entry.notes;

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
            className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-detail-modal-title"
          >
            <ModalHeader status={entry.status} onClose={onClose} />

            {isLoading ? (
              <ModalSkeleton />
            ) : (
              <>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto space-y-5 p-6">
                  <ServiceHero
                    serviceName={detail?.serviceTitle ?? entry.serviceName}
                    category={detail?.category ?? entry.category}
                    price={effectivePrice}
                    imageUrl={detail?.thumbnailUrl ?? entry.imageUrl}
                    imgError={imgError}
                    onImgError={() => setImgError(true)}
                  />

                  {entry.status === "cancelado" && entry.cancellationReason && (
                    <CancellationBanner reason={entry.cancellationReason} />
                  )}

                  <SchedulingInfo
                    formattedDate={capitalizedDate}
                    time={effectiveTime}
                    duration={detail?.durationMinutes ? `${detail.durationMinutes} min` : entry.duration}
                    address={effectiveAddress}
                  />

                  <PaymentSummary
                    price={effectivePrice}
                    bookingFee={bookingFee}
                    paymentMethod={detail?.paymentMethod ?? entry.paymentMethod}
                  />

                  {effectiveNotes && <NotesSection notes={effectiveNotes} />}
                </div>

                <ModalFooterActions status={entry.status} entryId={entry.id} />
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

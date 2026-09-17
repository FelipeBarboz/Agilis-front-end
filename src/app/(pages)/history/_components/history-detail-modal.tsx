"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { HistoryEntry } from "../../../../types/history";

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

  useEffect(() => {
    if (open && entry) {
      setIsLoading(true);
      setImgError(false);
      const timer = setTimeout(() => setIsLoading(false), 450);
      return () => clearTimeout(timer);
    }
  }, [open, entry?.id]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!entry) return null;

  const dateObj = new Date(entry.date);
  const formattedDate = fullDateFormatter.format(dateObj);
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const bookingFee = entry.bookingFee ?? 0;

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
                    serviceName={entry.serviceName}
                    category={entry.category}
                    price={entry.price}
                    imageUrl={entry.imageUrl}
                    imgError={imgError}
                    onImgError={() => setImgError(true)}
                  />

                  {entry.status === "cancelado" && entry.cancellationReason && (
                    <CancellationBanner reason={entry.cancellationReason} />
                  )}

                  <SchedulingInfo
                    formattedDate={capitalizedDate}
                    time={entry.time}
                    duration={entry.duration}
                    address={entry.address}
                  />

                  <PaymentSummary
                    price={entry.price}
                    bookingFee={bookingFee}
                    paymentMethod={entry.paymentMethod}
                  />

                  {entry.notes && <NotesSection notes={entry.notes} />}
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

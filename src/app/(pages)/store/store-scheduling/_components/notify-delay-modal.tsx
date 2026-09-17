"use client";

import type { StoreAppointment } from "./store-appointment-card";
import { useNotifyDelay } from "./notify-delay/use-notify-delay";
import { NotifyDelayHeader } from "./notify-delay/notify-delay-header";
import { NotifyDelaySuccess } from "./notify-delay/notify-delay-success";
import { NotifyDelayForm } from "./notify-delay/notify-delay-form";

export interface NotifyDelayModalProps {
  open: boolean;
  onClose: () => void;
  dayAppointments: StoreAppointment[];
  allAppointments: StoreAppointment[];
  selectedDate: string;
  initialAppointmentId?: string | null;
  onSuccessNotification?: (count: number) => void;
}

export function NotifyDelayModal(props: NotifyDelayModalProps) {
  const { open, onClose } = props;
  const state = useNotifyDelay(props);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <NotifyDelayHeader onClose={onClose} />

        {state.isSuccess ? (
          <NotifyDelaySuccess targetedCount={state.targetedCount} />
        ) : (
          <NotifyDelayForm state={state} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

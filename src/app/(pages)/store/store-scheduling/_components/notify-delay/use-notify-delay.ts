"use client";

import { useState, useEffect } from "react";
import type { StoreAppointment } from "../store-appointment-card";
import { DELAY_REASONS, addMinutesToTime } from "./notify-delay-constants";

export interface UseNotifyDelayProps {
  open: boolean;
  onClose: () => void;
  dayAppointments: StoreAppointment[];
  allAppointments: StoreAppointment[];
  selectedDate: string;
  initialAppointmentId?: string | null;
  onSuccessNotification?: (count: number) => void;
}

export function useNotifyDelay({
  open,
  onClose,
  dayAppointments,
  allAppointments,
  selectedDate,
  initialAppointmentId,
  onSuccessNotification,
}: UseNotifyDelayProps) {
  // Lista de agendamentos válidos
  const validDayAppts = dayAppointments.filter((a) => a.status !== "cancelled");
  const validAllAppts = allAppointments.filter((a) => a.status !== "cancelled");

  const [appointmentScope, setAppointmentScope] = useState<"day" | "all">(
    validDayAppts.length > 0 ? "day" : "all"
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedDelayMinutes, setSelectedDelayMinutes] = useState<number>(60);
  const [customMinutes, setCustomMinutes] = useState<string>("");
  const [isCustomDelay, setIsCustomDelay] = useState(false);

  const [suggestedDate, setSuggestedDate] = useState<string>(selectedDate);
  const [suggestedTime, setSuggestedTime] = useState<string>("11:00");
  const [reason, setReason] = useState<string>(DELAY_REASONS[0] ?? "");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Lista visível de acordo com a aba selecionada
  const currentApptList =
    appointmentScope === "day" && validDayAppts.length > 0
      ? validDayAppts
      : validAllAppts;

  // Inicializa quando o modal abre
  useEffect(() => {
    if (open) {
      setIsSuccess(false);
      setIsSending(false);
      setSuggestedDate(selectedDate);

      const targetList = validDayAppts.length > 0 ? validDayAppts : validAllAppts;

      if (initialAppointmentId) {
        setSelectedIds([initialAppointmentId]);
        const target = validAllAppts.find((a) => a.id === initialAppointmentId);
        if (target) {
          setSuggestedTime(addMinutesToTime(target.time, 60));
          setSuggestedDate(target.date);
        }
      } else {
        setSelectedIds(targetList.map((a) => a.id));
        if (targetList[0]) {
          setSuggestedTime(addMinutesToTime(targetList[0].time, 60));
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialAppointmentId]);

  function handleSelectPreset(minutes: number) {
    setIsCustomDelay(false);
    setSelectedDelayMinutes(minutes);

    // Ajusta a data se for próximo dia
    if (minutes === 1440) {
      const d = new Date(suggestedDate || selectedDate);
      d.setDate(d.getDate() + 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dayStr = String(d.getDate()).padStart(2, "0");
      setSuggestedDate(`${y}-${m}-${dayStr}`);
    } else {
      setSuggestedDate(selectedDate);
    }

    const firstAppt = currentApptList.find((a) => selectedIds.includes(a.id)) ?? currentApptList[0];
    if (firstAppt) {
      setSuggestedTime(addMinutesToTime(firstAppt.time, minutes === 1440 ? 0 : minutes));
    }
  }

  function handleApplyCustomMinutes(val: string) {
    setCustomMinutes(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setSelectedDelayMinutes(num);
      const firstAppt = currentApptList.find((a) => selectedIds.includes(a.id)) ?? currentApptList[0];
      if (firstAppt) {
        setSuggestedTime(addMinutesToTime(firstAppt.time, num));
      }
    }
  }

  function toggleId(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleScopeChange(scope: "day" | "all") {
    setAppointmentScope(scope);
    const list = scope === "day" ? validDayAppts : validAllAppts;
    setSelectedIds(list.map((a) => a.id));
  }

  function selectAll() {
    setSelectedIds(currentApptList.map((a) => a.id));
  }

  function deselectAll() {
    setSelectedIds([]);
  }

  function toggleCustomDelay() {
    setIsCustomDelay((prev) => !prev);
  }

  const targetedCount = selectedIds.length;

  function handleSend() {
    if (targetedCount === 0) return;
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      onSuccessNotification?.(targetedCount);

      setTimeout(() => {
        onClose();
      }, 1400);
    }, 700);
  }

  return {
    appointmentScope,
    handleScopeChange,
    dayCount: validDayAppts.length,
    allCount: validAllAppts.length,
    currentApptList,
    selectedIds,
    toggleId,
    selectAll,
    deselectAll,
    selectedDelayMinutes,
    isCustomDelay,
    customMinutes,
    handleSelectPreset,
    toggleCustomDelay,
    handleApplyCustomMinutes,
    suggestedDate,
    setSuggestedDate,
    suggestedTime,
    setSuggestedTime,
    reason,
    setReason,
    customMessage,
    setCustomMessage,
    targetedCount,
    isSending,
    isSuccess,
    handleSend,
  };
}

export type NotifyDelayState = ReturnType<typeof useNotifyDelay>;

"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_HISTORY } from "../../../../lib/mocks/history";
import { RescheduleServiceCard } from "./reschedule-service-card";
import { RescheduleDateTimePicker } from "./reschedule-datetime-picker";
import { RescheduleReasonField } from "./reschedule-reason-field";
import { ReschedulePolicyNotice } from "./reschedule-policy-notice";
import { RescheduleActions } from "./reschedule-actions";
import { RescheduleSuccess } from "./reschedule-success";

export function RescheduleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const entry = MOCK_HISTORY.find((item) => item.id === id) ?? MOCK_HISTORY[1];

  const [selectedDate, setSelectedDate] = useState<Date>(
    () => new Date(Date.now() + 86400000)
  );
  const [selectedTime, setSelectedTime] = useState<string>("14:00");
  const [reason, setReason] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  }

  if (isSuccess && entry) {
    return (
      <RescheduleSuccess
        entry={entry}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onBack={() => router.push("/history")}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      {entry && <RescheduleServiceCard entry={entry} />}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-background p-6 shadow-sm space-y-6"
      >
        <RescheduleDateTimePicker
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          minDate={today}
        />

        <RescheduleReasonField value={reason} onChange={setReason} />

        <ReschedulePolicyNotice />

        <RescheduleActions isSubmitting={isSubmitting} />
      </form>
    </div>
  );
}

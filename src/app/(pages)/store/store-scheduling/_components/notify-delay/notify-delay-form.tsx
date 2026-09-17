"use client";

import { NotifyDelayRecipients } from "./notify-delay-recipients";
import { NotifyDelayDelayPicker } from "./notify-delay-delay-picker";
import { NotifyDelaySchedulePicker } from "./notify-delay-schedule-picker";
import { NotifyDelayReasonForm } from "./notify-delay-reason-form";
import { NotifyDelayFooter } from "./notify-delay-footer";
import type { NotifyDelayState } from "./use-notify-delay";

interface NotifyDelayFormProps {
  state: NotifyDelayState;
  onClose: () => void;
}

export function NotifyDelayForm({ state, onClose }: NotifyDelayFormProps) {
  return (
    <div className="space-y-5">
      <NotifyDelayRecipients
        appointmentScope={state.appointmentScope}
        onScopeChange={state.handleScopeChange}
        dayCount={state.dayCount}
        allCount={state.allCount}
        currentList={state.currentApptList}
        selectedIds={state.selectedIds}
        onToggleId={state.toggleId}
        onSelectAll={state.selectAll}
        onDeselectAll={state.deselectAll}
      />

      <NotifyDelayDelayPicker
        selectedDelayMinutes={state.selectedDelayMinutes}
        isCustomDelay={state.isCustomDelay}
        customMinutes={state.customMinutes}
        onSelectPreset={state.handleSelectPreset}
        onToggleCustomDelay={state.toggleCustomDelay}
        onCustomMinutesChange={state.handleApplyCustomMinutes}
      />

      <NotifyDelaySchedulePicker
        suggestedDate={state.suggestedDate}
        suggestedTime={state.suggestedTime}
        onDateChange={state.setSuggestedDate}
        onTimeChange={state.setSuggestedTime}
      />

      <NotifyDelayReasonForm
        reason={state.reason}
        onReasonChange={state.setReason}
        customMessage={state.customMessage}
        onCustomMessageChange={state.setCustomMessage}
        suggestedDate={state.suggestedDate}
        suggestedTime={state.suggestedTime}
      />

      <NotifyDelayFooter
        targetedCount={state.targetedCount}
        isSending={state.isSending}
        onClose={onClose}
        onSend={state.handleSend}
      />
    </div>
  );
}

interface RescheduleReasonFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function RescheduleReasonField({
  value,
  onChange,
}: RescheduleReasonFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="reschedule-reason"
        className="text-xs font-semibold text-foreground uppercase tracking-wider"
      >
        Motivo do Reagendamento (opcional)
      </label>
      <textarea
        id="reschedule-reason"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Informe se deseja adicionar alguma observação para o prestador..."
        className="w-full resize-none rounded-xl border border-input bg-background p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

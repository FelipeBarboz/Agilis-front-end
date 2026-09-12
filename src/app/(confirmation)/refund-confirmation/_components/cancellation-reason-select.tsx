const CANCELLATION_REASONS = [
  "Imprevisto de agenda / horário",
  "O prestador não respondeu ou não pôde comparecer",
  "Contratei o serviço por engano",
  "Encontrei outra solução",
  "Outro motivo",
];

interface CancellationReasonSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function CancellationReasonSelect({
  value,
  onChange,
}: CancellationReasonSelectProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="cancel-reason"
        className="text-xs font-bold uppercase tracking-wider text-foreground"
      >
        Qual o motivo do cancelamento?
      </label>
      <select
        id="cancel-reason"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-input bg-background p-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {CANCELLATION_REASONS.map((reason) => (
          <option key={reason} value={reason}>
            {reason}
          </option>
        ))}
      </select>
    </div>
  );
}

export { CANCELLATION_REASONS };

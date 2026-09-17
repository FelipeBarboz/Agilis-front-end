const CANCELLATION_REASONS = [
  "Imprevisto de agenda / horário",
  "O prestador não respondeu ou não pôde comparecer",
  "Contratei o serviço por engano",
  "Encontrei outra solução",
  "Outro motivo",
];

const COMPLETED_REFUND_REASONS = [
  "Serviço com defeito ou mal executado",
  "Prestador não compareceu ou descumpriu o combinado",
  "Serviço entregue incompleto",
  "Cobrança indevida ou valor divergente",
  "Danos materiais durante a execução",
  "Outro problema com o serviço prestado",
];

interface CancellationReasonSelectProps {
  value: string;
  onChange: (value: string) => void;
  isCompleted?: boolean;
}

export function CancellationReasonSelect({
  value,
  onChange,
  isCompleted = false,
}: CancellationReasonSelectProps) {
  const reasons = isCompleted ? COMPLETED_REFUND_REASONS : CANCELLATION_REASONS;

  return (
    <div className="space-y-2">
      <label
        htmlFor="cancel-reason"
        className="text-xs font-semibold uppercase tracking-wider text-foreground"
      >
        {isCompleted
          ? "Qual o problema ocorrido com o serviço?"
          : "Qual o motivo do cancelamento?"}
      </label>
      <select
        id="cancel-reason"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-input bg-background p-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-colors"
      >
        {reasons.map((reason) => (
          <option key={reason} value={reason} className="bg-background text-foreground">
            {reason}
          </option>
        ))}
      </select>
    </div>
  );
}

export { CANCELLATION_REASONS, COMPLETED_REFUND_REASONS };

interface CommentsTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

export function CommentsTextarea({ value, onChange }: CommentsTextareaProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="cancel-details"
        className="text-xs font-bold uppercase tracking-wider text-foreground"
      >
        Observações adicionais (opcional)
      </label>
      <textarea
        id="cancel-details"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Deixe mais detalhes para ajudar nossa equipe a melhorar..."
        className="w-full resize-none rounded-xl border border-input bg-background p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

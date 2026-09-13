interface StoreDescriptionFieldProps {
  description: string;
  maxLength: number;
  onChange: (value: string) => void;
}

export function StoreDescriptionField({
  description,
  maxLength,
  onChange,
}: StoreDescriptionFieldProps) {
  const charCount = description.length;
  const isNearLimit = charCount >= maxLength * 0.8;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor="description" className="text-xs font-bold text-foreground">
          Descrição da loja <span className="text-primary">*</span>
        </label>
        <span
          className={`text-[11px] font-medium select-none ${
            isNearLimit ? "text-amber-600" : "text-muted-foreground"
          }`}
        >
          {charCount}/{maxLength}
        </span>
      </div>
      <textarea
        id="description"
        rows={6}
        value={description}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder="Descreva sua empresa, os serviços que oferece, diferenciais, experiência no mercado..."
        className="w-full resize-none rounded-xl border border-input bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
      <p className="text-xs text-muted-foreground">
        Uma boa descrição aumenta sua credibilidade e conversões
      </p>
    </div>
  );
}

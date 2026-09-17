import { Input } from "@/components/ui/input";

interface EnterpriseInfosFieldsProps {
  cnpj: string;
  onCnpjChange: (value: string) => void;
}

export function EnterpriseInfosFields({
  cnpj,
  onCnpjChange,
}: EnterpriseInfosFieldsProps) {
  function formatCnpj(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 14);
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return (
    <>
      {/* Nome de Exibição */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="displayName" className="text-xs font-bold text-foreground">
          Nome de exibição <span className="text-primary">*</span>
        </label>
        <Input
          id="displayName"
          placeholder="Ex: Carlão Piscinas ME"
          className="h-11 rounded-xl"
        />
        <p className="text-xs text-muted-foreground">
          Nome que aparecerá publicamente para os clientes
        </p>
      </div>

      {/* Separador */}
      <div className="h-px bg-border" />

      {/* CNPJ */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cnpj" className="text-xs font-bold text-foreground">
          CNPJ
        </label>
        <Input
          id="cnpj"
          inputMode="numeric"
          placeholder="00.000.000/0000-00"
          value={cnpj}
          onChange={(e) => onCnpjChange(formatCnpj(e.target.value))}
          className="h-11 rounded-xl"
        />
        <p className="text-xs text-muted-foreground">
          Opcional — deixe em branco se for pessoa física (CPF)
        </p>
      </div>
    </>
  );
}

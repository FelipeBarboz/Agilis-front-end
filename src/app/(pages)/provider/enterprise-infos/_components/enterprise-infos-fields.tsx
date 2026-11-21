import { Input } from "@/components/ui/input";
import { formatCnpj } from "@/lib/services/stores-service";

interface EnterpriseInfosFieldsProps {
  unitName: string;
  onUnitNameChange: (value: string) => void;
  cnpj: string;
  onCnpjChange: (value: string) => void;
}

export function EnterpriseInfosFields({
  unitName,
  onUnitNameChange,
  cnpj,
  onCnpjChange,
}: EnterpriseInfosFieldsProps) {
  return (
    <>
      {/* Nome da Unidade */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="unitName" className="text-xs font-bold text-foreground">
          Nome da unidade <span className="text-primary">*</span>
        </label>
        <Input
          id="unitName"
          required
          placeholder="Ex: Matriz, Unidade Centro, Filial 1"
          value={unitName}
          onChange={(e) => onUnitNameChange(e.target.value)}
          className="h-11 rounded-xl"
        />
        <p className="text-xs text-muted-foreground">
          Identificação da unidade de atendimento da loja (obrigatório)
        </p>
      </div>

      {/* Separador */}
      <div className="h-px bg-border" />

      {/* CNPJ */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cnpj" className="text-xs font-bold text-foreground">
          CNPJ <span className="text-primary">*</span>
        </label>
        <Input
          id="cnpj"
          required
          inputMode="numeric"
          placeholder="00.000.000/0000-00"
          value={cnpj}
          onChange={(e) => onCnpjChange(formatCnpj(e.target.value))}
          className="h-11 rounded-xl"
        />
        <p className="text-xs text-muted-foreground">
          Cadastro de CNPJ obrigatório para a criação da loja
        </p>
      </div>
    </>
  );
}

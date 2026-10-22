import { SUPPORT_SUBJECTS, type SupportSubjectType } from "@/lib/validations/support";

export interface SupportSubjectOption {
  value: SupportSubjectType;
  label: string;
}

export const SUPPORT_SUBJECT_OPTIONS: SupportSubjectOption[] = [
  { value: "DUVIDA_GERAL", label: "Dúvida geral" },
  { value: "PROBLEMA_AGENDAMENTO", label: "Problema com agendamento" },
  { value: "PROBLEMA_PAGAMENTO", label: "Problema com pagamento" },
  { value: "DENUNCIA_PRESTADOR", label: "Reclamação / Denúncia sobre profissional" },
  { value: "SUGESTAO", label: "Sugestão" },
  { value: "OUTRO", label: "Outro" },
];

export { SUPPORT_SUBJECTS };

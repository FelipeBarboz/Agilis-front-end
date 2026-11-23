import { z } from "zod";

export const SUPPORT_SUBJECTS = [
  "DUVIDA_GERAL",
  "PROBLEMA_PAGAMENTO",
  "PROBLEMA_AGENDAMENTO",
  "DENUNCIA_PRESTADOR",
  "SUGESTAO",
  "OUTRO",
] as const;

export const supportSubjectEnum = z.enum(SUPPORT_SUBJECTS, {
  errorMap: () => ({ message: "Selecione um assunto válido" }),
});

export type SupportSubjectType = z.infer<typeof supportSubjectEnum>;

export const supportSchema = z.object({
  userId: z
    .string()
    .uuid("Identificador de usuário inválido")
    .optional()
    .or(z.literal("")),
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .trim()
    .min(2, "Nome deve ter ao menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string({ required_error: "E-mail é obrigatório" })
    .trim()
    .toLowerCase()
    .min(1, "E-mail é obrigatório")
    .email("Digite um e-mail válido")
    .max(255, "E-mail muito longo"),
  subject: supportSubjectEnum,
  message: z
    .string({ required_error: "Mensagem é obrigatória" })
    .trim()
    .min(10, "Mensagem deve ter ao menos 10 caracteres")
    .max(500, "Mensagem deve ter no máximo 500 caracteres"),
});

export type SupportFormData = z.infer<typeof supportSchema>;

export interface SupportMessageDTO {
  userId?: string;
  name: string;
  email: string;
  subject: SupportSubjectType;
  message: string;
}

export interface SupportMessageResponse {
  messageId?: string;
  [key: string]: unknown;
}
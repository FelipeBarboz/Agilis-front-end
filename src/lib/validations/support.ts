import { z } from "zod";

export const supportSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter ao menos 2 caracteres")
    .max(100, "Nome muito longo"),
  email: z
    .string()
    .min(1, "E-mail obrigatório")
    .email("E-mail inválido"),
  subject: z
    .string()
    .min(1, "Assunto obrigatório"),
  message: z
    .string()
    .min(10, "Mensagem deve ter ao menos 10 caracteres")
    .max(500, "Mensagem muito longa"),
});

export type SupportFormData = z.infer<typeof supportSchema>;
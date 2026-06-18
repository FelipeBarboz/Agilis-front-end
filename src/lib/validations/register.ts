import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail obrigatório")
    .email("E-mail inválido"),
  phone: z
    .string()
    .min(10, "Telefone inválido")
    .max(11, "Telefone inválido")
    .regex(/^\d+$/, "Apenas números"),
  name: z
    .string()
    .min(2, "Nome deve ter ao menos 2 caracteres")
    .max(100, "Nome muito longo"),
  password: z
    .string()
    .min(8, "Senha deve ter ao menos 8 caracteres"),
  terms: z
    .boolean()
    .refine((val) => val === true, "Você deve aceitar os termos"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
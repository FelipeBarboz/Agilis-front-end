import { z } from "zod";

export const addressSchema = z.object({
  cep: z
    .string()
    .min(9, "CEP inválido")
    .regex(/^\d{5}-\d{3}$/, "Use o formato 00000-000"),
  street: z.string().min(3, "Informe a rua ou avenida"),
  number: z.string().min(1, "Informe o número"),
  complement: z.string().optional(),
  city: z.string().min(2, "Informe a cidade"),
  state: z.string().min(2, "Informe o estado (ex: SP)").max(2, "Use a sigla do estado (ex: SP)"),
});

export type AddressSchema = z.infer<typeof addressSchema>;

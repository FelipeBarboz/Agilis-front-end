import { z } from "zod";

export const storeSchema = z.object({
  cnpj: z
    .string()
    .min(1, "CNPJ obrigatório")
    .transform((val) => val.replace(/\D/g, ""))
    .pipe(
      z
        .string()
        .length(14, "CNPJ deve ter 14 dígitos")
        .regex(/^\d+$/, "Apenas números"),
    ),
  terms: z.boolean().optional(),
});

export type StoreFormData = z.infer<typeof storeSchema>;
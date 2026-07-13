import { z } from "zod";

export const storeSchema = z.object({
  storeName: z
    .string()
    .min(2, "Informe o nome da loja")
    .max(60, "Nome muito longo"),
  storeUrl: z
    .string()
    .min(3, "Informe a URL da loja")
    .max(50, "URL muito longa")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Use apenas letras minúsculas, números e hífens",
    ),
  terms: z.literal(true, {
    errorMap: () => ({ message: "Você precisa aceitar os termos" }),
  }),
});

export type StoreFormData = z.infer<typeof storeSchema>;
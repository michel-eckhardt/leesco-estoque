import { z } from "zod";

export const stockSchema = z.object({
  name: z
    .string()
    .min(1, "Nome do estoque é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome não pode ter mais de 100 caracteres"),
});

export type StockInput = z.infer<typeof stockSchema>;

import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome não pode ter mais de 100 caracteres"),
});

export type CategoryInput = z.infer<typeof categorySchema>;

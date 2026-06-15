import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Nome do produto é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome não pode ter mais de 100 caracteres"),
  unit: z.enum(["KG", "METRO", "LITRO", "UNIDADE"]).refine(
    (val) => ["KG", "METRO", "LITRO", "UNIDADE"].includes(val),
    { message: "Unidade de medida inválida" }
  ),
  categoryId: z
    .string()
    .min(1, "Categoria é obrigatória"),
  photoUrl: z.string().optional(),
  photoPublicId: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Nome da categoria é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome não pode ter mais de 50 caracteres"),
});

export type CategoryInput = z.infer<typeof categorySchema>;

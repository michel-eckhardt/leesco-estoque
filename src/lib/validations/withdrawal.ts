import { z } from "zod";

export const withdrawalSchema = z.object({
  productId: z.string().cuid("Produto inválido"),
  quantity: z
    .number()
    .positive("Quantidade deve ser maior que zero")
    .multipleOf(0.001, "Máximo 3 casas decimais"),
  reason: z
    .string()
    .max(255, "Motivo não pode ter mais de 255 caracteres")
    .optional()
    .or(z.literal("")),
});

export type WithdrawalInput = z.infer<typeof withdrawalSchema>;

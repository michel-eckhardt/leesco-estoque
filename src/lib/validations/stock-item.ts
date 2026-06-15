import { z } from "zod";

export const stockItemSchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório"),
  quantity: z
    .number()
    .min(0, "Quantidade não pode ser negativa")
    .or(z.string().regex(/^\d+(\.\d{1,3})?$/).transform(Number)),
});

export type StockItemInput = z.infer<typeof stockItemSchema>;

export const adjustStockSchema = z.object({
  quantity: z
    .number()
    .min(0, "Quantidade não pode ser negativa")
    .or(z.string().regex(/^\d+(\.\d{1,3})?$/).transform(Number)),
});

export type AdjustStockInput = z.infer<typeof adjustStockSchema>;

"use server";

import { prisma } from "@/lib/prisma";
import { stockItemSchema, adjustStockSchema } from "@/lib/validations/stock-item";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getStockItems(stockId: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const items = await prisma.stockItem.findMany({
    where: { stockId },
    include: {
      product: {
        include: { category: true },
      },
    },
  });

  return items.map((item) => ({
    ...item,
    quantity: Number(item.quantity),
  }));
}

export async function addProductToStock(stockId: string, data: unknown) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = stockItemSchema.parse(data);

  // Check if product already exists in stock
  const existing = await prisma.stockItem.findUnique({
    where: {
      stockId_productId: {
        stockId,
        productId: validated.productId,
      },
    },
  });

  if (existing) {
    throw new Error("Este produto já está neste estoque");
  }

  const item = await prisma.stockItem.create({
    data: {
      stockId,
      productId: validated.productId,
      quantity: validated.quantity,
    },
    include: {
      product: {
        include: { category: true },
      },
    },
  });

  revalidatePath(`/estoques/${stockId}`);
  return item;
}

export async function adjustStockQuantity(
  stockId: string,
  stockItemId: string,
  data: unknown
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = adjustStockSchema.parse(data);

  const item = await prisma.stockItem.update({
    where: {
      id: stockItemId,
      stockId, // Ensure it belongs to the correct stock
    },
    data: {
      quantity: validated.quantity,
    },
    include: {
      product: {
        include: { category: true },
      },
    },
  });

  revalidatePath(`/estoques/${stockId}`);
  return item;
}

export async function removeProductFromStock(stockId: string, stockItemId: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.stockItem.delete({
    where: {
      id: stockItemId,
      stockId,
    },
  });

  revalidatePath(`/estoques/${stockId}`);
}

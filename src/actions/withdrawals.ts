"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withdrawalSchema } from "@/lib/validations/withdrawal";

export async function createWithdrawal(
  stockId: string,
  data: unknown,
  stockName?: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  const validated = withdrawalSchema.parse(data);

  const stockItem = await prisma.stockItem.findUnique({
    where: {
      stockId_productId: {
        stockId,
        productId: validated.productId,
      },
    },
    include: {
      product: true,
    },
  });

  if (!stockItem) {
    throw new Error("Produto não encontrado neste estoque");
  }

  const currentQuantity = typeof stockItem.quantity === 'object'
    ? stockItem.quantity.toNumber()
    : Number(stockItem.quantity);

  if (currentQuantity < validated.quantity) {
    throw new Error(
      `Quantidade insuficiente. Disponível: ${currentQuantity.toFixed(3)}`
    );
  }

  const withdrawal = await prisma.$transaction([
    prisma.stockItem.update({
      where: {
        stockId_productId: {
          stockId,
          productId: validated.productId,
        },
      },
      data: {
        quantity: {
          decrement: validated.quantity,
        },
      },
    }),
    prisma.withdrawal.create({
      data: {
        stockId,
        productId: validated.productId,
        userId: session.user.id,
        quantity: validated.quantity,
        reason: validated.reason || null,
      },
      include: {
        product: true,
        user: true,
      },
    }),
  ]);

  return withdrawal[1];
}

export async function getWithdrawals(
  stockId?: string,
  limit = 50,
  offset = 0
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  const where = stockId ? { stockId } : {};

  const withdrawals = await prisma.withdrawal.findMany({
    where,
    include: {
      product: {
        include: {
          category: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
  });

  return withdrawals;
}

export async function getStockWithdrawals(stockId: string) {
  const withdrawals = await prisma.withdrawal.findMany({
    where: { stockId },
    include: {
      product: {
        include: {
          category: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  return withdrawals;
}

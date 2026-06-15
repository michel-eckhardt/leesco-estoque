"use server";

import { prisma } from "@/lib/prisma";
import { stockSchema } from "@/lib/validations/stock";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getStocks() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const stocks = await prisma.stock.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      stockItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      userAssignments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  // Convert Decimal to number
  return stocks.map((stock) => ({
    ...stock,
    stockItems: stock.stockItems.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
    })),
  }));
}

export async function getStock(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const stock = await prisma.stock.findUnique({
    where: { id },
    include: {
      stockItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              unit: true,
            },
          },
        },
      },
      userAssignments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!stock) return null;

  // Convert Decimal to number
  return {
    ...stock,
    stockItems: stock.stockItems.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
    })),
  };
}

export async function createStock(data: unknown) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = stockSchema.parse(data);

  const stock = await prisma.stock.create({
    data: {
      name: validated.name,
    },
  });

  revalidatePath("/estoques");
  return stock;
}

export async function updateStock(id: string, data: unknown) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = stockSchema.parse(data);

  const stock = await prisma.stock.update({
    where: { id },
    data: {
      name: validated.name,
    },
  });

  revalidatePath("/estoques");
  revalidatePath(`/estoques/${id}`);
  return stock;
}

export async function deleteStock(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Check if stock has items
  const itemCount = await prisma.stockItem.count({
    where: { stockId: id },
  });

  if (itemCount > 0) {
    throw new Error("Não é possível deletar um estoque com produtos");
  }

  await prisma.stock.delete({
    where: { id },
  });

  revalidatePath("/estoques");
}

"use server";

import { prisma } from "@/lib/prisma";
import { productSchema, categorySchema } from "@/lib/validations/product";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
    },
  });

  return products.map((product) => ({
    ...product,
  }));
}

export async function getProduct(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
}

export async function getCategories() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createCategory(data: unknown) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = categorySchema.parse(data);

  const category = await prisma.category.create({
    data: {
      name: validated.name,
    },
  });

  revalidatePath("/produtos");
  return category;
}

export async function createProduct(data: unknown) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = productSchema.parse(data);

  const product = await prisma.product.create({
    data: {
      name: validated.name,
      unit: validated.unit,
      categoryId: validated.categoryId,
      photoUrl: validated.photoUrl,
      photoPublicId: validated.photoPublicId,
    },
    include: {
      category: true,
    },
  });

  revalidatePath("/produtos");
  return product;
}

export async function updateProduct(id: string, data: unknown) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = productSchema.parse(data);

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: validated.name,
      unit: validated.unit,
      categoryId: validated.categoryId,
      photoUrl: validated.photoUrl,
      photoPublicId: validated.photoPublicId,
    },
    include: {
      category: true,
    },
  });

  revalidatePath("/produtos");
  revalidatePath(`/produtos/${id}`);
  return product;
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Check if product is in stock
  const stockItemCount = await prisma.stockItem.count({
    where: { productId: id },
  });

  if (stockItemCount > 0) {
    throw new Error("Não é possível deletar um produto que está em estoque");
  }

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/produtos");
}

export async function getCategoriesWithCount() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Check if category has products
  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productCount > 0) {
    throw new Error(
      "Não é possível deletar uma categoria que possui produtos"
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/categorias");
}

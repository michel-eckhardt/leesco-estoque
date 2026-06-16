"use server";

import { prisma } from "@/lib/prisma";
import { userSchema } from "@/lib/validations/user";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getUsers() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      stockAssignments: {
        include: { stock: true },
      },
    },
  });
}

export async function getUser(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return prisma.user.findUnique({
    where: { id },
    include: {
      stockAssignments: {
        include: { stock: true },
      },
    },
  });
}

export async function createUser(data: unknown) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = userSchema.parse(data);

  // Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (existing) {
    throw new Error("Usuário com este email já existe");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    validated.password || "password123",
    10
  );

  const user = await prisma.user.create({
    data: {
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      role: validated.role,
      stockAssignments: {
        create: validated.stockIds.map((stockId) => ({
          stockId,
        })),
      },
    },
    include: {
      stockAssignments: {
        include: { stock: true },
      },
    },
  });

  revalidatePath("/usuarios");
  return user;
}

export async function updateUser(id: string, data: unknown) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = userSchema.parse(data);

  // Check if email is taken by another user
  if (validated.email) {
    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existing && existing.id !== id) {
      throw new Error("Outro usuário já está usando este email");
    }
  }

  // Update password only if provided
  const updateData: any = {
    name: validated.name,
    email: validated.email,
    role: validated.role,
  };

  if (validated.password) {
    updateData.password = await bcrypt.hash(validated.password, 10);
  }

  // Update stock assignments
  await prisma.userStock.deleteMany({
    where: { userId: id },
  });

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...updateData,
      stockAssignments: {
        create: validated.stockIds.map((stockId) => ({
          stockId,
        })),
      },
    },
    include: {
      stockAssignments: {
        include: { stock: true },
      },
    },
  });

  revalidatePath("/usuarios");
  return user;
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Cannot delete self
  if (session.user?.id === id) {
    throw new Error("Você não pode deletar sua própria conta");
  }

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/usuarios");
}

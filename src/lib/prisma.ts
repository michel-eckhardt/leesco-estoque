import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  // Always use Neon adapter, it works with any PostgreSQL (including local)
  const { PrismaNeon } = require("@prisma/adapter-neon");
  const { sql } = require("@neondatabase/serverless");

  return new PrismaClient({
    adapter: new PrismaNeon(sql),
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

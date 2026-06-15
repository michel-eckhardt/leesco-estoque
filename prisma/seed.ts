import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaNeon(neon(process.env.DATABASE_URL!) as any),
});

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@leesco.com" },
  });

  if (adminExists) {
    console.log("✅ Admin user already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Administrador",
      email: "admin@leesco.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created:", {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  // Create demo stock
  const stock = await prisma.stock.create({
    data: {
      name: "Estoque Principal",
    },
  });

  console.log("✅ Demo stock created:", {
    id: stock.id,
    name: stock.name,
  });

  // Create demo category
  const category = await prisma.category.create({
    data: {
      name: "Eletrônicos",
    },
  });

  console.log("✅ Demo category created:", {
    id: category.id,
    name: category.name,
  });

  console.log("\n🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

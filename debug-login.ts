import "dotenv/config";
import { prisma } from "./src/lib/prisma";
import bcrypt from "bcryptjs";

async function debugLogin() {
  console.log("🔍 Debugando login...\n");

  try {
    console.log("1️⃣  Conectando ao banco...");
    const user = await prisma.user.findUnique({
      where: { email: "admin@leesco.com" },
    });

    if (!user) {
      console.log("❌ Usuário não encontrado!");
      return;
    }

    console.log("✅ Usuário encontrado:");
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password hash: ${user.password.substring(0, 30)}...`);

    console.log("\n2️⃣  Testando senha 'admin123'...");
    const isValid = await bcrypt.compare("admin123", user.password);
    console.log(`   Resultado: ${isValid ? "✅ VÁLIDA" : "❌ INVÁLIDA"}`);

    if (isValid) {
      console.log("\n3️⃣  Simulando retorno do authorize...");
      const returnUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
      console.log("✅ Seria retornado:", returnUser);
    } else {
      console.log("\n❌ A senha não corresponde ao hash!");
      console.log("\nTentando criar novo usuário com hash correto...");

      const newHash = await bcrypt.hash("admin123", 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: newHash },
      });

      console.log("✅ Senha atualizada!");

      // Test again
      const isValidNow = await bcrypt.compare("admin123", newHash);
      console.log(`   Nova senha válida: ${isValidNow ? "✅ SIM" : "❌ NÃO"}`);
    }
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

debugLogin();

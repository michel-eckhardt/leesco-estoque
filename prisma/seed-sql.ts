import "dotenv/config";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const client = await pool.connect();

  try {
    console.log("🌱 Iniciando seed do banco de dados...");

    // Check if admin already exists
    const adminResult = await client.query(
      "SELECT * FROM users WHERE email = $1",
      ["admin@leesco.com"]
    );

    if (adminResult.rows.length > 0) {
      console.log("✅ Admin user already exists");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminId = crypto.randomUUID();
    const now = new Date();

    await client.query(
      `INSERT INTO users (id, name, email, password, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        adminId,
        "Administrador",
        "admin@leesco.com",
        hashedPassword,
        "ADMIN",
        now,
        now,
      ]
    );

    console.log("✅ Admin user created");
    console.log("   Email: admin@leesco.com");
    console.log("   Senha: admin123");

    // Create demo stock
    const stockId = crypto.randomUUID();
    await client.query(
      `INSERT INTO stocks (id, name, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4)`,
      [stockId, "Estoque Principal", now, now]
    );

    console.log("✅ Demo stock created");

    // Create demo categories
    const catNames = ["Eletrônicos", "Alimentos", "Ferramentas"];

    for (const name of catNames) {
      const catId = crypto.randomUUID();
      await client.query(
        `INSERT INTO categories (id, name, "createdAt")
         VALUES ($1, $2, $3)`,
        [catId, name, now]
      );
    }

    console.log("✅ Demo categories created");

    console.log("\n🎉 Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante seed:", error);
    process.exit(1);
  } finally {
    await client.release();
    await pool.end();
  }
}

main();

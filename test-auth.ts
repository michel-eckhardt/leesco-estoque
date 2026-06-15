import "dotenv/config";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testAuth() {
  const client = await pool.connect();

  try {
    // Get the admin user
    const result = await client.query(
      "SELECT id, email, password, role FROM users WHERE email = $1",
      ["admin@leesco.com"]
    );

    if (result.rows.length === 0) {
      console.log("❌ Admin user not found");
      return;
    }

    const user = result.rows[0];
    console.log("✅ Admin user found:");
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password hash: ${user.password.substring(0, 20)}...`);

    // Test password
    const testPassword = "admin123";
    const isValid = await bcrypt.compare(testPassword, user.password);

    console.log("\n🔐 Password test:");
    console.log(`   Testing password: "${testPassword}"`);
    console.log(`   Is valid: ${isValid ? "✅ YES" : "❌ NO"}`);

    if (!isValid) {
      console.log("\n⚠️  Password mismatch! Creating new admin user...");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await client.query(
        "UPDATE users SET password = $1 WHERE email = $2",
        [hashedPassword, "admin@leesco.com"]
      );
      console.log("✅ Password updated!");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.release();
    await pool.end();
  }
}

testAuth();

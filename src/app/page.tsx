import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session) {
    // Redirect authenticated users based on their role
    redirect(session.user?.role === "ADMIN" ? "/dashboard" : "/meu-estoque");
  }

  // Redirect unauthenticated users to login
  redirect("/login");
}

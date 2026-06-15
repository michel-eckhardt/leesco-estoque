import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NavUser } from "@/components/layout/nav-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function UsuarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== "USER") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Leesco</h1>
          <nav className="flex gap-4 items-center">
            <Link href="/meu-estoque">
              <Button variant="ghost">Meu Estoque</Button>
            </Link>
            <Link href="/retirada">
              <Button variant="ghost">Retirada</Button>
            </Link>
            <NavUser
              name={session.user?.name || ""}
              email={session.user?.email || ""}
            />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

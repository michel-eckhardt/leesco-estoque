import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - will be implemented in next phase */}
      <aside className="w-64 bg-white shadow">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Leesco</h1>
        </div>
        <nav className="mt-6 space-y-2 px-4">
          <a
            href="/dashboard"
            className="block px-4 py-2 rounded hover:bg-gray-100"
          >
            Dashboard
          </a>
          <a
            href="/estoques"
            className="block px-4 py-2 rounded hover:bg-gray-100"
          >
            Estoques
          </a>
          <a
            href="/produtos"
            className="block px-4 py-2 rounded hover:bg-gray-100"
          >
            Produtos
          </a>
          <a
            href="/usuarios"
            className="block px-4 py-2 rounded hover:bg-gray-100"
          >
            Usuários
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

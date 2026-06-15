import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

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
      {/* Header - will be implemented in next phase */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Leesco</h1>
          <div className="text-sm text-gray-600">{session.user?.name}</div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

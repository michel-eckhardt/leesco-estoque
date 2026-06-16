import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UsersTable } from "@/components/tables/users-table";
import { getUsers } from "@/actions/users";
import { Plus } from "lucide-react";

export default async function UsuariosPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="mt-1 text-gray-600">
            Gerenciar usuários do sistema
          </p>
        </div>
        <Link href="/usuarios/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </Link>
      </div>

      <UsersTable users={users} />
    </div>
  );
}

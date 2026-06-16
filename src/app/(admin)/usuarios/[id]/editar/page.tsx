import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserForm } from "@/components/forms/user-form";
import { getUser } from "@/actions/users";
import { ArrowLeft } from "lucide-react";

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Usuário não encontrado</h1>
        <Link href="/usuarios">
          <Button className="mt-4">Voltar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/usuarios">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Usuário</h1>
          <p className="mt-1 text-gray-600">{user.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <UserForm user={user} />
      </div>
    </div>
  );
}

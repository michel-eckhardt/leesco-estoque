import { UserForm } from "@/components/forms/user-form";

export default function NovoUsuarioPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Novo Usuário</h1>
        <p className="mt-1 text-gray-600">
          Criar um novo usuário no sistema
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <UserForm />
      </div>
    </div>
  );
}

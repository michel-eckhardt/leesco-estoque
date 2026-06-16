"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/actions/users";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UsersTableProps {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    stockAssignments: Array<{
      stock: {
        id: string;
        name: string;
      };
    }>;
  }>;
  onDelete?: () => void;
}

export function UsersTable({ users, onDelete }: UsersTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      toast.success("Usuário deletado com sucesso");
      onDelete?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao deletar";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum usuário cadastrado</p>
        <Link href="/usuarios/novo">
          <Button className="mt-4">Criar Primeiro Usuário</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Role
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Estoques
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {user.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {user.role === "ADMIN" ? "Administrador" : "Usuário"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {user.role === "USER" ? (
                  <div className="flex flex-wrap gap-1">
                    {user.stockAssignments.length > 0 ? (
                      user.stockAssignments.map((assignment) => (
                        <span
                          key={assignment.stock.id}
                          className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                        >
                          {assignment.stock.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">Nenhum estoque</span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">Todos</span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/usuarios/${user.id}/editar`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog open={deletingId === user.id}>
                    <AlertDialogTrigger
                      onClick={() => setDeletingId(user.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 px-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Deletar Usuário?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja deletar "{user.name}"? Esta ação
                        não pode ser desfeita.
                      </AlertDialogDescription>
                      <div className="flex gap-2 justify-end">
                        <AlertDialogCancel onClick={() => setDeletingId(null)}>
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Deletar
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

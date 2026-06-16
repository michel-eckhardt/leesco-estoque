"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/actions/products";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CategoriesTableProps {
  categories: Array<{
    id: string;
    name: string;
    _count?: {
      products: number;
    };
  }>;
  onDelete?: () => void;
}

export function CategoriesTable({
  categories,
  onDelete,
}: CategoriesTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("Categoria deletada com sucesso");
      onDelete?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao deletar";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhuma categoria cadastrada</p>
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
              Produtos
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {category.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {category._count?.products ?? 0} produto(s)
              </td>
              <td className="px-6 py-4 text-right">
                <AlertDialog open={deletingId === category.id}>
                  <AlertDialogTrigger
                    onClick={() => setDeletingId(category.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 px-0"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>Deletar Categoria?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja deletar "{category.name}"? Esta ação
                      não pode ser desfeita.
                    </AlertDialogDescription>
                    <div className="flex gap-2 justify-end">
                      <AlertDialogCancel onClick={() => setDeletingId(null)}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(category.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Deletar
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

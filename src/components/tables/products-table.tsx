"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/actions/products";
import { formatUnit } from "@/lib/utils";
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

interface ProductsTableProps {
  products: Array<{
    id: string;
    name: string;
    unit: string;
    category: {
      id: string;
      name: string;
    };
    photoUrl?: string | null;
  }>;
  onDelete?: () => void;
}

export function ProductsTable({ products, onDelete }: ProductsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success("Produto deletado com sucesso");
      onDelete?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao deletar";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum produto cadastrado</p>
        <Link href="/produtos/novo">
          <Button className="mt-4">Criar Primeiro Produto</Button>
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
              Categoria
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Unidade
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {product.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                  {product.category.name}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {formatUnit(product.unit)}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/produtos/${product.id}/editar`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog open={deletingId === product.id}>
                    <AlertDialogTrigger>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingId(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Deletar Produto?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja deletar o produto "{product.name}"?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                      <div className="flex gap-2 justify-end">
                        <AlertDialogCancel onClick={() => setDeletingId(null)}>
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(product.id)}
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

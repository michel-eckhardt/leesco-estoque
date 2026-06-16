"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteStock } from "@/actions/stocks";
import { formatDate } from "@/lib/utils";
import { Edit, Trash2, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface StocksTableProps {
  stocks: Array<{
    id: string;
    name: string;
    createdAt: Date;
    stockItems: Array<{
      id: string;
      quantity: number;
      product: {
        id: string;
        name: string;
      };
    }>;
    userAssignments: Array<{
      user: {
        id: string;
        name: string;
      };
    }>;
  }>;
  onDelete?: () => void;
}

export function StocksTable({ stocks, onDelete }: StocksTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteStock(id);
      toast.success("Estoque deletado com sucesso");
      onDelete?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao deletar";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (stocks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum estoque cadastrado</p>
        <Link href="/estoques/novo">
          <Button className="mt-4">Criar Primeiro Estoque</Button>
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
              Produtos
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Usuários
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Criado em
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {stocks.map((stock) => (
            <tr key={stock.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {stock.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {stock.stockItems.length} produto(s)
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {stock.userAssignments.length} usuário(s)
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {formatDate(stock.createdAt)}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/estoques/${stock.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/estoques/${stock.id}/editar`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog open={deletingId === stock.id}>
                    <AlertDialogTrigger
                      onClick={() => setDeletingId(stock.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 px-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Deletar Estoque?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja deletar o estoque "{stock.name}"?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                      <div className="flex gap-2 justify-end">
                        <AlertDialogCancel onClick={() => setDeletingId(null)}>
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(stock.id)}
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

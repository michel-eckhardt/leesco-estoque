"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { removeProductFromStock } from "@/actions/stock-items";
import { formatUnit } from "@/lib/utils";
import { Edit2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface StockItemsTableProps {
  stockId: string;
  items: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      unit: string;
      category: {
        id: string;
        name: string;
      };
    };
  }>;
  onEdit?: (item: any) => void;
  onDelete?: () => void;
}

export function StockItemsTable({
  stockId,
  items,
  onEdit,
  onDelete,
}: StockItemsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await removeProductFromStock(stockId, id);
      toast.success("Produto removido do estoque");
      onDelete?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao remover";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border">
        <p className="text-gray-500">Nenhum produto neste estoque</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Produto
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Categoria
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Quantidade
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
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {item.product.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                  {item.product.category.name}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                {item.quantity.toFixed(3)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {formatUnit(item.product.unit)}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(item)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog open={deletingId === item.id}>
                    <AlertDialogTrigger
                      onClick={() => setDeletingId(item.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 px-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Remover Produto?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover "{item.product.name}" deste
                        estoque? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                      <div className="flex gap-2 justify-end">
                        <AlertDialogCancel onClick={() => setDeletingId(null)}>
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Remover
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

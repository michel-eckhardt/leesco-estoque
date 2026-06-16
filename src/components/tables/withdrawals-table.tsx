"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WithdrawalsTableProps {
  withdrawals: Array<{
    id: string;
    product: {
      name: string;
      unit: string;
      category: {
        name: string;
      };
    };
    user: {
      name: string;
    };
    quantity: any;
    reason: string | null;
    createdAt: Date;
  }>;
}

export function WithdrawalsTable({ withdrawals }: WithdrawalsTableProps) {
  if (withdrawals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhuma retirada registrada</p>
      </div>
    );
  }

  const unitLabels: Record<string, string> = {
    KG: "kg",
    METRO: "m",
    LITRO: "L",
    UNIDADE: "un",
  };

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Usuário
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Produto
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Categoria
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
              Quantidade
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Motivo
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Data
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {withdrawals.map((withdrawal) => (
            <tr key={withdrawal.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {withdrawal.user.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {withdrawal.product.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                  {withdrawal.product.category.name}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 text-right">
                <span className="font-medium">
                  {typeof withdrawal.quantity === 'object' && withdrawal.quantity?.toNumber
                    ? withdrawal.quantity.toNumber().toFixed(3)
                    : Number(withdrawal.quantity).toFixed(3)}
                </span>
                <span className="text-gray-500 ml-2">
                  {unitLabels[withdrawal.product.unit]}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                {withdrawal.reason || (
                  <span className="text-gray-400 italic">sem motivo</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {formatDistanceToNow(new Date(withdrawal.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

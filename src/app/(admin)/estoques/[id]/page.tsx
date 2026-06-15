import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getStock } from "@/actions/stocks";
import { formatDate, formatUnit } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default async function EstoqueDetalhePage({
  params,
}: {
  params: { id: string };
}) {
  const stock = await getStock(params.id);

  if (!stock) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Estoque não encontrado</h1>
        <Link href="/estoques">
          <Button className="mt-4">Voltar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/estoques">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{stock.name}</h1>
          <p className="text-sm text-gray-600">
            Criado em {formatDate(stock.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Produtos */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Produtos no Estoque</h2>
          {stock.stockItems.length === 0 ? (
            <p className="text-gray-500">Nenhum produto neste estoque</p>
          ) : (
            <div className="space-y-3">
              {stock.stockItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {item.quantity.toFixed(3)} {formatUnit(item.product.unit)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usuários */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Usuários Designados</h2>
          {stock.userAssignments.length === 0 ? (
            <p className="text-gray-500">Nenhum usuário designado</p>
          ) : (
            <div className="space-y-2">
              {stock.userAssignments.map((assignment) => (
                <div
                  key={assignment.user.id}
                  className="p-3 bg-gray-50 rounded"
                >
                  <p className="font-medium">{assignment.user.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Link href={`/estoques/${stock.id}/editar`}>
          <Button>Editar Estoque</Button>
        </Link>
      </div>
    </div>
  );
}

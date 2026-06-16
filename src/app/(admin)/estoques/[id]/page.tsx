import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StockItemsTableClient } from "@/components/tables/stock-items-table-client";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { getStockItems } from "@/actions/stock-items";
import { getStock } from "@/actions/stocks";
import { redirect } from "next/navigation";

export default async function EstoqueDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stock = await getStock(id);

  if (!stock) {
    redirect("/estoques");
  }

  const items = await getStockItems(id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link href="/estoques">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold break-words">{stock.name}</h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Criado em {formatDate(stock.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Produtos */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold">Produtos no Estoque</h2>
          <StockItemsTableClient
            stockId={id}
            initialItems={items}
          />
        </div>

        {/* Formulário */}
        <div className="order-first lg:order-last">
          <div className="bg-white rounded-lg border p-4 sm:p-6 space-y-4 sticky top-4">
            <Link href={`/estoques/${stock.id}/editar`}>
              <Button variant="outline" className="w-full">
                Editar Estoque
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

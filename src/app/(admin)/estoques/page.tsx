import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StocksTable } from "@/components/tables/stocks-table";
import { getStocks } from "@/actions/stocks";
import { Plus } from "lucide-react";

export default async function EstoquesPage() {
  const stocks = await getStocks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Estoques</h1>
          <p className="mt-1 text-gray-600">
            Gerenciar estoques da empresa
          </p>
        </div>
        <Link href="/estoques/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Estoque
          </Button>
        </Link>
      </div>

      <StocksTable stocks={stocks} />
    </div>
  );
}

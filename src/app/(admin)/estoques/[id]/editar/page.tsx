import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StockForm } from "@/components/forms/stock-form";
import { getStock } from "@/actions/stocks";
import { ArrowLeft } from "lucide-react";

export default async function EditarEstoquePage({
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
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href={`/estoques/${stock.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Estoque</h1>
          <p className="mt-1 text-gray-600">{stock.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <StockForm stock={stock} />
      </div>
    </div>
  );
}

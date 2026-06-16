import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default async function MeuEstoquePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userStocks = await prisma.userStock.findMany({
    where: { userId: session.user.id },
    include: { stock: true },
  });

  if (userStocks.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">
          Nenhum estoque atribuído
        </h1>
        <p className="mt-2 text-gray-600">
          Entre em contato com o administrador para ser atribuído a um estoque
        </p>
      </div>
    );
  }

  const stockId = userStocks[0].stockId;

  const stockItems = await prisma.stockItem.findMany({
    where: { stockId },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      product: {
        name: "asc",
      },
    },
  });

  const unitLabels: Record<string, string> = {
    KG: "kg",
    METRO: "m",
    LITRO: "L",
    UNIDADE: "un",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meu Estoque</h1>
          <p className="mt-1 text-gray-600">
            {userStocks[0].stock.name}
          </p>
        </div>
        <Link href="/retirada">
          <Button>
            <ArrowRight className="mr-2 h-4 w-4" />
            Registrar Retirada
          </Button>
        </Link>
      </div>

      {stockItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum produto disponível neste estoque</p>
        </div>
      ) : (
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
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  Quantidade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stockItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      {item.product.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-right">
                    <span className="font-medium">
                      {item.quantity.toNumber ? item.quantity.toNumber().toFixed(3) : Number(item.quantity).toFixed(3)}
                    </span>
                    <span className="text-gray-500 ml-2">
                      {unitLabels[item.product.unit]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

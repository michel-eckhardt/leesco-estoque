import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AlertCircle, TrendingDown } from "lucide-react";

const ESTOQUE_MINIMO = 5; // Configurável

export default async function AlertasPage() {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  // Produtos com estoque baixo
  const produtosComEstoqueBaixo = await prisma.stockItem.findMany({
    where: {
      quantity: {
        lte: ESTOQUE_MINIMO,
      },
    },
    include: {
      product: {
        include: { category: true },
      },
      stock: true,
    },
    orderBy: { quantity: "asc" },
  });

  // Produtos sem estoque
  const produtosSemEstoque = await prisma.stockItem.findMany({
    where: {
      quantity: {
        equals: 0,
      },
    },
    include: {
      product: {
        include: { category: true },
      },
      stock: true,
    },
  });

  const unitLabels: Record<string, string> = {
    KG: "kg",
    METRO: "m",
    LITRO: "L",
    UNIDADE: "un",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <AlertCircle className="w-8 h-8 text-red-500" />
          Alertas de Estoque
        </h1>
        <p className="mt-1 text-gray-600">
          Produtos com quantidade baixa ou zerada
        </p>
      </div>

      {/* Produtos sem estoque */}
      {produtosSemEstoque.length > 0 && (
        <div className="bg-white rounded-lg border border-red-200 overflow-hidden">
          <div className="border-b p-4 sm:p-6 bg-red-50">
            <h2 className="text-lg font-semibold text-red-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Sem Estoque ({produtosSemEstoque.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900">
                    Produto
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900">
                    Estoque
                  </th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900">
                    Categoria
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {produtosSemEstoque.map((item) => (
                  <tr key={item.id} className="hover:bg-red-50">
                    <td className="px-4 sm:px-6 py-3 font-medium text-gray-900">
                      {item.product.name}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-red-600 font-semibold">
                      0 {unitLabels[item.product.unit]}
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-3 text-gray-600">
                      {item.product.category.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Produtos com estoque baixo */}
      {produtosComEstoqueBaixo.length > 0 && (
        <div className="bg-white rounded-lg border border-yellow-200 overflow-hidden">
          <div className="border-b p-4 sm:p-6 bg-yellow-50">
            <h2 className="text-lg font-semibold text-yellow-900 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Estoque Baixo &lt; {ESTOQUE_MINIMO} ({produtosComEstoqueBaixo.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900">
                    Produto
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-900">
                    Estoque
                  </th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900">
                    Categoria
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {produtosComEstoqueBaixo.map((item) => (
                  <tr key={item.id} className="hover:bg-yellow-50">
                    <td className="px-4 sm:px-6 py-3 font-medium text-gray-900">
                      {item.product.name}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right">
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                        {typeof item.quantity === "object" &&
                        item.quantity?.toNumber
                          ? item.quantity.toNumber().toFixed(2)
                          : Number(item.quantity).toFixed(2)}
                        {" "}
                        {unitLabels[item.product.unit]}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-3 text-gray-600">
                      {item.product.category.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {produtosSemEstoque.length === 0 &&
        produtosComEstoqueBaixo.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <p className="text-green-800 font-medium">
              ✓ Todos os produtos têm estoque adequado
            </p>
          </div>
        )}
    </div>
  );
}

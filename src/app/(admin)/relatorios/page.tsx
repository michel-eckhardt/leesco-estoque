import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function RelatoriosPage() {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  // Retiradas por usuário
  const withdrawalsByUser = await prisma.user.findMany({
    where: { role: "USER" },
    include: {
      withdrawals: {
        include: {
          product: {
            include: { category: true },
          },
          stock: true,
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      },
      stockAssignments: {
        include: { stock: true },
      },
    },
    orderBy: { name: "asc" },
  });

  // Resumo por categoria
  const categoryStats = await prisma.category.findMany({
    include: {
      products: {
        include: {
          withdrawals: true,
        },
      },
    },
  });

  const categoryWithdrawals = categoryStats.map((cat) => ({
    name: cat.name,
    totalWithdrawals: cat.products.reduce(
      (sum, p) => sum + p.withdrawals.length,
      0
    ),
  }));

  const unitLabels: Record<string, string> = {
    KG: "kg",
    METRO: "m",
    LITRO: "L",
    UNIDADE: "un",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Relatórios</h1>
        <p className="mt-1 text-gray-600">
          Análise de retiradas por usuário e categoria
        </p>
      </div>

      {/* Resumo por Categoria */}
      <div className="bg-white rounded-lg border">
        <div className="border-b p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Retiradas por Categoria</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Categoria
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  Retiradas
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categoryWithdrawals
                .sort((a, b) => b.totalWithdrawals - a.totalWithdrawals)
                .map((cat) => (
                  <tr key={cat.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-600">
                      {cat.totalWithdrawals}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalhado por Usuário */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Retiradas por Usuário</h2>
        {withdrawalsByUser.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg border overflow-hidden"
          >
            <div className="border-b p-4 sm:p-6 bg-gray-50">
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {user.withdrawals.length} retirada(s)
              </p>
            </div>

            {user.withdrawals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900">
                        Produto
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900">
                        Categoria
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-900">
                        Qtd
                      </th>
                      <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {user.withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-3 text-gray-900">
                          {w.product.name}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-gray-600">
                          {w.product.category.name}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-right text-gray-900">
                          {typeof w.quantity === "object" &&
                          w.quantity?.toNumber
                            ? w.quantity.toNumber().toFixed(2)
                            : Number(w.quantity).toFixed(2)}
                          {" "}
                          {unitLabels[w.product.unit]}
                        </td>
                        <td className="hidden sm:table-cell px-4 sm:px-6 py-3 text-gray-600 text-xs">
                          {formatDate(w.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Nenhuma retirada registrada
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

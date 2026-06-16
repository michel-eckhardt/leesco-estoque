import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WithdrawalForm } from "@/components/forms/withdrawal-form";
import { redirect } from "next/navigation";

export default async function RetiradaPage() {
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

  const products = stockItems.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    unit: item.product.unit,
    quantity: item.quantity.toNumber ? item.quantity.toNumber() : Number(item.quantity),
    category: item.product.category,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Registrar Retirada</h1>
        <p className="mt-1 text-gray-600">
          Estoque: <span className="font-medium">{userStocks[0].stock.name}</span>
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum produto disponível neste estoque</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border p-6">
          <WithdrawalForm stockId={stockId} products={products} />
        </div>
      )}
    </div>
  );
}

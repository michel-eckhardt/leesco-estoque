import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/tables/products-table";
import { getProducts } from "@/actions/products";
import { Plus } from "lucide-react";

export default async function ProdutosPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="mt-1 text-gray-600">
            Gerenciar produtos e categorias
          </p>
        </div>
        <Link href="/produtos/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}

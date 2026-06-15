import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/forms/product-form";
import { getProduct } from "@/actions/products";
import { ArrowLeft } from "lucide-react";

export default async function EditarProdutoPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Produto não encontrado</h1>
        <Link href="/produtos">
          <Button className="mt-4">Voltar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/produtos">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Produto</h1>
          <p className="mt-1 text-gray-600">{product.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}

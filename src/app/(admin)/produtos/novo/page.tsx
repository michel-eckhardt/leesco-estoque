import { ProductForm } from "@/components/forms/product-form";

export default function NovoProdutoPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Novo Produto</h1>
        <p className="mt-1 text-gray-600">
          Cadastrar um novo produto no estoque
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <ProductForm />
      </div>
    </div>
  );
}

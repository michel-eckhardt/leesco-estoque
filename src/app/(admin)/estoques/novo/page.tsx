import { StockForm } from "@/components/forms/stock-form";

export default function NovoEstoquePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Novo Estoque</h1>
        <p className="mt-1 text-gray-600">
          Criar um novo estoque para sua empresa
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <StockForm />
      </div>
    </div>
  );
}

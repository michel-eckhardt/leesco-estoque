import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "@/components/forms/category-form";
import { CategoriesTable } from "@/components/tables/categories-table";
import { getCategoriesWithCount } from "@/actions/products";
import { Plus } from "lucide-react";

export default async function CategoriasPage() {
  const categories = await getCategoriesWithCount();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Categorias</h1>
          <p className="mt-1 text-gray-600">Gerenciar categorias de produtos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Formulário */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Nova Categoria</h2>
            <CategoryForm />
          </div>
        </div>

        {/* Tabela */}
        <div className="lg:col-span-2">
          <CategoriesTable categories={categories} />
        </div>
      </div>
    </div>
  );
}

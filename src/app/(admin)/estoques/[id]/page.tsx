"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StockItemsTable } from "@/components/tables/stock-items-table";
import { StockItemForm } from "@/components/forms/stock-item-form";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { getStockItems } from "@/actions/stock-items";
import { getStock } from "@/actions/stocks";

export default function EstoqueDetalhePage({
  params,
}: {
  params: { id: string };
}) {
  const [stock, setStock] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stockData, itemsData] = await Promise.all([
          getStock(params.id),
          getStockItems(params.id),
        ]);
        setStock(stockData);
        setItems(itemsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  const handleRefresh = async () => {
    try {
      const itemsData = await getStockItems(params.id);
      setItems(itemsData);
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/estoques">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{stock.name}</h1>
          <p className="text-sm text-gray-600">
            Criado em {formatDate(stock.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Produtos */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Produtos no Estoque</h2>
          <StockItemsTable
            stockId={params.id}
            items={items}
            onEdit={(item) => {
              setEditingItem(item);
              setShowForm(true);
            }}
            onDelete={handleRefresh}
          />
        </div>

        {/* Formulário */}
        <div className="space-y-6">
          {showForm ? (
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? "Atualizar Quantidade" : "Adicionar Produto"}
              </h3>
              <StockItemForm
                stockId={params.id}
                item={editingItem}
                onSuccess={handleRefresh}
                onCancel={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
              />
            </div>
          ) : (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full"
            >
              + Adicionar Produto
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Link href={`/estoques/${stock.id}/editar`}>
          <Button variant="outline">Editar Estoque</Button>
        </Link>
      </div>
    </div>
  );
}

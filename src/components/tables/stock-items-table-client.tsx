"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StockItemsTable } from "@/components/tables/stock-items-table";
import { StockItemForm } from "@/components/forms/stock-item-form";
import { getStockItems } from "@/actions/stock-items";

interface StockItemsTableClientProps {
  stockId: string;
  initialItems: Array<any>;
}

export function StockItemsTableClient({
  stockId,
  initialItems,
}: StockItemsTableClientProps) {
  const [items, setItems] = useState(initialItems);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const handleRefresh = async () => {
    try {
      const itemsData = await getStockItems(stockId);
      setItems(itemsData);
      setShowForm(false);
      setEditingItem(null);
      toast.success("Atualizado com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar");
      console.error("Erro ao atualizar:", error);
    }
  };

  return (
    <div className="space-y-4">
      {showForm && (
        <div className="bg-white rounded-lg border p-4 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold">
            {editingItem ? "Atualizar Quantidade" : "Adicionar Produto"}
          </h3>
          <StockItemForm
            stockId={stockId}
            item={editingItem}
            onSuccess={handleRefresh}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        </div>
      )}

      <div className="flex gap-2">
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto"
          >
            + Adicionar Produto
          </Button>
        )}
      </div>

      <StockItemsTable
        stockId={stockId}
        items={items}
        onEdit={(item) => {
          setEditingItem(item);
          setShowForm(true);
        }}
        onDelete={handleRefresh}
      />
    </div>
  );
}

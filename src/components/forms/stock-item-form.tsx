"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addProductToStock,
  adjustStockQuantity,
} from "@/actions/stock-items";
import { getProducts } from "@/actions/products";
import { Loader2 } from "lucide-react";

interface StockItemFormProps {
  stockId: string;
  item?: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
    };
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StockItemForm({
  stockId,
  item,
  onSuccess,
  onCancel,
}: StockItemFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [formData, setFormData] = useState({
    productId: item?.product.id || "",
    quantity: item?.quantity.toString() || "",
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const prods = await getProducts();
        setProducts(prods.map((p) => ({ id: p.id, name: p.name })));
      } catch (err) {
        toast.error("Erro ao carregar produtos");
      }
    };
    loadProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSelectChange = (value: string | null) => {
    if (value) {
      setFormData((prev) => ({ ...prev, productId: value }));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (item?.id) {
        await adjustStockQuantity(stockId, item.id, {
          quantity: parseFloat(formData.quantity),
        });
        toast.success("Quantidade atualizada");
      } else {
        await addProductToStock(stockId, {
          productId: formData.productId,
          quantity: parseFloat(formData.quantity),
        });
        toast.success("Produto adicionado ao estoque");
      }

      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao salvar";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {!item && (
        <div className="space-y-2">
          <Label htmlFor="productId">Produto</Label>
          <Select
            value={formData.productId}
            onValueChange={handleSelectChange}
            disabled={isLoading || !!item}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um produto" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="quantity">
          Quantidade {item && "(Atualizar)"}
        </Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          step="0.001"
          placeholder="0.000"
          value={formData.quantity}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {item ? "Atualizar" : "Adicionar"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}

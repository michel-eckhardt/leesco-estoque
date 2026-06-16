"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createWithdrawal } from "@/actions/withdrawals";
import { Loader2 } from "lucide-react";

interface WithdrawalFormProps {
  stockId: string;
  products: Array<{
    id: string;
    name: string;
    unit: string;
    quantity: number;
    category: {
      name: string;
    };
  }>;
}

export function WithdrawalForm({ stockId, products }: WithdrawalFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    reason: "",
  });
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null);

  const handleProductChange = (value: string | null) => {
    if (value) {
      setFormData((prev) => ({ ...prev, productId: value }));
      const product = products.find((p) => p.id === value);
      setSelectedProduct(product || null);
      setError(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const quantity = parseFloat(formData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error("Quantidade deve ser um número maior que zero");
      }

      await createWithdrawal(stockId, {
        productId: formData.productId,
        quantity,
        reason: formData.reason || undefined,
      });

      toast.success("Retirada registrada com sucesso");
      setFormData({ productId: "", quantity: "", reason: "" });
      setSelectedProduct(null);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao registrar retirada";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const unitLabels: Record<string, string> = {
    KG: "kg",
    METRO: "m",
    LITRO: "L",
    UNIDADE: "un",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="product">Produto</Label>
        <Select
          value={formData.productId}
          onValueChange={handleProductChange}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um produto" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                <div className="flex items-center gap-2">
                  <span>{product.name}</span>
                  <span className="text-gray-500 text-sm">
                    ({product.quantity.toString()} {unitLabels[product.unit]})
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProduct && (
        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Categoria</p>
              <p className="font-medium">{selectedProduct.category.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Disponível</p>
              <p className="font-medium">
                {selectedProduct.quantity.toString()} {unitLabels[selectedProduct.unit]}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantidade</Label>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              id="quantity"
              name="quantity"
              type="number"
              step="0.001"
              placeholder="0,000"
              value={formData.quantity}
              onChange={handleChange}
              required
              disabled={isLoading || !selectedProduct}
            />
          </div>
          {selectedProduct && (
            <span className="text-gray-600 font-medium">
              {unitLabels[selectedProduct.unit]}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Motivo (opcional)</Label>
        <Textarea
          id="reason"
          name="reason"
          placeholder="Descreva o motivo da retirada..."
          value={formData.reason}
          onChange={handleChange}
          disabled={isLoading}
          rows={3}
          maxLength={255}
        />
        <p className="text-xs text-gray-500">
          {formData.reason.length}/255
        </p>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading || !selectedProduct}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Registrar Retirada
        </Button>
      </div>
    </form>
  );
}

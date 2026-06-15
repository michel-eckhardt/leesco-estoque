"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStock, updateStock } from "@/actions/stocks";
import { Loader2 } from "lucide-react";

interface StockFormProps {
  stock?: {
    id: string;
    name: string;
  };
  onSuccess?: () => void;
}

export function StockForm({ stock, onSuccess }: StockFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: stock?.name || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (stock?.id) {
        await updateStock(stock.id, formData);
        toast.success("Estoque atualizado com sucesso");
      } else {
        await createStock(formData);
        toast.success("Estoque criado com sucesso");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/estoques");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao salvar estoque";
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

      <div className="space-y-2">
        <Label htmlFor="name">Nome do Estoque</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Ex: Estoque Principal"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {stock?.id ? "Atualizar" : "Criar"} Estoque
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/estoques")}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

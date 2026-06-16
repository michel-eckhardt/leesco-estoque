"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { createUser, updateUser } from "@/actions/users";
import { getStocks } from "@/actions/stocks";
import { Loader2, X } from "lucide-react";

interface UserFormProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    stockAssignments: Array<{
      stock: { id: string; name: string };
    }>;
  };
  onSuccess?: () => void;
}

const ROLES = [
  { value: "ADMIN", label: "Administrador" },
  { value: "USER", label: "Usuário" },
];

export function UserForm({ user, onSuccess }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stocks, setStocks] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "USER",
    stockIds: user?.stockAssignments.map((s) => s.stock.id) || [],
  });

  useEffect(() => {
    const loadStocks = async () => {
      try {
        const s = await getStocks();
        setStocks(s);
      } catch (err) {
        toast.error("Erro ao carregar estoques");
      }
    };
    loadStocks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSelectChange = (value: string | null) => {
    if (value) {
      setFormData((prev) => ({ ...prev, role: value }));
      setError(null);
    }
  };

  const toggleStock = (stockId: string) => {
    setFormData((prev) => ({
      ...prev,
      stockIds: prev.stockIds.includes(stockId)
        ? prev.stockIds.filter((id) => id !== stockId)
        : [...prev.stockIds, stockId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        password: formData.password || undefined,
      };

      if (user?.id) {
        await updateUser(user.id, submitData);
        toast.success("Usuário atualizado com sucesso");
      } else {
        await createUser(submitData);
        toast.success("Usuário criado com sucesso");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/usuarios");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao salvar usuário";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="João Silva"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="joao@empresa.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">
            Senha {user && "(deixe vazio para manter atual)"}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={formData.role}
            onValueChange={handleSelectChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.role === "USER" && (
        <div className="space-y-2">
          <Label>Estoques Designados</Label>
          <div className="space-y-2">
            {stocks.map((stock) => (
              <div
                key={stock.id}
                className={`p-3 border rounded cursor-pointer transition-colors ${
                  formData.stockIds.includes(stock.id)
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white hover:bg-gray-50"
                }`}
                onClick={() => toggleStock(stock.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{stock.name}</span>
                  {formData.stockIds.includes(stock.id) && (
                    <span className="text-blue-600">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {user?.id ? "Atualizar" : "Criar"} Usuário
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/usuarios")}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

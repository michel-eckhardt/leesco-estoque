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
import { ImageUpload } from "@/components/forms/image-upload";
import { createProduct, updateProduct, getCategories } from "@/actions/products";
import { Loader2 } from "lucide-react";

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    unit: string;
    categoryId: string;
    photoUrl?: string | null;
  };
  onSuccess?: () => void;
}

const UNITS = [
  { value: "KG", label: "Quilograma (KG)" },
  { value: "METRO", label: "Metro (M)" },
  { value: "LITRO", label: "Litro (L)" },
  { value: "UNIDADE", label: "Unidade" },
];

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [photoData, setPhotoData] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: product?.name ?? "",
    unit: product?.unit ?? "UNIDADE",
    categoryId: product?.categoryId ?? "",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        toast.error("Erro ao carregar categorias");
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data: any = { ...formData };

      if (photoData) {
        const reader = new FileReader();
        reader.onload = async () => {
          data.photoUrl = reader.result as string;
          await submitForm(data);
        };
        reader.readAsDataURL(photoData.file);
      } else {
        await submitForm(data);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao salvar produto";
      setError(message);
      toast.error(message);
      setIsLoading(false);
    }
  };

  const submitForm = async (data: any) => {
    try {
      if (product?.id) {
        await updateProduct(product.id, data);
        toast.success("Produto atualizado com sucesso");
      } else {
        await createProduct(data);
        toast.success("Produto criado com sucesso");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/produtos");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao salvar produto";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nome do Produto</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Ex: Parafuso M8"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Categoria</Label>
          <Select
            value={formData.categoryId ?? ""}
            onValueChange={(value) => handleSelectChange("categoryId", value as string)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unidade de Medida</Label>
          <Select
            value={formData.unit ?? "UNIDADE"}
            onValueChange={(value) => handleSelectChange("unit", value as string)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ImageUpload
        onImageSelected={(file, preview) => {
          setPhotoData({ file, preview });
        }}
        currentImageUrl={product?.photoUrl}
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product?.id ? "Atualizar" : "Criar"} Produto
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/produtos")}
          disabled={isLoading}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date, formatStr: string = "PPP 'às' HH:mm"): string {
  return format(date, formatStr, { locale: ptBR })
}

export function formatUnit(unit: string): string {
  const units: Record<string, string> = {
    KG: "Quilograma",
    METRO: "Metro",
    LITRO: "Litro",
    UNIDADE: "Unidade",
  }
  return units[unit] || unit
}

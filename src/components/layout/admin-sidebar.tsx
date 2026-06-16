"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Package,
  Users,
  Warehouse,
  LogOut,
  Menu,
  X,
  FileText,
  AlertCircle,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/logo";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    href: "/estoques",
    label: "Estoques",
    icon: Warehouse,
  },
  {
    href: "/produtos",
    label: "Produtos",
    icon: Package,
  },
  {
    href: "/categorias",
    label: "Categorias",
    icon: Package,
  },
  {
    href: "/usuarios",
    label: "Usuários",
    icon: Users,
  },
  {
    href: "/alertas",
    label: "Alertas",
    icon: AlertCircle,
  },
  {
    href: "/relatorios",
    label: "Relatórios",
    icon: FileText,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative w-64 border-r bg-white h-screen z-30 transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center border-b px-6">
          <Logo />
        </div>

        <nav className="space-y-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => signOut({ redirectTo: "/login" })}
          >
            <LogOut className="h-4 w-4" />
            <span className="truncate">Sair</span>
          </Button>
        </div>
      </aside>
    </>
  );
}

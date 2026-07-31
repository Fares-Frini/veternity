"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/inventory/stock", label: "Stock médicament" },
  { href: "/inventory/ventes", label: "Vente" },
  { href: "/inventory/achats", label: "Achat" },
  { href: "/inventory/factures", label: "Factures" },
  { href: "/inventory/fournisseurs", label: "Fournisseurs" },
] as const;

export function InventoryTabs() {
  const pathname = usePathname();

  return (
    <nav className="grid grid-cols-5 divide-x divide-border border-b border-border">
      {TABS.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative flex items-center justify-center px-2 py-3.5 text-center text-sm font-medium whitespace-nowrap transition-colors",
              isActive ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {tab.label}
            {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />}
          </Link>
        );
      })}
    </nav>
  );
}

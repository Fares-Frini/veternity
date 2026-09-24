"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useInventoryVersion } from "./inventory-store";
import { STOCK, stockStatus } from "./stock-data";
import { SUPPLIER_INVOICES } from "./supplier-invoices-data";

export function InventoryTabs() {
  const pathname = usePathname();
  useInventoryVersion();

  const alerts = STOCK.filter((s) => stockStatus(s) !== "En stock").length;
  const toReview = SUPPLIER_INVOICES.filter((i) => i.status === "À vérifier").length;

  const tabs = [
    { href: "/inventory/stock", label: "Stock", count: alerts, countLabel: "alertes de stock" },
    { href: "/inventory/ventes-achats", label: "Ventes & achats" },
    { href: "/inventory/factures", label: "Factures", count: toReview, countLabel: "factures à vérifier" },
    { href: "/inventory/fournisseurs", label: "Fournisseurs" },
  ];

  return (
    <nav className="grid grid-cols-2 divide-x divide-border border-b border-border sm:grid-cols-4">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative flex items-center justify-center gap-2 px-2 py-3.5 text-center text-sm font-medium whitespace-nowrap transition-colors",
              isActive ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {tab.label}
            {!!tab.count && (
              <span
                aria-label={`${tab.count} ${tab.countLabel}`}
                className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-status-warning-bg px-1.5 text-[11px] font-bold text-status-warning tabular-nums"
              >
                {tab.count}
              </span>
            )}
            {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />}
          </Link>
        );
      })}
    </nav>
  );
}

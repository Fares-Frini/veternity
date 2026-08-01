import type { ReactNode } from "react";
import { InventoryBanner } from "./_components/inventory-banner";
import { InventoryTabs } from "./_components/inventory-tabs";

export default function InventoryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden border border-border bg-card shadow-sm">
      <InventoryBanner />
      <InventoryTabs />
      <div className="p-6">{children}</div>
    </div>
  );
}

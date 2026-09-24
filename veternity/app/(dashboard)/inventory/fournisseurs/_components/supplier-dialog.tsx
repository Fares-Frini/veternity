"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Call02Icon, Mail01Icon, ShoppingCartAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useInventoryVersion } from "../../_components/inventory-store";
import { DetailHeader, Fact, SectionTitle, formatAmount, formatLongDate, formatShortDate } from "../../_components/inventory-ui";
import { STATUS_BADGE, STOCK, formatQuantity, stockStatus } from "../../_components/stock-data";
import type { Supplier } from "../../_components/suppliers-data";
import { PURCHASES, tradeTotal } from "../../_components/trade-data";
import { PURCHASE_BADGE } from "../../ventes-achats/_components/trade-columns";
import { supplierMetrics } from "./supplier-metrics";

export function SupplierDialog({ supplier, onClose }: { supplier: Supplier | null; onClose: () => void }) {
  useInventoryVersion();
  return (
    <Dialog open={supplier !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-2xl"
        showCloseButton={false}
      >
        {supplier && <SupplierDetail supplier={supplier} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function SupplierDetail({ supplier, onClose }: { supplier: Supplier; onClose: () => void }) {
  const metrics = supplierMetrics(supplier.id);
  const products = STOCK.filter((s) => s.supplierId === supplier.id).sort(
    (a, b) => a.quantity / Math.max(1, a.alertThreshold) - b.quantity / Math.max(1, b.alertThreshold),
  );
  const orders = PURCHASES.filter((p) => p.supplierId === supplier.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <>
      <DetailHeader
        leading={
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary-foreground/15 text-sm font-bold text-primary-foreground">
              {supplier.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        }
        title={supplier.name}
        subtitle={`${supplier.kind} · ${supplier.city} · partenaire depuis ${new Date(supplier.since).getFullYear()}`}
        onClose={onClose}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">
        <div className="grid grid-cols-1 gap-4 rounded-xl bg-muted p-4 sm:grid-cols-2">
          <Fact label="Contact commercial">{supplier.contact}</Fact>
          <Fact label="Téléphone">
            <a href={`tel:${supplier.phone.replace(/\s/g, "")}`} className="tabular-nums hover:underline">
              {supplier.phone}
            </a>
          </Fact>
          <Fact label="Email">
            <a href={`mailto:${supplier.email}`} className="hover:underline">
              {supplier.email}
            </a>
          </Fact>
          <Fact label="Adresse">{supplier.address}</Fact>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Fact label="Livraison">{supplier.leadTimeDays} j ouvrés</Fact>
          <Fact label="Paiement">à {supplier.paymentTermsDays} jours</Fact>
          <Fact label="Minimum">{formatAmount(supplier.minimumOrder)}</Fact>
          <Fact label="Achats 12 mois">
            <span className="tabular-nums">{formatAmount(metrics.yearTotal)}</span>
            {metrics.due > 0 && (
              <span className="block text-xs font-medium text-status-warning tabular-nums">{formatAmount(metrics.due)} à régler</span>
            )}
          </Fact>
        </div>

        <section className="flex flex-col gap-2">
          <SectionTitle aside={<span className="text-xs text-muted-foreground">{products.length} références</span>}>
            Produits fournis
          </SectionTitle>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {products.map((p) => {
              const status = stockStatus(p);
              return (
                <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <div className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate font-medium text-foreground">{p.name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatQuantity(p, p.quantity)} · achat {formatAmount(p.purchasePrice)}
                    </span>
                  </div>
                  {status !== "En stock" && <Badge variant={STATUS_BADGE[status]}>{status}</Badge>}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <SectionTitle>Dernières commandes</SectionTitle>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune commande pour l&apos;instant.</p>
          ) : (
            <ul className="flex flex-col">
              {orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 border-b border-border py-2 text-sm last:border-0">
                  <span className="w-24 shrink-0 text-muted-foreground tabular-nums">{formatShortDate(o.date)}</span>
                  <span className="min-w-0 flex-1 font-mono text-xs text-foreground">{o.id}</span>
                  <Badge variant={PURCHASE_BADGE[o.status]}>{o.status}</Badge>
                  <span className="w-24 shrink-0 text-right font-semibold text-foreground tabular-nums">{formatAmount(tradeTotal(o.lines))}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/50 px-6 py-4">
        <span className="text-sm text-muted-foreground">
          {metrics.lastOrder ? `Dernière commande le ${formatLongDate(metrics.lastOrder)}` : "Aucune commande"}
        </span>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="icon" aria-label={`Appeler ${supplier.name}`}>
            <a href={`tel:${supplier.phone.replace(/\s/g, "")}`}>
              <HugeiconsIcon icon={Call02Icon} strokeWidth={2.2} />
            </a>
          </Button>
          <Button asChild variant="outline" size="icon" aria-label={`Écrire à ${supplier.name}`}>
            <a href={`mailto:${supplier.email}`}>
              <HugeiconsIcon icon={Mail01Icon} strokeWidth={2.2} />
            </a>
          </Button>
          <Button asChild>
            <Link href={`/inventory/ventes-achats?commander=${supplier.id}`}>
              <HugeiconsIcon icon={ShoppingCartAdd01Icon} strokeWidth={2.2} data-icon="inline-start" />
              Nouvelle commande
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}

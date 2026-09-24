"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PackageReceiveIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useInventoryVersion } from "../../_components/inventory-store";
import { DetailHeader, Fact, formatAmount, formatLongDate, formatShortDate } from "../../_components/inventory-ui";
import { findStockItem, formatQuantity } from "../../_components/stock-data";
import { findSupplier } from "../../_components/suppliers-data";
import { markPurchasePaid, markSalePaid, tradeTotal, type Purchase, type Sale, type TradeLine } from "../../_components/trade-data";
import { PURCHASE_BADGE } from "./trade-columns";

export type TradeSelection = { kind: "sale"; sale: Sale } | { kind: "purchase"; purchase: Purchase };

function LinesTable({ lines, showReceived }: { lines: TradeLine[]; showReceived?: boolean }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-left text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          <th className="pb-2 font-semibold">Produit</th>
          <th className="pb-2 text-right font-semibold">Qté</th>
          {showReceived && <th className="pb-2 text-right font-semibold">Reçu</th>}
          <th className="pb-2 text-right font-semibold">Prix unitaire</th>
          <th className="pb-2 text-right font-semibold">Total</th>
        </tr>
      </thead>
      <tbody>
        {lines.map((l, i) => {
          const p = findStockItem(l.productId);
          const complete = (l.receivedQuantity ?? 0) >= l.quantity;
          return (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="py-2.5">
                <span className="font-medium text-foreground">{p?.name ?? l.productId}</span>
                {p && <span className="block text-xs text-muted-foreground">{p.form}</span>}
              </td>
              <td className="py-2.5 text-right tabular-nums">{p ? formatQuantity(p, l.quantity) : l.quantity}</td>
              {showReceived && (
                <td className={`py-2.5 text-right tabular-nums ${complete ? "text-muted-foreground" : "font-medium text-status-warning"}`}>
                  {l.receivedQuantity ?? 0}
                </td>
              )}
              <td className="py-2.5 text-right tabular-nums">{formatAmount(l.unitPrice)}</td>
              <td className="py-2.5 text-right font-semibold tabular-nums">{formatAmount(l.quantity * l.unitPrice)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function TradeDetailDialog({ selection, onClose }: { selection: TradeSelection | null; onClose: () => void }) {
  useInventoryVersion();

  return (
    <Dialog open={selection !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-2xl"
        showCloseButton={false}
      >
        {selection?.kind === "sale" && <SaleDetail sale={selection.sale} onClose={onClose} />}
        {selection?.kind === "purchase" && <PurchaseDetail purchase={selection.purchase} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function SaleDetail({ sale, onClose }: { sale: Sale; onClose: () => void }) {
  const total = tradeTotal(sale.lines);
  const margin = sale.lines.reduce((sum, l) => sum + (l.unitPrice - (findStockItem(l.productId)?.purchasePrice ?? 0)) * l.quantity, 0);

  return (
    <>
      <DetailHeader
        title={`Vente ${sale.id}`}
        subtitle={`${sale.client} · ${formatLongDate(sale.date)}`}
        aside={<Badge variant={sale.paid ? "success" : "warning"}>{sale.paid ? "Payée" : "À régler"}</Badge>}
        onClose={onClose}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted p-4 sm:grid-cols-4">
          <Fact label="Origine">
            {sale.channel}
            {sale.reference && <span className="block text-xs font-normal text-muted-foreground">Facture {sale.reference}</span>}
          </Fact>
          <Fact label="Règlement">{sale.paymentMethod}</Fact>
          <Fact label="Montant">
            <span className="tabular-nums">{formatAmount(total)}</span>
          </Fact>
          <Fact label="Marge brute">
            <span className="tabular-nums">{formatAmount(margin)}</span>
            <span className="block text-xs font-normal text-muted-foreground tabular-nums">
              {total ? Math.round((margin / total) * 100) : 0} % du montant
            </span>
          </Fact>
        </div>
        <LinesTable lines={sale.lines} />
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-muted/50 px-6 py-4">
        <span className="text-sm text-muted-foreground">Sortie de stock enregistrée le {formatShortDate(sale.date)}</span>
        {!sale.paid && (
          <Button
            type="button"
            onClick={() => markSalePaid(sale.id)}
          >
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2.4} data-icon="inline-start" />
            Marquer comme payée
          </Button>
        )}
      </div>
    </>
  );
}

function PurchaseDetail({ purchase, onClose }: { purchase: Purchase; onClose: () => void }) {
  const supplier = findSupplier(purchase.supplierId);
  const total = tradeTotal(purchase.lines);

  return (
    <>
      <DetailHeader
        title={`Commande ${purchase.id}`}
        subtitle={`${supplier?.name ?? "Fournisseur"} · ${formatLongDate(purchase.date)}`}
        aside={<Badge variant={PURCHASE_BADGE[purchase.status]}>{purchase.status}</Badge>}
        onClose={onClose}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted p-4 sm:grid-cols-4">
          <Fact label="Fournisseur">
            {supplier?.name ?? "—"}
            {supplier && <span className="block text-xs font-normal text-muted-foreground">{supplier.phone}</span>}
          </Fact>
          <Fact label="Livraison">
            {purchase.status === "Reçue" ? "Reçue" : purchase.expectedDate ? `Prévue le ${formatShortDate(purchase.expectedDate)}` : "—"}
          </Fact>
          <Fact label="Montant">
            <span className="tabular-nums">{formatAmount(total)}</span>
          </Fact>
          <Fact label="Paiement">
            {purchase.paid ? "Réglé" : "À régler"}
            {!purchase.paid && supplier && (
              <span className="block text-xs font-normal text-muted-foreground">à {supplier.paymentTermsDays} jours</span>
            )}
          </Fact>
        </div>
        <LinesTable lines={purchase.lines} showReceived />
        {purchase.supplierInvoiceId && (
          <p className="text-sm text-muted-foreground">
            Réceptionnée à partir de la facture{" "}
            <Link href="/inventory/factures" className="font-medium text-foreground underline underline-offset-3">
              {purchase.supplierInvoiceId}
            </Link>
            .
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-muted/50 px-6 py-4">
        {!purchase.paid && (
          <Button
            type="button"
            variant="outline"
            onClick={() => markPurchasePaid(purchase.id)}
          >
            Marquer comme réglée
          </Button>
        )}
        {purchase.status !== "Reçue" && (
          <Button asChild>
            <Link href="/inventory/factures">
              <HugeiconsIcon icon={PackageReceiveIcon} strokeWidth={2.2} data-icon="inline-start" />
              Réceptionner avec la facture
            </Link>
          </Button>
        )}
      </div>
    </>
  );
}

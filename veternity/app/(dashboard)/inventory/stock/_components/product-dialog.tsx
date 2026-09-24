"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { ShoppingCartAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import {
  DetailHeader,
  Fact,
  SectionTitle,
  formatAmount,
  formatShortDate,
} from "../../_components/inventory-ui";
import { useInventoryVersion } from "../../_components/inventory-store";
import {
  EXPIRY_WARNING_DAYS,
  STATUS_BADGE,
  STOCK_MOVEMENTS,
  adjustStock,
  daysUntil,
  formatQuantity,
  lotsByExpiry,
  stockStatus,
  type StockItem,
} from "../../_components/stock-data";
import { findSupplier } from "../../_components/suppliers-data";
import { PURCHASES } from "../../_components/trade-data";

const OUT_REASONS = ["Écart d'inventaire", "Casse", "Péremption", "Usage interne"];
const IN_REASONS = ["Écart d'inventaire", "Retour client", "Échantillon fournisseur"];

function AdjustForm({ item, onDone }: { item: StockItem; onDone: () => void }) {
  const [direction, setDirection] = useState<"in" | "out">("out");
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState(OUT_REASONS[0]);
  const [lot, setLot] = useState("");
  const [expiry, setExpiry] = useState("");

  const qty = Number.parseInt(quantity, 10) || 0;
  const tooMuch = direction === "out" && qty > item.quantity;
  const valid = qty > 0 && !tooMuch && (direction === "out" || lot.trim() !== "");

  const save = () => {
    if (!valid) return;
    adjustStock(item.id, direction === "in" ? qty : -qty, {
      reason: reason === "Péremption" ? "Péremption" : "Ajustement",
      reference: reason,
      lot: direction === "in" ? { lot: lot.trim(), expiry } : undefined,
    });
    onDone();
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/50 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_7rem_1fr]">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Mouvement</Label>
          <ToggleGroup
            type="single"
            variant="outline"
            spacing={0}
            value={direction}
            onValueChange={(v) => {
              if (!v) return;
              setDirection(v as "in" | "out");
              setReason((v === "in" ? IN_REASONS : OUT_REASONS)[0]);
            }}
            className="bg-card"
          >
            <ToggleGroupItem value="out" className="h-9 px-3 data-[state=on]:bg-primary/12 data-[state=on]:font-semibold">
              Sortie
            </ToggleGroupItem>
            <ToggleGroupItem value="in" className="h-9 px-3 data-[state=on]:bg-primary/12 data-[state=on]:font-semibold">
              Entrée
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="adjust-qty" className="text-xs">
            Quantité
          </Label>
          <Input
            id="adjust-qty"
            type="number"
            min="1"
            inputMode="numeric"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            aria-invalid={tooMuch}
            className="h-9 bg-card tabular-nums"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Motif</Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="h-9! w-full bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(direction === "in" ? IN_REASONS : OUT_REASONS).map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {direction === "in" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="adjust-lot" className="text-xs">
              Numéro de lot
            </Label>
            <Input id="adjust-lot" value={lot} onChange={(e) => setLot(e.target.value)} placeholder="Ex : NB26A" className="h-9 bg-card" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="adjust-expiry" className="text-xs">
              Péremption
            </Label>
            <Input id="adjust-expiry" type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="h-9 bg-card" />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <span className={cn("text-xs", tooMuch ? "font-medium text-status-danger" : "text-muted-foreground")}>
          {tooMuch
            ? `Seulement ${formatQuantity(item, item.quantity)} en stock.`
            : direction === "out"
              ? "Retiré du lot qui périme le plus tôt."
              : "Ajouté au lot indiqué, créé s'il n'existe pas."}
        </span>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onDone}>
            Annuler
          </Button>
          <Button type="button" size="sm" disabled={!valid} onClick={save}>
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProductDialog({ item, onOpenChange }: { item: StockItem | null; onOpenChange: (open: boolean) => void }) {
  useInventoryVersion();
  const [adjusting, setAdjusting] = useState(false);

  const close = () => {
    setAdjusting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={item !== null} onOpenChange={(open) => (open ? onOpenChange(true) : close())}>
      <DialogContent
        className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-2xl"
        showCloseButton={false}
      >
        {item && <ProductDetail item={item} adjusting={adjusting} setAdjusting={setAdjusting} onClose={close} />}
      </DialogContent>
    </Dialog>
  );
}

function ProductDetail({
  item,
  adjusting,
  setAdjusting,
  onClose,
}: {
  item: StockItem;
  adjusting: boolean;
  setAdjusting: (v: boolean) => void;
  onClose: () => void;
}) {
  const status = stockStatus(item);
  const supplier = findSupplier(item.supplierId);
  const margin = item.unitPrice > 0 ? Math.round(((item.unitPrice - item.purchasePrice) / item.unitPrice) * 100) : 0;
  const movements = STOCK_MOVEMENTS.filter((m) => m.productId === item.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);
  const pendingOrder = PURCHASES.find(
    (p) => p.status !== "Reçue" && p.lines.some((l) => l.productId === item.id && (l.receivedQuantity ?? 0) < l.quantity),
  );

  return (
    <>
      <DetailHeader
        title={item.name}
        subtitle={`${item.category} · ${item.form} · #${item.id}`}
        aside={<Badge variant={STATUS_BADGE[status]} className="shrink-0">{status}</Badge>}
        onClose={onClose}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted p-4 sm:grid-cols-4">
          <Fact label="En stock">
            <span className={cn("tabular-nums", item.quantity <= item.alertThreshold && "text-status-warning")}>
              {formatQuantity(item, item.quantity)}
            </span>
            <span className="block text-xs font-normal text-muted-foreground">Seuil {item.alertThreshold}</span>
          </Fact>
          <Fact label="Emplacement">{item.location}</Fact>
          <Fact label="Prix">
            <span className="tabular-nums">{formatAmount(item.unitPrice)}</span>
            <span className="block text-xs font-normal text-muted-foreground tabular-nums">
              achat {formatAmount(item.purchasePrice)} · marge&nbsp;{margin}&nbsp;%
            </span>
          </Fact>
          <Fact label="Fournisseur">
            {supplier?.name ?? "—"}
            {supplier && (
              <span className="block text-xs font-normal text-muted-foreground">Livraison en {supplier.leadTimeDays} j</span>
            )}
          </Fact>
        </div>

        {pendingOrder && (
          <p className="rounded-lg bg-status-info-bg px-3 py-2 text-sm text-status-info">
            Commande {pendingOrder.id} en cours
            {pendingOrder.expectedDate && ` · livraison prévue le ${formatShortDate(pendingOrder.expectedDate)}`}
          </p>
        )}

        <section className="flex flex-col gap-2">
          <SectionTitle aside={<span className="text-xs text-muted-foreground">Sorties : le plus proche de la péremption d&apos;abord</span>}>
            Lots
          </SectionTitle>
          {item.lots.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-muted-foreground">
              Aucun lot en stock.
            </p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {lotsByExpiry(item).map((lot) => {
                const days = lot.expiry ? daysUntil(lot.expiry) : null;
                return (
                  <li key={lot.lot} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                    <span className="font-mono text-foreground">{lot.lot}</span>
                    <span className="flex-1 text-muted-foreground tabular-nums">
                      {lot.expiry ? `Péremption ${formatShortDate(lot.expiry)}` : "Sans péremption"}
                      {days !== null && days < 0 && <span className="ml-2 font-medium text-status-danger">périmé</span>}
                      {days !== null && days >= 0 && days <= EXPIRY_WARNING_DAYS && (
                        <span className="ml-2 font-medium text-status-warning">dans {days} j</span>
                      )}
                    </span>
                    <span className="font-semibold text-foreground tabular-nums">{formatQuantity(item, lot.quantity)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-2">
          <SectionTitle
            aside={
              !adjusting && (
                <Button type="button" variant="outline" size="xs" onClick={() => setAdjusting(true)}>
                  Ajuster le stock
                </Button>
              )
            }
          >
            Derniers mouvements
          </SectionTitle>
          {adjusting && <AdjustForm item={item} onDone={() => setAdjusting(false)} />}
          {movements.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun mouvement enregistré.</p>
          ) : (
            <ul className="flex flex-col">
              {movements.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 border-b border-border py-2 text-sm last:border-0">
                  <span className="w-24 shrink-0 text-muted-foreground tabular-nums">{formatShortDate(m.date)}</span>
                  <span className="min-w-0 flex-1 truncate text-foreground">
                    {m.reason}
                    {m.reference && <span className="text-muted-foreground"> · {m.reference}</span>}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-semibold tabular-nums",
                      m.delta > 0 ? "text-status-success" : "text-foreground",
                    )}
                  >
                    {m.delta > 0 ? "+" : "−"}
                    {formatQuantity(item, Math.abs(m.delta))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-muted/50 px-6 py-4">
        <span className="text-sm text-muted-foreground">
          Valeur en stock <span className="font-semibold text-foreground tabular-nums">{formatAmount(item.quantity * item.purchasePrice)}</span>
        </span>
        <Button asChild>
          <Link href={`/inventory/ventes-achats?commander=${item.id}`}>
            <HugeiconsIcon icon={ShoppingCartAdd01Icon} strokeWidth={2.2} data-icon="inline-start" />
            Commander
          </Link>
        </Button>
      </div>
    </>
  );
}

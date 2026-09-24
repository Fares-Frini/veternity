"use client";

import { CLIENTS } from "@/app/(dashboard)/clients/_components/data";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Delete02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { PAYMENT_METHODS, type PaymentMethod } from "../../_components/invoices-data";
import { notifyInventory } from "../../_components/inventory-store";
import { DetailHeader, formatAmount, formatShortDate } from "../../_components/inventory-ui";
import { ProductPicker } from "../../_components/product-picker";
import { STOCK, addDays, adjustStock, findStockItem, formatQuantity, today } from "../../_components/stock-data";
import { SUPPLIERS, findSupplier } from "../../_components/suppliers-data";
import { PURCHASES, SALES, nextPurchaseId, nextSaleId, pendingQuantity } from "../../_components/trade-data";

export type TradeMode = "sale" | "purchase";

interface EditorLine {
  uid: string;
  productId?: string;
  quantity: string;
  unitPrice: string;
}

let lineSeq = 0;
function newLine(productId?: string, quantity = 1, mode: TradeMode = "sale"): EditorLine {
  lineSeq += 1;
  const product = findStockItem(productId);
  const price = product ? (mode === "sale" ? product.unitPrice : product.purchasePrice) : "";
  return { uid: `el${lineSeq}`, productId, quantity: String(quantity), unitPrice: String(price) };
}

/** Quantité proposée pour remonter un produit à trois fois son seuil. */
function suggestedQuantity(productId: string) {
  const p = findStockItem(productId);
  if (!p) return 1;
  return Math.max(p.alertThreshold * 3 - p.quantity, p.alertThreshold, 1);
}

const num = (v: string) => {
  const n = Number.parseFloat(v.replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export interface TradeEditorInit {
  mode: TradeMode;
  supplierId?: string;
  productId?: string;
}

export function TradeEditorDialog({
  init,
  onClose,
  onCreated,
}: {
  init: TradeEditorInit | null;
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  return (
    <Dialog open={init !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="flex max-h-[90vh] w-full max-w-3xl flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-3xl"
        showCloseButton={false}
      >
        {init && <Editor key={JSON.stringify(init)} init={init} onClose={onClose} onCreated={onCreated} />}
      </DialogContent>
    </Dialog>
  );
}

function Editor({ init, onClose, onCreated }: { init: TradeEditorInit; onClose: () => void; onCreated: (id: string) => void }) {
  const isSale = init.mode === "sale";
  const initialSupplier = init.supplierId ?? findStockItem(init.productId)?.supplierId ?? "";

  const [client, setClient] = useState("Client comptoir");
  const [paid, setPaid] = useState(true);
  const [method, setMethod] = useState<PaymentMethod>("Espèces");
  const [supplierId, setSupplierId] = useState(initialSupplier);
  const [lines, setLines] = useState<EditorLine[]>(() =>
    init.productId
      ? [newLine(init.productId, isSale ? 1 : suggestedQuantity(init.productId), init.mode)]
      : [newLine(undefined, 1, init.mode)],
  );

  const supplier = findSupplier(supplierId);
  const usedIds = new Set(lines.map((l) => l.productId));
  const lowStock = supplier
    ? STOCK.filter((s) => s.supplierId === supplier.id && s.quantity <= s.alertThreshold && !usedIds.has(s.id))
    : [];
  // Un produit déjà en commande n'est pas re-suggéré, pour éviter les doublons.
  const toReorder = lowStock.filter((s) => pendingQuantity(s.id) === 0);
  const alreadyOrdered = lowStock.filter((s) => pendingQuantity(s.id) > 0);

  const setLine = (uid: string, patch: Partial<EditorLine>) =>
    setLines((ls) => ls.map((l) => (l.uid === uid ? { ...l, ...patch } : l)));

  const filled = lines.filter((l) => l.productId && num(l.quantity) > 0);
  const total = filled.reduce((sum, l) => sum + num(l.quantity) * num(l.unitPrice), 0);
  const overStock = isSale && filled.some((l) => num(l.quantity) > (findStockItem(l.productId)?.quantity ?? 0));
  const valid = filled.length > 0 && !overStock && (isSale || !!supplier);

  const addSuggestions = () =>
    setLines((ls) => [
      ...ls.filter((l) => l.productId),
      ...toReorder.map((s) => newLine(s.id, suggestedQuantity(s.id), "purchase")),
    ]);

  const save = () => {
    if (!valid) return;
    const tradeLines = filled.map((l) => ({ productId: l.productId!, quantity: num(l.quantity), unitPrice: num(l.unitPrice) }));
    if (isSale) {
      const id = nextSaleId();
      SALES.unshift({ id, date: today(), client, channel: "Comptoir", lines: tradeLines, paid, paymentMethod: method });
      tradeLines.forEach((l) => adjustStock(l.productId, -l.quantity, { reason: "Vente", reference: id }));
      onCreated(id);
    } else {
      const id = nextPurchaseId();
      PURCHASES.unshift({
        id,
        date: today(),
        supplierId,
        status: "Commandée",
        expectedDate: addDays(today(), supplier?.leadTimeDays ?? 3),
        paid: false,
        lines: tradeLines.map((l) => ({ ...l, receivedQuantity: 0 })),
      });
      notifyInventory();
      onCreated(id);
    }
  };

  return (
    <>
      <DetailHeader
        title={isSale ? "Nouvelle vente au comptoir" : "Nouvelle commande fournisseur"}
        subtitle={isSale ? "Les produits vendus sortent du stock à l'enregistrement" : "Le stock sera mis à jour à la réception de la facture"}
        onClose={onClose}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
        {isSale ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Client</Label>
              <Select value={client} onValueChange={setClient}>
                <SelectTrigger className="h-10! w-full bg-muted">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Client comptoir">Client comptoir (anonyme)</SelectItem>
                  {CLIENTS.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Paiement</Label>
              <ToggleGroup
                type="single"
                variant="outline"
                spacing={0}
                value={paid ? "paid" : "due"}
                onValueChange={(v) => v && setPaid(v === "paid")}
                className="w-full"
              >
                <ToggleGroupItem value="paid" className="h-10 flex-1 data-[state=on]:bg-primary/12 data-[state=on]:font-semibold">
                  Payée
                </ToggleGroupItem>
                <ToggleGroupItem value="due" className="h-10 flex-1 data-[state=on]:bg-primary/12 data-[state=on]:font-semibold">
                  À régler
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Mode de règlement</Label>
              <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                <SelectTrigger className="h-10! w-full bg-muted">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_auto]">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Fournisseur</Label>
                <Select value={supplierId} onValueChange={setSupplierId}>
                  <SelectTrigger className="h-10! w-full bg-muted">
                    <SelectValue placeholder="Choisir un fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPLIERS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} · {s.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {supplier && (
                <p className="pb-2.5 text-xs text-muted-foreground">
                  Livraison en {supplier.leadTimeDays} j · paiement à {supplier.paymentTermsDays} j · minimum {formatAmount(supplier.minimumOrder)}
                </p>
              )}
            </div>
            {alreadyOrdered.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Déjà en commande, non suggéré : {alreadyOrdered.map((s) => s.name).join(", ")}.
              </p>
            )}
            {toReorder.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-status-warning-bg px-4 py-3">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">
                    {toReorder.length} produit{toReorder.length > 1 ? "s" : ""} de ce fournisseur à réapprovisionner
                  </span>
                  <span className="text-muted-foreground"> · {toReorder.map((s) => s.name).join(", ")}</span>
                </p>
                <Button type="button" variant="outline" size="sm" onClick={addSuggestions} className="bg-card">
                  Ajouter à la commande
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="hidden grid-cols-[1fr_6rem_8rem_6.5rem_2rem] gap-3 px-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase sm:grid">
            <span>Produit</span>
            <span className="text-right">Quantité</span>
            <span className="text-right">{isSale ? "Prix de vente" : "Prix d'achat"}</span>
            <span className="text-right">Total</span>
            <span />
          </div>
          {lines.map((l) => {
            const product = findStockItem(l.productId);
            const tooMany = isSale && product && num(l.quantity) > product.quantity;
            return (
              <div key={l.uid} className="flex flex-col gap-1 rounded-lg border border-border p-2 sm:border-0 sm:p-0">
                <div className="grid grid-cols-[1fr_6rem_8rem_6.5rem_2rem] items-center gap-3">
                  <ProductPicker
                    value={l.productId}
                    onChange={(id) => {
                      const p = findStockItem(id);
                      setLine(l.uid, {
                        productId: id,
                        unitPrice: String(p ? (isSale ? p.unitPrice : p.purchasePrice) : ""),
                        quantity: isSale ? l.quantity : String(suggestedQuantity(id)),
                      });
                    }}
                    prioritize={supplier ? (s) => s.supplierId === supplier.id : undefined}
                    priorityLabel={supplier ? `Catalogue ${supplier.name}` : undefined}
                  />
                  <Input
                    type="number"
                    min="1"
                    inputMode="numeric"
                    value={l.quantity}
                    onChange={(e) => setLine(l.uid, { quantity: e.target.value })}
                    aria-label="Quantité"
                    aria-invalid={!!tooMany}
                    className="h-9 bg-muted text-right tabular-nums"
                  />
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      value={l.unitPrice}
                      onChange={(e) => setLine(l.uid, { unitPrice: e.target.value })}
                      aria-label="Prix unitaire"
                      className="h-9 bg-muted pr-9 text-right tabular-nums"
                    />
                    <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-muted-foreground">DH</span>
                  </div>
                  <span className="text-right text-sm font-semibold text-foreground tabular-nums">
                    {formatAmount(num(l.quantity) * num(l.unitPrice))}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={lines.length === 1}
                    onClick={() => setLines((ls) => ls.filter((x) => x.uid !== l.uid))}
                    aria-label="Retirer la ligne"
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="text-muted-foreground" strokeWidth={2} />
                  </Button>
                </div>
                {product && (
                  <span className={`px-1 text-xs ${tooMany ? "font-medium text-status-danger" : "text-muted-foreground"}`}>
                    {tooMany ? "Stock insuffisant : " : "En stock : "}
                    {formatQuantity(product, product.quantity)}
                  </span>
                )}
              </div>
            );
          })}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setLines((ls) => [...ls, newLine(undefined, 1, init.mode)])}
            className="w-fit"
          >
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2.4} />
            Ajouter une ligne
          </Button>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/50 px-6 py-4">
        <div className="flex flex-col leading-tight">
          <span className="text-xs text-muted-foreground">
            Total · {filled.length} ligne{filled.length > 1 ? "s" : ""}
            {!isSale && supplier && ` · livraison prévue le ${formatShortDate(addDays(today(), supplier.leadTimeDays))}`}
          </span>
          <span className="text-xl font-extrabold text-foreground tabular-nums">{formatAmount(total)}</span>
          {!isSale && supplier && total > 0 && total < supplier.minimumOrder && (
            <span className="text-xs font-medium text-status-warning">
              Sous le minimum de commande ({formatAmount(supplier.minimumOrder)})
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="button" size="lg" disabled={!valid} onClick={save} className="px-4">
            {isSale ? "Enregistrer la vente" : "Enregistrer la commande"}
          </Button>
        </div>
      </div>
    </>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Alert02Icon, ArrowTurnBackwardIcon, CheckmarkCircle02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { DetailHeader, formatAmount, formatLongDate, formatShortDate } from "../../_components/inventory-ui";
import { ProductPicker } from "../../_components/product-picker";
import { STOCK_CATEGORIES, findStockItem, type StockCategory } from "../../_components/stock-data";
import {
  integrateInvoice,
  isLineResolved,
  ocrLinesTotal,
  removeInvoice,
  type OcrField,
  type OcrLine,
  type SupplierInvoice,
} from "../../_components/supplier-invoices-data";
import { SUPPLIERS, findSupplier } from "../../_components/suppliers-data";
import { DocumentPreview } from "./document-preview";

function MatchBadge({ line }: { line: OcrLine }) {
  if (line.ignored) return <Badge variant="outline">Ignorée</Badge>;
  if (line.newProduct) return <Badge variant="info">Nouveau produit</Badge>;
  if (!line.productId) return <Badge variant="danger">Non reconnu</Badge>;
  if (line.matchConfidence === 1) return <Badge variant="success">Vérifié</Badge>;
  const pct = Math.round(line.matchConfidence * 100);
  return <Badge variant={pct >= 85 ? "success" : "warning"}>Rapproché {pct} %</Badge>;
}

function Field({
  label,
  uncertain,
  onConfirm,
  children,
}: {
  label: string;
  uncertain: boolean;
  /** Valide la valeur lue telle quelle, sans la modifier. */
  onConfirm?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <Label className={cn("text-xs", uncertain && "text-status-warning")}>{label}</Label>
      {children}
      {uncertain && (
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-medium text-status-warning">À vérifier</span>
          {onConfirm && (
            <button type="button" onClick={onConfirm} className="font-medium text-foreground underline underline-offset-2 hover:text-primary">
              Confirmer
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function LineEditor({ line, onChange }: { line: OcrLine; onChange: (patch: Partial<OcrLine>) => void }) {
  const isUncertain = (f: OcrField) => line.uncertain.includes(f);
  const edit = (field: OcrField, patch: Partial<OcrLine>) =>
    onChange({ ...patch, uncertain: line.uncertain.filter((u) => u !== field) });
  const confirm = (field: OcrField) => () => onChange({ uncertain: line.uncertain.filter((u) => u !== field) });
  const inputClass = (f: OcrField) =>
    cn("h-9 bg-card tabular-nums", isUncertain(f) && "border-status-warning bg-status-warning-bg/40");

  return (
    <li className={cn("flex flex-col gap-3 rounded-xl border border-border p-4", line.ignored && "bg-muted/60 opacity-60")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Lu sur la facture</span>
          <span className="truncate font-mono text-xs text-foreground">{line.rawText}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <MatchBadge line={line} />
          <Button type="button" variant="ghost" size="xs" onClick={() => onChange({ ignored: !line.ignored })}>
            {line.ignored ? "Rétablir" : "Ignorer"}
          </Button>
        </div>
      </div>

      {!line.ignored && (
        <>
          {line.newProduct ? (
            <div className="flex flex-wrap items-center gap-2 rounded-lg bg-status-info-bg px-3 py-2">
              <span className="min-w-0 flex-1 text-sm text-foreground">
                Création de <span className="font-semibold">{line.newProduct.name}</span>
              </span>
              <Select
                value={line.newProduct.category}
                onValueChange={(category) => onChange({ newProduct: { ...line.newProduct!, category: category as StockCategory } })}
              >
                <SelectTrigger className="h-8! w-40 bg-card text-xs" aria-label="Catégorie du nouveau produit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => onChange({ newProduct: undefined })} aria-label="Annuler la création">
                <HugeiconsIcon icon={ArrowTurnBackwardIcon} strokeWidth={2.2} />
              </Button>
            </div>
          ) : (
            <Field label="Produit du stock" uncertain={!line.productId}>
              <ProductPicker
                value={line.productId}
                invalid={!line.productId}
                placeholder="Rapprocher d'un produit du stock"
                onChange={(productId) => onChange({ productId, matchConfidence: 1 })}
                footer={(close) => (
                  <button
                    type="button"
                    onClick={() => {
                      onChange({ productId: undefined, newProduct: { name: line.rawText, category: "Médicament" } });
                      close();
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-foreground outline-none hover:bg-muted focus-visible:bg-muted"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 text-muted-foreground" strokeWidth={2.2} />
                    Créer un nouveau produit à partir de cette ligne
                  </button>
                )}
              />
            </Field>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field label="Lot" uncertain={isUncertain("lot")} onConfirm={confirm("lot")}>
              <Input value={line.lot} onChange={(e) => edit("lot", { lot: e.target.value })} className={cn(inputClass("lot"), "font-mono")} />
            </Field>
            <Field label="Péremption" uncertain={isUncertain("expiry")} onConfirm={confirm("expiry")}>
              <Input type="date" value={line.expiry} onChange={(e) => edit("expiry", { expiry: e.target.value })} className={inputClass("expiry")} />
            </Field>
            <Field label="Quantité" uncertain={isUncertain("quantity")} onConfirm={confirm("quantity")}>
              <Input
                type="number"
                min="0"
                inputMode="numeric"
                value={line.quantity}
                onChange={(e) => edit("quantity", { quantity: Number(e.target.value) || 0 })}
                className={cn(inputClass("quantity"), "text-right")}
              />
            </Field>
            <Field label="Prix unitaire HT" uncertain={isUncertain("unitPrice")} onConfirm={confirm("unitPrice")}>
              <Input
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={line.unitPrice}
                onChange={(e) => edit("unitPrice", { unitPrice: Number(e.target.value) || 0 })}
                className={cn(inputClass("unitPrice"), "text-right")}
              />
            </Field>
          </div>
        </>
      )}
    </li>
  );
}

export function ReviewDialog({ invoice, onClose }: { invoice: SupplierInvoice | null; onClose: () => void }) {
  return (
    <Dialog open={invoice !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="flex h-[90vh] w-full max-w-6xl flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-6xl"
        showCloseButton={false}
      >
        {invoice && <Review key={invoice.id} invoice={invoice} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function Review({ invoice, onClose }: { invoice: SupplierInvoice; onClose: () => void }) {
  const [draft, setDraft] = useState<SupplierInvoice>(() => ({ ...invoice, lines: invoice.lines.map((l) => ({ ...l, uncertain: [...l.uncertain] })) }));
  const readOnly = invoice.status === "Intégrée";
  const failed = invoice.status === "Échec";

  const setLine = (id: string, patch: Partial<OcrLine>) =>
    setDraft((d) => ({ ...d, lines: d.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));

  const active = draft.lines.filter((l) => !l.ignored);
  const unresolved = draft.lines.filter((l) => !isLineResolved(l)).length;
  const uncertain = active.reduce((n, l) => n + l.uncertain.length, 0);
  const computed = ocrLinesTotal(draft.lines);
  const totalMatches = draft.totalRead === undefined || Math.abs(computed - draft.totalRead) < 0.01;
  const supplier = findSupplier(draft.supplierId);
  const canIntegrate = !!supplier && unresolved === 0 && active.length > 0;

  const integrate = () => {
    if (!canIntegrate) return;
    Object.assign(invoice, draft);
    integrateInvoice(invoice);
    onClose();
  };

  return (
    <>
      <DetailHeader
        title={failed ? `Lecture impossible · ${invoice.fileName}` : `Facture ${draft.number ?? ""} · ${supplier?.name ?? "fournisseur à préciser"}`}
        subtitle={`${invoice.fileName} · importée le ${formatLongDate(invoice.uploadedAt)}`}
        aside={
          invoice.confidence !== undefined && (
            <span className="shrink-0 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-xs font-semibold tabular-nums">
              Lecture {Math.round(invoice.confidence * 100)} %
            </span>
          )
        }
        onClose={onClose}
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:overflow-hidden">
        <div className="flex min-h-0 flex-col gap-3 bg-muted p-5 lg:overflow-y-auto">
          <DocumentPreview invoice={invoice} />
        </div>

        <div className="flex min-h-0 flex-col gap-5 p-5 lg:overflow-y-auto">
          {failed ? (
            <div className="flex flex-col gap-3 rounded-xl bg-status-danger-bg p-4 text-sm">
              <span className="flex items-center gap-2 font-semibold text-status-danger">
                <HugeiconsIcon icon={Alert02Icon} className="h-4 w-4" strokeWidth={2.2} />
                Le document n&apos;a pas pu être lu
              </span>
              <p className="text-foreground">{invoice.error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.4fr_1fr_1fr]">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Fournisseur</Label>
                  <Select
                    value={draft.supplierId ?? ""}
                    onValueChange={(supplierId) => setDraft((d) => ({ ...d, supplierId }))}
                    disabled={readOnly}
                  >
                    <SelectTrigger className="h-9! w-full bg-card">
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPLIERS.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {draft.supplierNameRead && (
                    <span className="truncate font-mono text-[11px] text-muted-foreground">Lu : {draft.supplierNameRead}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">N° de facture</Label>
                  <Input
                    value={draft.number ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, number: e.target.value }))}
                    disabled={readOnly}
                    className="h-9 bg-card font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Date</Label>
                  <Input
                    type="date"
                    value={draft.date ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                    disabled={readOnly}
                    className="h-9 bg-card"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-foreground">
                    Lignes lues <span className="font-normal text-muted-foreground">· {draft.lines.length}</span>
                  </h3>
                  {!readOnly && (unresolved > 0 || uncertain > 0) && (
                    <span className="text-xs font-medium text-status-warning">
                      {[
                        unresolved > 0 && `${unresolved} à rapprocher`,
                        uncertain > 0 && `${uncertain} valeur${uncertain > 1 ? "s" : ""} à vérifier`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  )}
                </div>

                {readOnly ? (
                  <ul className="divide-y divide-border rounded-xl border border-border">
                    {draft.lines.map((l) => {
                      const p = findStockItem(l.productId);
                      return (
                        <li key={l.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                          <div className="flex min-w-0 flex-col leading-tight">
                            <span className="font-medium text-foreground">{p?.name ?? l.rawText}</span>
                            <span className="text-xs text-muted-foreground">
                              Lot {l.lot} · péremption {l.expiry ? formatShortDate(l.expiry) : "—"}
                            </span>
                          </div>
                          <span className="shrink-0 text-right tabular-nums">
                            <span className="font-semibold text-status-success">+{l.quantity}</span>
                            <span className="block text-xs text-muted-foreground">{formatAmount(l.unitPrice)} / u</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <ol className="flex flex-col gap-3">
                    {draft.lines.map((l) => (
                      <LineEditor key={l.id} line={l} onChange={(patch) => setLine(l.id, patch)} />
                    ))}
                  </ol>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/50 px-6 py-4">
        {failed ? (
          <span className="text-sm text-muted-foreground">Réimportez une photo nette depuis la zone d&apos;import.</span>
        ) : (
          <div className="flex flex-col leading-tight">
            <span className="text-xs text-muted-foreground tabular-nums">
              Total lu {draft.totalRead !== undefined ? formatAmount(draft.totalRead) : "—"} · total des lignes {formatAmount(computed)}
            </span>
            <span className={cn("flex items-center gap-1 text-sm font-semibold", totalMatches ? "text-foreground" : "text-status-warning")}>
              {totalMatches ? (
                <>
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4 text-status-success" strokeWidth={2.2} />
                  Les totaux concordent
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Alert02Icon} className="h-4 w-4" strokeWidth={2.2} />
                  Écart de {formatAmount(Math.abs(computed - (draft.totalRead ?? 0)))} avec le total lu
                </>
              )}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {readOnly ? (
            invoice.purchaseId && (
              <Button asChild variant="outline">
                <Link href="/inventory/ventes-achats">Voir l&apos;achat {invoice.purchaseId}</Link>
              </Button>
            )
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                className="text-status-danger hover:text-status-danger"
                onClick={() => {
                  removeInvoice(invoice.id);
                  onClose();
                }}
              >
                {failed ? "Supprimer" : "Rejeter la facture"}
              </Button>
              {!failed && (
                <Button type="button" size="lg" disabled={!canIntegrate} onClick={integrate} className="px-4">
                  Intégrer {active.length} ligne{active.length > 1 ? "s" : ""} au stock
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

"use client";

import { ANIMALS, type Animal } from "@/app/(dashboard)/animaux/_components/data";
import { VETS } from "@/app/(dashboard)/appointments/_components/data";
import type { ConsultationAct } from "@/app/(dashboard)/consultations/(tabs)/liste/_components/data";
import type { PaymentMethod } from "@/app/(dashboard)/inventory/_components/invoices-data";
import { adjustStock, findStockItem, formatQuantity } from "@/app/(dashboard)/inventory/_components/stock-data";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { getAct, type ActId } from "./catalog";

export interface PerformedAct {
  uid: string;
  actId: ActId;
  productId?: string;
  /** Quantité de produit consommée. Ignorée pour un acte sans produit. */
  quantity: number;
}

export interface DraftRxLine {
  uid: string;
  productId?: string;
  name: string;
  posology: string;
  duration: string;
  dispensed: boolean;
  quantity: number;
}

export interface CustomInvoiceLine {
  uid: string;
  label: string;
  quantity: string;
  unitPrice: string;
}

export interface DraftVitals {
  weightKg: string;
  temperature: string;
  heartRate: string;
  respiratoryRate: string;
}

export interface ConsultationDraft {
  animalId: string | null;
  date: string;
  vet: string;
  motif: string;
  vitals: DraftVitals;
  diagnostic: string;
  acts: PerformedAct[];

  rxLines: DraftRxLine[];
  rxNotes: string;

  /** Prix unitaires saisis à la main sur la facture, par clé de ligne. */
  priceOverrides: Record<string, string>;
  customLines: CustomInvoiceLine[];
  discountPct: string;
  paymentMethod: PaymentMethod;
  paid: boolean;

  /** Quantités déjà retirées du stock pour ce brouillon, par produit. */
  committedStock: Record<string, number>;
  consultationId: string | null;
  prescriptionId: string | null;
  prescriptionStepDone: boolean;
  invoiceId: string | null;
}

let seq = 0;
export function uid(prefix: string) {
  seq += 1;
  return `${prefix}-${Date.now().toString(36)}-${seq}`;
}

function createDraft(): ConsultationDraft {
  return {
    animalId: null,
    date: new Date().toISOString().slice(0, 10),
    vet: VETS[0],
    motif: "",
    vitals: { weightKg: "", temperature: "", heartRate: "", respiratoryRate: "" },
    diagnostic: "",
    acts: [{ uid: "act-initial", actId: "consultation", quantity: 1 }],
    rxLines: [],
    rxNotes: "",
    priceOverrides: {},
    customLines: [],
    discountPct: "",
    paymentMethod: "Espèces",
    paid: true,
    committedStock: {},
    consultationId: null,
    prescriptionId: null,
    prescriptionStepDone: false,
    invoiceId: null,
  };
}

export function parseAmount(raw: string | undefined) {
  if (raw === undefined) return undefined;
  const value = Number.parseFloat(raw.replace(",", "."));
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

/* ---------------------------------------------------------------- Stock --- */

/** Quantités de chaque produit que ce brouillon consomme (actes + médicaments délivrés). */
export function stockUsage(draft: Pick<ConsultationDraft, "acts" | "rxLines">) {
  const usage: Record<string, number> = {};
  for (const act of draft.acts) {
    if (act.productId) usage[act.productId] = (usage[act.productId] ?? 0) + act.quantity;
  }
  for (const line of draft.rxLines) {
    if (line.productId && line.dispensed) usage[line.productId] = (usage[line.productId] ?? 0) + line.quantity;
  }
  return usage;
}

/** Stock disponible pour ce brouillon, comme s'il n'avait encore rien consommé. */
export function availableStock(productId: string, draft: Pick<ConsultationDraft, "committedStock">) {
  const item = findStockItem(productId);
  return item ? item.quantity + (draft.committedStock[productId] ?? 0) : 0;
}

/**
 * Répercute la consommation du brouillon sur le stock. Seul l'écart avec ce qui a déjà
 * été retiré est appliqué : revenir en arrière et modifier un acte ne décompte jamais deux fois.
 */
export function commitStock(draft: ConsultationDraft, reference: string) {
  const next = stockUsage(draft);
  const ids = new Set([...Object.keys(next), ...Object.keys(draft.committedStock)]);
  for (const id of ids) {
    const delta = (next[id] ?? 0) - (draft.committedStock[id] ?? 0);
    if (delta !== 0) adjustStock(id, -delta, { reason: "Consultation", reference });
  }
  return next;
}

/* -------------------------------------------------------------- Facture --- */

export interface InvoiceLine {
  key: string;
  label: string;
  detail?: string;
  quantity: number;
  catalogPrice: number;
  kind: "act" | "product" | "dispensed";
}

export function buildInvoiceLines(draft: ConsultationDraft): InvoiceLine[] {
  const lines: InvoiceLine[] = [];
  for (const act of draft.acts) {
    const def = getAct(act.actId);
    lines.push({ key: `act:${act.uid}`, label: def.label, quantity: 1, catalogPrice: def.price, kind: "act" });
    const product = findStockItem(act.productId);
    if (product) {
      lines.push({
        key: `prod:${act.uid}`,
        label: product.name,
        detail: `${product.unitPrice} DH / ${product.unit}`,
        quantity: act.quantity,
        catalogPrice: product.unitPrice,
        kind: "product",
      });
    }
  }
  for (const line of draft.rxLines) {
    const product = findStockItem(line.productId);
    if (!product || !line.dispensed) continue;
    lines.push({
      key: `rx:${line.uid}`,
      label: product.name,
      detail: `Délivré sur ordonnance · ${formatQuantity(product, line.quantity)}`,
      quantity: line.quantity,
      catalogPrice: product.unitPrice,
      kind: "dispensed",
    });
  }
  return lines;
}

export function effectivePrice(line: Pick<InvoiceLine, "key" | "catalogPrice">, overrides: Record<string, string>) {
  return parseAmount(overrides[line.key]) ?? line.catalogPrice;
}

export function computeTotals(draft: ConsultationDraft) {
  const lines = buildInvoiceLines(draft);
  const generated = lines.reduce((sum, l) => sum + l.quantity * effectivePrice(l, draft.priceOverrides), 0);
  const custom = draft.customLines.reduce(
    (sum, l) => sum + (parseAmount(l.quantity) ?? 0) * (parseAmount(l.unitPrice) ?? 0),
    0,
  );
  const subtotal = generated + custom;
  const discountPct = Math.min(100, parseAmount(draft.discountPct) ?? 0);
  const discount = (subtotal * discountPct) / 100;
  return { lines, subtotal, discountPct, discount, total: subtotal - discount };
}

/** Montant catalogue d'un acte, produit compris. */
export function actAmount(act: PerformedAct) {
  const product = findStockItem(act.productId);
  return getAct(act.actId).price + (product ? product.unitPrice * act.quantity : 0);
}

/** Résumé des actes pour le dossier de consultation, aux prix effectivement facturés. */
export function summarizeActs(draft: ConsultationDraft): ConsultationAct[] {
  return draft.acts.map((act) => {
    const def = getAct(act.actId);
    const product = findStockItem(act.productId);
    let amount = effectivePrice({ key: `act:${act.uid}`, catalogPrice: def.price }, draft.priceOverrides);
    if (product) {
      amount +=
        effectivePrice({ key: `prod:${act.uid}`, catalogPrice: product.unitPrice }, draft.priceOverrides) *
        act.quantity;
    }
    return {
      label: def.label,
      detail: product ? `${product.name} · ${formatQuantity(product, act.quantity)}` : undefined,
      amount,
    };
  });
}

/* -------------------------------------------------------------- Context --- */

type DraftPatch = Partial<ConsultationDraft> | ((draft: ConsultationDraft) => Partial<ConsultationDraft>);

interface DraftContextValue {
  draft: ConsultationDraft;
  animal: Animal | null;
  update: (patch: DraftPatch) => void;
  reset: () => void;
}

const DraftContext = createContext<DraftContextValue | null>(null);

export function ConsultationDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState(createDraft);

  const update = useCallback((patch: DraftPatch) => {
    setDraft((d) => ({ ...d, ...(typeof patch === "function" ? patch(d) : patch) }));
  }, []);
  const reset = useCallback(() => setDraft(createDraft()), []);
  const animal = useMemo(() => ANIMALS.find((a) => a.id === draft.animalId) ?? null, [draft.animalId]);

  const value = useMemo(() => ({ draft, animal, update, reset }), [draft, animal, update, reset]);
  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useConsultationDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useConsultationDraft doit être utilisé dans ConsultationDraftProvider");
  return ctx;
}

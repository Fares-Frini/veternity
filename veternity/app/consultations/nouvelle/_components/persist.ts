import type { Animal } from "@/app/(dashboard)/animaux/_components/data";
import { CONSULTATIONS, type Consultation } from "@/app/(dashboard)/consultations/(tabs)/liste/_components/data";
import { PRESCRIPTIONS, type Prescription } from "@/app/(dashboard)/consultations/(tabs)/prescriptions/_components/data";
import { INVOICES, nextInvoiceNumber, type Invoice } from "@/app/(dashboard)/inventory/_components/invoices-data";
import { SALES, nextSaleId, type TradeLine } from "@/app/(dashboard)/inventory/_components/trade-data";
import { findStockItem } from "@/app/(dashboard)/inventory/_components/stock-data";
import { notifyInventory } from "@/app/(dashboard)/inventory/_components/inventory-store";
import { computeTotals, effectivePrice, parseAmount, summarizeActs, type ConsultationDraft } from "./draft-context";

function upsert<T extends { id: string }>(list: T[], record: T) {
  const index = list.findIndex((item) => item.id === record.id);
  if (index === -1) list.unshift(record);
  else list[index] = record;
}

function optionalNumber(raw: string) {
  return raw.trim() === "" ? undefined : parseAmount(raw);
}

export function saveConsultation(draft: ConsultationDraft, animal: Animal) {
  const id = draft.consultationId ?? `C${Math.floor(1000 + Math.random() * 9000)}`;
  const existing = CONSULTATIONS.find((c) => c.id === id);
  const record: Consultation = {
    ...existing,
    id,
    animal: animal.name,
    species: animal.species,
    owner: animal.owner,
    vet: draft.vet,
    date: draft.date,
    diagnostic: draft.diagnostic.trim(),
    status: "En cours",
    weightKg: parseAmount(draft.vitals.weightKg) ?? animal.weightKg,
    motif: draft.motif.trim() || undefined,
    vitals: {
      temperature: optionalNumber(draft.vitals.temperature),
      heartRate: optionalNumber(draft.vitals.heartRate),
      respiratoryRate: optionalNumber(draft.vitals.respiratoryRate),
    },
    acts: summarizeActs(draft),
  };
  upsert(CONSULTATIONS, record);
  return id;
}

export function savePrescription(draft: ConsultationDraft, animal: Animal) {
  const id = draft.prescriptionId ?? `P${Math.floor(1000 + Math.random() * 9000)}`;
  const lines = draft.rxLines.filter((l) => l.name.trim() !== "");
  const record: Prescription = {
    id,
    animal: animal.name,
    species: animal.species,
    owner: animal.owner,
    medications: lines.map((l) => l.name.trim()).join(" + "),
    posology: lines.map((l) => [l.posology.trim(), l.duration.trim()].filter(Boolean).join(", ") || "—").join(" / "),
    date: draft.date,
    vet: draft.vet,
    lines: lines.map((l) => ({
      name: l.name.trim(),
      posology: l.posology.trim(),
      duration: l.duration.trim(),
      productId: l.productId,
      dispensedQuantity: l.productId && l.dispensed ? l.quantity : 0,
    })),
    notes: draft.rxNotes.trim() || undefined,
    consultationId: draft.consultationId ?? undefined,
  };
  upsert(PRESCRIPTIONS, record);
  return id;
}

export function removePrescription(id: string | null) {
  if (!id) return;
  const index = PRESCRIPTIONS.findIndex((p) => p.id === id);
  if (index !== -1) PRESCRIPTIONS.splice(index, 1);
}

export function saveInvoice(draft: ConsultationDraft, animal: Animal) {
  const { lines, discountPct, total } = computeTotals(draft);
  const invoice: Invoice = {
    id: nextInvoiceNumber(),
    date: new Date().toISOString().slice(0, 10),
    client: animal.owner,
    animal: animal.name,
    consultationId: draft.consultationId ?? "",
    items: [
      ...lines.map((l) => ({ label: l.label, quantity: l.quantity, unitPrice: effectivePrice(l, draft.priceOverrides) })),
      ...draft.customLines
        .filter((l) => l.label.trim() !== "" || (parseAmount(l.unitPrice) ?? 0) > 0)
        .map((l) => ({
          label: l.label.trim() || "Divers",
          quantity: parseAmount(l.quantity) ?? 0,
          unitPrice: parseAmount(l.unitPrice) ?? 0,
        })),
    ],
    discountPct,
    total,
    paymentMethod: draft.paymentMethod,
    status: draft.paid ? "Payée" : "Impayée",
  };
  INVOICES.unshift(invoice);
  recordProductSale(draft, invoice);

  const consultation = CONSULTATIONS.find((c) => c.id === draft.consultationId);
  if (consultation) {
    consultation.status = "Terminée";
    consultation.acts = summarizeActs(draft);
    consultation.total = total;
    consultation.invoiceId = invoice.id;
  }
  return invoice;
}

/** Les produits sortis du stock pendant la consultation apparaissent dans les ventes de l'inventaire. */
function recordProductSale(draft: ConsultationDraft, invoice: Invoice) {
  const lines: TradeLine[] = [];
  for (const act of draft.acts) {
    const product = findStockItem(act.productId);
    if (!product) continue;
    lines.push({
      productId: product.id,
      quantity: act.quantity,
      unitPrice: effectivePrice({ key: `prod:${act.uid}`, catalogPrice: product.unitPrice }, draft.priceOverrides),
    });
  }
  for (const rx of draft.rxLines) {
    const product = findStockItem(rx.productId);
    if (!product || !rx.dispensed) continue;
    lines.push({
      productId: product.id,
      quantity: rx.quantity,
      unitPrice: effectivePrice({ key: `rx:${rx.uid}`, catalogPrice: product.unitPrice }, draft.priceOverrides),
    });
  }
  if (lines.length === 0) return;
  SALES.unshift({
    id: nextSaleId(),
    date: invoice.date,
    client: invoice.client,
    channel: "Consultation",
    reference: invoice.id,
    lines,
    paid: invoice.status === "Payée",
    paymentMethod: invoice.paymentMethod,
  });
  notifyInventory();
}

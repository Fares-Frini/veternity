import type { PaymentMethod } from "./invoices-data";
import { notifyInventory } from "./inventory-store";
import { logMovement } from "./stock-data";

export interface TradeLine {
  productId: string;
  quantity: number;
  unitPrice: number;
  /** Achats uniquement : quantité effectivement livrée. */
  receivedQuantity?: number;
}

export function tradeTotal(lines: TradeLine[]) {
  return lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
}

/* ---------------------------------------------------------------- Ventes --- */

export type SaleChannel = "Comptoir" | "Consultation";

export interface Sale {
  id: string;
  date: string;
  client: string;
  channel: SaleChannel;
  lines: TradeLine[];
  paid: boolean;
  paymentMethod: PaymentMethod;
  /** Facture de consultation d'origine, le cas échéant. */
  reference?: string;
}

export const SALES: Sale[] = [
  { id: "V-3040", date: "2026-09-23", client: "Leila Mansouri", channel: "Comptoir", lines: [{ productId: "P02", quantity: 4, unitPrice: 35 }], paid: true, paymentMethod: "Carte bancaire" },
  { id: "V-3039", date: "2026-09-22", client: "Karim Bouzidi", channel: "Comptoir", lines: [{ productId: "P05", quantity: 1, unitPrice: 320 }, { productId: "P03", quantity: 1, unitPrice: 90 }], paid: true, paymentMethod: "Espèces" },
  { id: "V-3038", date: "2026-09-22", client: "Ferme Ait Baha", channel: "Comptoir", lines: [{ productId: "P04", quantity: 120, unitPrice: 3 }, { productId: "V05", quantity: 52, unitPrice: 6 }], paid: false, paymentMethod: "Virement" },
  { id: "V-3037", date: "2026-09-19", client: "Nadia Berrada", channel: "Comptoir", lines: [{ productId: "M07", quantity: 1, unitPrice: 60 }], paid: true, paymentMethod: "Espèces" },
  { id: "V-3036", date: "2026-09-18", client: "Client comptoir", channel: "Comptoir", lines: [{ productId: "C06", quantity: 1, unitPrice: 45 }, { productId: "C02", quantity: 2, unitPrice: 30 }], paid: true, paymentMethod: "Espèces" },
  { id: "V-3035", date: "2026-09-16", client: "Omar Ziani", channel: "Comptoir", lines: [{ productId: "P05", quantity: 1, unitPrice: 320 }], paid: true, paymentMethod: "Carte bancaire" },
  { id: "V-3034", date: "2026-09-15", client: "Coopérative Tafraout", channel: "Comptoir", lines: [{ productId: "I05", quantity: 60, unitPrice: 4 }, { productId: "P04", quantity: 80, unitPrice: 3 }], paid: false, paymentMethod: "Chèque" },
  { id: "V-3033", date: "2026-09-12", client: "Hicham Alami", channel: "Comptoir", lines: [{ productId: "M02", quantity: 1, unitPrice: 120 }, { productId: "M10", quantity: 1, unitPrice: 65 }], paid: true, paymentMethod: "Carte bancaire" },
  { id: "V-3032", date: "2026-09-09", client: "Rania Fassi", channel: "Comptoir", lines: [{ productId: "M07", quantity: 1, unitPrice: 60 }], paid: true, paymentMethod: "Espèces" },
  { id: "V-3031", date: "2026-09-05", client: "Brahim Ouhadi", channel: "Comptoir", lines: [{ productId: "V05", quantity: 18, unitPrice: 6 }, { productId: "I05", quantity: 40, unitPrice: 4 }], paid: true, paymentMethod: "Virement" },
  { id: "V-3030", date: "2026-09-02", client: "Amine Tazi", channel: "Comptoir", lines: [{ productId: "P02", quantity: 2, unitPrice: 35 }, { productId: "M08", quantity: 1, unitPrice: 75 }], paid: true, paymentMethod: "Espèces" },
  { id: "V-3029", date: "2026-08-28", client: "Mehdi Chraibi", channel: "Comptoir", lines: [{ productId: "P01", quantity: 4, unitPrice: 45 }], paid: true, paymentMethod: "Carte bancaire" },
  { id: "V-3028", date: "2026-08-21", client: "Ferme El Menzeh", channel: "Comptoir", lines: [{ productId: "V06", quantity: 240, unitPrice: 1 }], paid: true, paymentMethod: "Virement" },
  { id: "V-3027", date: "2026-08-14", client: "Yassine Idrissi", channel: "Comptoir", lines: [{ productId: "P03", quantity: 2, unitPrice: 90 }], paid: true, paymentMethod: "Espèces" },
  { id: "V-3025", date: "2026-07-26", client: "Salma Idrissi", channel: "Consultation", reference: "F-1040", lines: [{ productId: "I03", quantity: 1, unitPrice: 12 }], paid: true, paymentMethod: "Espèces" },
  { id: "V-3024", date: "2026-07-25", client: "Mehdi Chraibi", channel: "Consultation", reference: "F-1039", lines: [{ productId: "V01", quantity: 1, unitPrice: 150 }, { productId: "P01", quantity: 1, unitPrice: 45 }], paid: true, paymentMethod: "Espèces" },
];

export function nextSaleId() {
  const last = Math.max(3040, ...SALES.map((s) => Number(s.id.replace("V-", "")) || 0));
  return `V-${last + 1}`;
}

/* ---------------------------------------------------------------- Achats --- */

export type PurchaseStatus = "Commandée" | "Partielle" | "Reçue";

export interface Purchase {
  id: string;
  date: string;
  supplierId: string;
  status: PurchaseStatus;
  lines: TradeLine[];
  expectedDate?: string;
  paid: boolean;
  /** Facture fournisseur (OCR) qui a servi à la réception. */
  supplierInvoiceId?: string;
}

export const PURCHASES: Purchase[] = [
  { id: "BC-2026-131", date: "2026-09-23", supplierId: "S02", status: "Commandée", expectedDate: "2026-09-27", paid: false, lines: [{ productId: "V07", quantity: 10, unitPrice: 130 }, { productId: "M09", quantity: 6, unitPrice: 30 }] },
  { id: "BC-2026-130", date: "2026-09-22", supplierId: "S05", status: "Commandée", expectedDate: "2026-09-25", paid: false, lines: [{ productId: "C03", quantity: 10, unitPrice: 40 }] },
  { id: "BC-2026-129", date: "2026-09-18", supplierId: "S01", status: "Reçue", paid: false, supplierInvoiceId: "FA-0005", lines: [{ productId: "V02", quantity: 12, unitPrice: 70, receivedQuantity: 12 }, { productId: "P01", quantity: 20, unitPrice: 28, receivedQuantity: 20 }] },
  { id: "BC-2026-128", date: "2026-09-12", supplierId: "S03", status: "Reçue", paid: true, lines: [{ productId: "P04", quantity: 500, unitPrice: 1.6, receivedQuantity: 500 }, { productId: "I05", quantity: 250, unitPrice: 2, receivedQuantity: 250 }] },
  { id: "BC-2026-127", date: "2026-09-08", supplierId: "S04", status: "Partielle", expectedDate: "2026-09-30", paid: false, lines: [{ productId: "P03", quantity: 24, unitPrice: 58, receivedQuantity: 24 }, { productId: "P05", quantity: 12, unitPrice: 210, receivedQuantity: 0 }] },
  { id: "BC-2026-126", date: "2026-09-01", supplierId: "S01", status: "Reçue", paid: true, lines: [{ productId: "V01", quantity: 10, unitPrice: 95, receivedQuantity: 10 }, { productId: "M02", quantity: 10, unitPrice: 75, receivedQuantity: 10 }, { productId: "M03", quantity: 6, unitPrice: 90, receivedQuantity: 6 }] },
  { id: "BC-2026-125", date: "2026-08-25", supplierId: "S05", status: "Reçue", paid: true, lines: [{ productId: "C01", quantity: 10, unitPrice: 45, receivedQuantity: 10 }, { productId: "C02", quantity: 20, unitPrice: 18, receivedQuantity: 20 }, { productId: "C04", quantity: 24, unitPrice: 22, receivedQuantity: 24 }] },
  { id: "BC-2026-124", date: "2026-08-18", supplierId: "S02", status: "Reçue", paid: true, lines: [{ productId: "V03", quantity: 10, unitPrice: 105, receivedQuantity: 10 }, { productId: "M11", quantity: 6, unitPrice: 80, receivedQuantity: 6 }, { productId: "M12", quantity: 4, unitPrice: 150, receivedQuantity: 4 }] },
  { id: "BC-2026-123", date: "2026-08-05", supplierId: "S03", status: "Reçue", paid: true, lines: [{ productId: "V05", quantity: 400, unitPrice: 3.5, receivedQuantity: 400 }, { productId: "V06", quantity: 1000, unitPrice: 0.5, receivedQuantity: 1000 }] },
  { id: "BC-2026-122", date: "2026-07-22", supplierId: "S01", status: "Reçue", paid: true, lines: [{ productId: "I02", quantity: 50, unitPrice: 11, receivedQuantity: 50 }, { productId: "M10", quantity: 10, unitPrice: 38, receivedQuantity: 10 }] },
];

export function nextPurchaseId() {
  const last = Math.max(131, ...PURCHASES.map((p) => Number(p.id.split("-").pop()) || 0));
  return `BC-2026-${last + 1}`;
}

/** Quantité commandée mais pas encore livrée pour un produit. */
export function pendingQuantity(productId: string) {
  return PURCHASES.filter((p) => p.status !== "Reçue")
    .flatMap((p) => p.lines)
    .filter((l) => l.productId === productId)
    .reduce((sum, l) => sum + l.quantity - (l.receivedQuantity ?? 0), 0);
}

export function markSalePaid(id: string) {
  const sale = SALES.find((s) => s.id === id);
  if (sale) sale.paid = true;
  notifyInventory();
}

export function markPurchasePaid(id: string) {
  const purchase = PURCHASES.find((p) => p.id === id);
  if (purchase) purchase.paid = true;
  notifyInventory();
}

/* ------------------------------------------ Historique des mouvements initial --- */

for (const sale of [...SALES].reverse()) {
  for (const line of sale.lines) {
    logMovement({
      date: sale.date,
      productId: line.productId,
      delta: -line.quantity,
      reason: sale.channel === "Consultation" ? "Consultation" : "Vente",
      reference: sale.reference ?? sale.id,
    });
  }
}
for (const purchase of [...PURCHASES].reverse()) {
  for (const line of purchase.lines) {
    if (!line.receivedQuantity) continue;
    logMovement({
      date: purchase.date,
      productId: line.productId,
      delta: line.receivedQuantity,
      reason: purchase.supplierInvoiceId ? "Facture fournisseur" : "Achat",
      reference: purchase.id,
    });
  }
}

export type PaymentMethod = "Espèces" | "Carte bancaire" | "Chèque" | "Virement";
export type InvoiceStatus = "Payée" | "Impayée";

export const PAYMENT_METHODS: PaymentMethod[] = ["Espèces", "Carte bancaire", "Chèque", "Virement"];

export interface InvoiceItem {
  label: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  date: string;
  client: string;
  animal: string;
  consultationId: string;
  items: InvoiceItem[];
  /** Remise globale, en pourcentage. */
  discountPct: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: InvoiceStatus;
}

export const INVOICES: Invoice[] = [
  {
    id: "F-1041", date: "2026-07-28", client: "Leila Mansouri", animal: "Luna", consultationId: "C001",
    items: [
      { label: "Consultation", quantity: 1, unitPrice: 200 },
      { label: "Soins / pansement", quantity: 1, unitPrice: 120 },
    ],
    discountPct: 0, total: 320, paymentMethod: "Carte bancaire", status: "Payée",
  },
  {
    id: "F-1040", date: "2026-07-26", client: "Salma Idrissi", animal: "Nala", consultationId: "C010",
    items: [
      { label: "Consultation", quantity: 1, unitPrice: 200 },
      { label: "Injection", quantity: 1, unitPrice: 50 },
      { label: "Dexaméthasone", quantity: 1, unitPrice: 12 },
    ],
    discountPct: 0, total: 262, paymentMethod: "Espèces", status: "Payée",
  },
  {
    id: "F-1039", date: "2026-07-25", client: "Mehdi Chraibi", animal: "Rocky", consultationId: "C011",
    items: [
      { label: "Consultation", quantity: 1, unitPrice: 200 },
      { label: "Vaccination", quantity: 1, unitPrice: 80 },
      { label: "Nobivac DHPPi", quantity: 1, unitPrice: 150 },
      { label: "Déparasitage", quantity: 1, unitPrice: 30 },
      { label: "Milbemax chien", quantity: 1, unitPrice: 45 },
    ],
    discountPct: 0, total: 505, paymentMethod: "Espèces", status: "Payée",
  },
  {
    id: "F-1038", date: "2026-07-23", client: "Khadija Ouazzani", animal: "Oscar", consultationId: "C013",
    items: [
      { label: "Consultation", quantity: 1, unitPrice: 200 },
      { label: "Soins / pansement", quantity: 1, unitPrice: 120 },
    ],
    discountPct: 0, total: 320, paymentMethod: "Chèque", status: "Impayée",
  },
];

/** Numérotation continue : la dernière facture émise avant l'application est la F-1042. */
export function nextInvoiceNumber() {
  const last = Math.max(1042, ...INVOICES.map((i) => Number(i.id.replace("F-", "")) || 0));
  return `F-${last + 1}`;
}

export function findInvoice(id: string | undefined) {
  return id ? INVOICES.find((i) => i.id === id) : undefined;
}

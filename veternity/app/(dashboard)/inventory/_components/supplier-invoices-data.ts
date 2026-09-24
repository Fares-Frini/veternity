import { notifyInventory } from "./inventory-store";
import { STOCK, adjustStock, findStockItem, today, type StockCategory } from "./stock-data";
import { SUPPLIERS } from "./suppliers-data";
import { PURCHASES, nextPurchaseId } from "./trade-data";

export type OcrStatus = "Analyse" | "À vérifier" | "Intégrée" | "Échec";
export type OcrField = "lot" | "expiry" | "quantity" | "unitPrice";

export interface OcrLine {
  id: string;
  /** Libellé tel que lu sur le document. */
  rawText: string;
  /** Produit du stock rapproché (automatiquement ou à la main). */
  productId?: string;
  /** Confiance du rapprochement automatique, 0 à 1. */
  matchConfidence: number;
  /** Renseigné quand l'utilisateur crée un nouveau produit à partir de la ligne. */
  newProduct?: { name: string; category: StockCategory };
  ignored?: boolean;
  lot: string;
  expiry: string;
  quantity: number;
  unitPrice: number;
  /** Champs lus avec une confiance faible, signalés pour vérification. */
  uncertain: OcrField[];
}

export interface SupplierInvoice {
  id: string;
  fileName: string;
  fileType: "pdf" | "image";
  /** URL locale du fichier importé pendant la session (aperçu). */
  fileUrl?: string;
  uploadedAt: string;
  status: OcrStatus;
  /** Avancement de l'analyse, 0 à 100. */
  progress: number;
  supplierId?: string;
  supplierNameRead?: string;
  number?: string;
  date?: string;
  totalRead?: number;
  /** Confiance globale de la lecture, 0 à 1. */
  confidence?: number;
  lines: OcrLine[];
  purchaseId?: string;
  error?: string;
}

const line = (l: Omit<OcrLine, "uncertain"> & Partial<Pick<OcrLine, "uncertain">>): OcrLine => ({ uncertain: [], ...l });

export const SUPPLIER_INVOICES: SupplierInvoice[] = [
  {
    id: "FA-0007", fileName: "IMG_20260923_0914.jpg", fileType: "image", uploadedAt: "2026-09-23T09:14:00", status: "À vérifier", progress: 100,
    supplierId: "S02", supplierNameRead: "ZOOLAB MAROC SARL", number: "ZL-26-04417", date: "2026-09-22", totalRead: 2850, confidence: 0.87,
    lines: [
      line({ id: "l1", rawText: "LEUCOFELIGEN FELV/RCP INJ B/1", productId: "V07", matchConfidence: 0.82, lot: "LF2208", expiry: "2027-06-30", quantity: 10, unitPrice: 130 }),
      line({ id: "l2", rawText: "PREDNISOLONE 5MG CP B/20", productId: "M09", matchConfidence: 0.95, lot: "PD5-112", expiry: "2027-09-30", quantity: 6, unitPrice: 30 }),
      line({ id: "l3", rawText: "SUROLAN GTT AURIC 15ML", productId: "M11", matchConfidence: 0.9, lot: "SR19", expiry: "2027-11-30", quantity: 4, unitPrice: 80, uncertain: ["quantity"] }),
      line({ id: "l4", rawText: "PUREVAX RCPCH LYO 1D", productId: "V03", matchConfidence: 0.78, lot: "PV8?1", expiry: "2027-04-30", quantity: 10, unitPrice: 105, uncertain: ["lot"] }),
    ],
  },
  {
    id: "FA-0006", fileName: "sud_elevage_facture_0921.pdf", fileType: "pdf", uploadedAt: "2026-09-21T16:40:00", status: "À vérifier", progress: 100,
    supplierId: "S03", supplierNameRead: "SUD ELEVAGE SANTE", number: "SE-2026-0788", date: "2026-09-20", totalRead: 1540, confidence: 0.93,
    lines: [
      line({ id: "l1", rawText: "IVOMEC 1% INJ 500ML", productId: "P04", matchConfidence: 0.97, lot: "IV61", expiry: "2028-02-29", quantity: 500, unitPrice: 1.6 }),
      line({ id: "l2", rawText: "VITAMINE AD3E INJ 100ML", matchConfidence: 0, lot: "AD3-07", expiry: "2027-12-31", quantity: 5, unitPrice: 48 }),
      line({ id: "l3", rawText: "OXYTETRACYCLINE LA 20% 250ML", productId: "I05", matchConfidence: 0.88, lot: "OX214", expiry: "2027-10-31", quantity: 250, unitPrice: 2, uncertain: ["expiry"] }),
    ],
  },
  {
    id: "FA-0008", fileName: "photo_facture.jpg", fileType: "image", uploadedAt: "2026-09-20T11:02:00", status: "Échec", progress: 100,
    lines: [], error: "Document illisible : photo floue ou trop sombre. Reprenez la photo à plat, bien éclairée.",
  },
  {
    id: "FA-0005", fileName: "atlasvet_BL_0918.pdf", fileType: "pdf", uploadedAt: "2026-09-18T10:25:00", status: "Intégrée", progress: 100,
    supplierId: "S01", supplierNameRead: "ATLAS VET DISTRIBUTION", number: "AVD-118562", date: "2026-09-17", totalRead: 1400, confidence: 0.96, purchaseId: "BC-2026-129",
    lines: [
      line({ id: "l1", rawText: "NOBIVAC RABIES 1D", productId: "V02", matchConfidence: 0.98, lot: "RB131", expiry: "2027-05-31", quantity: 12, unitPrice: 70 }),
      line({ id: "l2", rawText: "MILBEMAX CHIEN CP B/4", productId: "P01", matchConfidence: 0.96, lot: "ML22", expiry: "2027-06-30", quantity: 20, unitPrice: 28 }),
    ],
  },
  {
    id: "FA-0004", fileName: "clinisoin_0825.pdf", fileType: "pdf", uploadedAt: "2026-08-25T14:10:00", status: "Intégrée", progress: 100,
    supplierId: "S05", supplierNameRead: "CLINISOIN FOURNITURES", number: "CLS-7781", date: "2026-08-25", totalRead: 1338, confidence: 0.94, purchaseId: "BC-2026-125",
    lines: [
      line({ id: "l1", rawText: "SERINGUE 5ML B/100", productId: "C01", matchConfidence: 0.93, lot: "SR5-26", expiry: "2029-12-31", quantity: 10, unitPrice: 45 }),
      line({ id: "l2", rawText: "COMPRESSES STER 10X10 P/50", productId: "C02", matchConfidence: 0.91, lot: "CS1010", expiry: "2028-06-30", quantity: 20, unitPrice: 18 }),
      line({ id: "l3", rawText: "FIL RESORB 3/0 75CM", productId: "C04", matchConfidence: 0.89, lot: "FS30-4", expiry: "2027-10-31", quantity: 24, unitPrice: 22 }),
    ],
  },
];

export function findSupplierInvoice(id: string | undefined) {
  return id ? SUPPLIER_INVOICES.find((i) => i.id === id) : undefined;
}

export function ocrLinesTotal(lines: OcrLine[]) {
  return lines.filter((l) => !l.ignored).reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
}

/** Une ligne est prête quand elle est ignorée, ou rapprochée d'un produit (existant ou nouveau). */
export function isLineResolved(l: OcrLine) {
  return l.ignored || !!l.productId || !!l.newProduct;
}

/* -------------------------------------------------- Import et analyse (simulés) --- */

let invoiceSeq = 8;

/** Aucune reconnaissance réelle n'est branchée : l'analyse est simulée à partir du catalogue d'un fournisseur. */
export function importInvoiceFile(file: File) {
  invoiceSeq += 1;
  const invoice: SupplierInvoice = {
    id: `FA-${String(invoiceSeq).padStart(4, "0")}`,
    fileName: file.name,
    fileType: file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "image",
    fileUrl: URL.createObjectURL(file),
    uploadedAt: new Date().toISOString(),
    status: "Analyse",
    progress: 0,
    lines: [],
  };
  SUPPLIER_INVOICES.unshift(invoice);
  notifyInventory();

  const timer = setInterval(() => {
    invoice.progress = Math.min(100, invoice.progress + 12 + Math.round(Math.random() * 14));
    if (invoice.progress >= 100) {
      clearInterval(timer);
      fillSimulatedResult(invoice);
    }
    notifyInventory();
  }, 350);

  return invoice;
}

function fillSimulatedResult(invoice: SupplierInvoice) {
  const supplier = SUPPLIERS[invoiceSeq % SUPPLIERS.length];
  const products = STOCK.filter((s) => s.supplierId === supplier.id).slice(0, 4);
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);

  invoice.status = "À vérifier";
  invoice.supplierId = supplier.id;
  invoice.supplierNameRead = supplier.name.toUpperCase();
  invoice.number = `${supplier.name.slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 89999)}`;
  invoice.date = today();
  invoice.confidence = 0.84 + Math.random() * 0.12;
  invoice.lines = products.map((p, i) => ({
    id: `l${i + 1}`,
    rawText: `${p.name.toUpperCase()} ${p.form.toUpperCase()}`,
    productId: i === products.length - 1 ? undefined : p.id,
    matchConfidence: i === products.length - 1 ? 0 : 0.8 + Math.random() * 0.18,
    lot: `${p.id}${Math.floor(100 + Math.random() * 899)}`,
    expiry: expiry.toISOString().slice(0, 10),
    quantity: Math.max(1, p.alertThreshold * 2),
    unitPrice: p.purchasePrice,
    uncertain: i === 0 ? ["quantity"] : [],
  }));
  invoice.totalRead = ocrLinesTotal(invoice.lines);
}

/* ------------------------------------------------------------- Intégration --- */

/** Reporte les lignes vérifiées dans le stock (lots et péremptions), puis enregistre l'achat correspondant. */
export function integrateInvoice(invoice: SupplierInvoice) {
  const purchaseId = nextPurchaseId();
  const lines = invoice.lines.filter((l) => !l.ignored);

  for (const l of lines) {
    let productId = l.productId;
    if (!productId && l.newProduct) {
      productId = `N${String(STOCK.length + 1).padStart(2, "0")}`;
      STOCK.push({
        id: productId,
        name: l.newProduct.name,
        category: l.newProduct.category,
        form: "À compléter",
        unit: "unité",
        unitPlural: "unités",
        quantity: 0,
        alertThreshold: 0,
        purchasePrice: l.unitPrice,
        unitPrice: Math.round(l.unitPrice * 1.6),
        species: [],
        supplierId: invoice.supplierId ?? "",
        location: "À ranger",
        lots: [],
      });
      l.productId = productId;
    }
    if (!productId) continue;
    const product = findStockItem(productId);
    if (product) product.purchasePrice = l.unitPrice;
    adjustStock(productId, l.quantity, {
      reason: "Facture fournisseur",
      reference: invoice.number ?? invoice.id,
      lot: { lot: l.lot, expiry: l.expiry },
    });
  }

  PURCHASES.unshift({
    id: purchaseId,
    date: invoice.date ?? today(),
    supplierId: invoice.supplierId ?? "",
    status: "Reçue",
    paid: false,
    supplierInvoiceId: invoice.id,
    lines: lines
      .filter((l) => l.productId)
      .map((l) => ({ productId: l.productId!, quantity: l.quantity, unitPrice: l.unitPrice, receivedQuantity: l.quantity })),
  });

  invoice.status = "Intégrée";
  invoice.purchaseId = purchaseId;
  notifyInventory();
}

export function removeInvoice(id: string) {
  const index = SUPPLIER_INVOICES.findIndex((i) => i.id === id);
  if (index !== -1) SUPPLIER_INVOICES.splice(index, 1);
  notifyInventory();
}

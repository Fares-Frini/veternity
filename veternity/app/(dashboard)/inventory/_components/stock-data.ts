import { notifyInventory } from "./inventory-store";

export type StockCategory = "Vaccin" | "Antiparasitaire" | "Injectable" | "Médicament" | "Consommable";

export const STOCK_CATEGORIES: StockCategory[] = ["Vaccin", "Antiparasitaire", "Injectable", "Médicament", "Consommable"];

export interface StockLot {
  lot: string;
  /** Date de péremption (AAAA-MM-JJ), vide pour un produit sans péremption. */
  expiry: string;
  quantity: number;
}

export interface StockItem {
  id: string;
  name: string;
  category: StockCategory;
  /** Présentation commerciale (ex : « Boîte de 10 comprimés »). */
  form: string;
  /** Unité de délivrance, au singulier et au pluriel (ex : dose / doses). */
  unit: string;
  unitPlural: string;
  /** Somme des lots, tenue à jour par `adjustStock`. */
  quantity: number;
  /** En dessous ou égal à ce seuil, le produit est à réapprovisionner. */
  alertThreshold: number;
  /** Dernier prix d'achat unitaire, en DH. */
  purchasePrice: number;
  /** Prix de vente unitaire, en DH. */
  unitPrice: number;
  /** Espèces pour lesquelles le produit est indiqué. */
  species: string[];
  supplierId: string;
  location: string;
  lots: StockLot[];
}

const PETS = ["Chien", "Chat"];
const LIVESTOCK = ["Mouton", "Vache", "Chèvre"];
const ALL = ["Chien", "Chat", "Lapin", "Oiseau", "Mouton", "Vache", "Chèvre", "Volaille"];

function item(data: Omit<StockItem, "quantity">): StockItem {
  return { ...data, quantity: data.lots.reduce((sum, l) => sum + l.quantity, 0) };
}

const DOSE = { unit: "dose", unitPlural: "doses" };
const TABLET = { unit: "comprimé", unitPlural: "comprimés" };
const ML = { unit: "ml", unitPlural: "ml" };
const BOX = { unit: "boîte", unitPlural: "boîtes" };
const BOTTLE = { unit: "flacon", unitPlural: "flacons" };
const PIECE = { unit: "unité", unitPlural: "unités" };

export const STOCK: StockItem[] = [
  // Vaccins — chaîne du froid
  item({ id: "V01", name: "Nobivac DHPPi", category: "Vaccin", form: "Flacon unidose lyophilisé", ...DOSE, alertThreshold: 5, purchasePrice: 95, unitPrice: 150, species: ["Chien"], supplierId: "S01", location: "Réfrigérateur A", lots: [{ lot: "NB24A", expiry: "2027-03-31", quantity: 14 }, { lot: "NB25C", expiry: "2027-08-31", quantity: 10 }] }),
  item({ id: "V02", name: "Nobivac Rabies", category: "Vaccin", form: "Flacon unidose 1 ml", ...DOSE, alertThreshold: 5, purchasePrice: 70, unitPrice: 120, species: PETS, supplierId: "S01", location: "Réfrigérateur A", lots: [{ lot: "RB118", expiry: "2026-11-10", quantity: 6 }, { lot: "RB131", expiry: "2027-05-31", quantity: 12 }] }),
  item({ id: "V03", name: "Purevax RCPCh", category: "Vaccin", form: "Flacon unidose lyophilisé", ...DOSE, alertThreshold: 5, purchasePrice: 105, unitPrice: 160, species: ["Chat"], supplierId: "S02", location: "Réfrigérateur A", lots: [{ lot: "PV77", expiry: "2027-01-31", quantity: 4 }] }),
  item({ id: "V04", name: "Nobivac Myxo-RHD", category: "Vaccin", form: "Flacon unidose lyophilisé", ...DOSE, alertThreshold: 3, purchasePrice: 120, unitPrice: 180, species: ["Lapin"], supplierId: "S01", location: "Réfrigérateur A", lots: [{ lot: "MX09", expiry: "2026-10-15", quantity: 6 }] }),
  item({ id: "V05", name: "Covexin 8 (entérotoxémie)", category: "Vaccin", form: "Flacon de 50 doses", ...DOSE, alertThreshold: 50, purchasePrice: 3.5, unitPrice: 6, species: LIVESTOCK, supplierId: "S03", location: "Réfrigérateur B", lots: [{ lot: "CV8-221", expiry: "2027-02-28", quantity: 400 }] }),
  item({ id: "V06", name: "Nobilis ND Clone 30", category: "Vaccin", form: "Flacon de 1 000 doses", ...DOSE, alertThreshold: 200, purchasePrice: 0.5, unitPrice: 1, species: ["Volaille"], supplierId: "S03", location: "Réfrigérateur B", lots: [{ lot: "ND30-45", expiry: "2026-12-31", quantity: 1000 }] }),
  item({ id: "V07", name: "Leucofeligen FeLV/RCP", category: "Vaccin", form: "Flacon unidose lyophilisé", ...DOSE, alertThreshold: 4, purchasePrice: 130, unitPrice: 190, species: ["Chat"], supplierId: "S02", location: "Réfrigérateur A", lots: [] }),

  // Antiparasitaires
  item({ id: "P01", name: "Milbemax chien", category: "Antiparasitaire", form: "Boîte de 4 comprimés", ...TABLET, alertThreshold: 10, purchasePrice: 28, unitPrice: 45, species: ["Chien"], supplierId: "S01", location: "Armoire 1", lots: [{ lot: "ML22", expiry: "2027-06-30", quantity: 40 }] }),
  item({ id: "P02", name: "Milbemax chat", category: "Antiparasitaire", form: "Boîte de 4 comprimés", ...TABLET, alertThreshold: 10, purchasePrice: 21, unitPrice: 35, species: ["Chat"], supplierId: "S01", location: "Armoire 1", lots: [{ lot: "ML31", expiry: "2027-04-30", quantity: 30 }] }),
  item({ id: "P03", name: "Frontline Combo", category: "Antiparasitaire", form: "Pipette spot-on", unit: "pipette", unitPlural: "pipettes", alertThreshold: 6, purchasePrice: 58, unitPrice: 90, species: PETS, supplierId: "S04", location: "Armoire 1", lots: [{ lot: "FC901", expiry: "2028-01-31", quantity: 22 }] }),
  item({ id: "P04", name: "Ivomec 1 %", category: "Antiparasitaire", form: "Flacon de 500 ml", ...ML, alertThreshold: 100, purchasePrice: 1.6, unitPrice: 3, species: LIVESTOCK, supplierId: "S03", location: "Armoire 3", lots: [{ lot: "IV50", expiry: "2027-09-30", quantity: 500 }] }),
  item({ id: "P05", name: "Bravecto 20-40 kg", category: "Antiparasitaire", form: "Comprimé à croquer", ...TABLET, alertThreshold: 4, purchasePrice: 210, unitPrice: 320, species: ["Chien"], supplierId: "S04", location: "Armoire 1", lots: [{ lot: "BR12", expiry: "2027-12-31", quantity: 9 }] }),
  item({ id: "P06", name: "Advocate chat", category: "Antiparasitaire", form: "Pipette spot-on", unit: "pipette", unitPlural: "pipettes", alertThreshold: 5, purchasePrice: 62, unitPrice: 95, species: ["Chat"], supplierId: "S04", location: "Armoire 1", lots: [{ lot: "AD44", expiry: "2026-09-10", quantity: 3 }, { lot: "AD51", expiry: "2027-07-31", quantity: 8 }] }),

  // Injectables
  item({ id: "I01", name: "Amoxicilline LA", category: "Injectable", form: "Flacon de 100 ml", ...ML, alertThreshold: 20, purchasePrice: 8, unitPrice: 15, species: ALL, supplierId: "S03", location: "Armoire 2", lots: [{ lot: "AX-LA7", expiry: "2027-01-31", quantity: 100 }] }),
  item({ id: "I02", name: "Méloxicam 5 mg/ml", category: "Injectable", form: "Flacon de 50 ml", ...ML, alertThreshold: 10, purchasePrice: 11, unitPrice: 20, species: ALL, supplierId: "S01", location: "Armoire 2", lots: [{ lot: "MX5-3", expiry: "2026-11-20", quantity: 50 }] }),
  item({ id: "I03", name: "Dexaméthasone", category: "Injectable", form: "Flacon de 50 ml", ...ML, alertThreshold: 10, purchasePrice: 6, unitPrice: 12, species: ALL, supplierId: "S03", location: "Armoire 2", lots: [{ lot: "DX40", expiry: "2027-03-31", quantity: 40 }] }),
  item({ id: "I04", name: "Kétamine 100 mg/ml", category: "Injectable", form: "Flacon de 10 ml", ...ML, alertThreshold: 10, purchasePrice: 14, unitPrice: 25, species: ALL, supplierId: "S02", location: "Coffre sécurisé", lots: [{ lot: "KT88", expiry: "2027-02-28", quantity: 18 }] }),
  item({ id: "I05", name: "Oxytétracycline LA", category: "Injectable", form: "Flacon de 250 ml", ...ML, alertThreshold: 50, purchasePrice: 2, unitPrice: 4, species: LIVESTOCK, supplierId: "S03", location: "Armoire 3", lots: [{ lot: "OX200", expiry: "2027-06-30", quantity: 250 }] }),

  // Médicaments délivrés
  item({ id: "M01", name: "Amoxicilline 250mg", category: "Médicament", form: "Boîte de 10 comprimés", ...BOX, alertThreshold: 5, purchasePrice: 52, unitPrice: 85, species: PETS, supplierId: "S01", location: "Pharmacie", lots: [{ lot: "AM25", expiry: "2027-02-28", quantity: 3 }] }),
  item({ id: "M02", name: "Carprofène 50mg", category: "Médicament", form: "Boîte de 20 comprimés", ...BOX, alertThreshold: 4, purchasePrice: 75, unitPrice: 120, species: ["Chien"], supplierId: "S01", location: "Pharmacie", lots: [{ lot: "CP50", expiry: "2027-05-31", quantity: 14 }] }),
  item({ id: "M03", name: "Métacam 1,5 mg/ml", category: "Médicament", form: "Suspension buvable 32 ml", ...BOTTLE, alertThreshold: 3, purchasePrice: 90, unitPrice: 140, species: PETS, supplierId: "S01", location: "Pharmacie", lots: [{ lot: "MT15", expiry: "2027-01-31", quantity: 9 }] }),
  item({ id: "M04", name: "Otimectin", category: "Médicament", form: "Flacon auriculaire 15 ml", ...BOTTLE, alertThreshold: 3, purchasePrice: 58, unitPrice: 95, species: PETS, supplierId: "S04", location: "Pharmacie", lots: [{ lot: "OT11", expiry: "2026-12-15", quantity: 11 }] }),
  item({ id: "M05", name: "Fenbendazole", category: "Médicament", form: "Boîte de 3 sachets", ...BOX, alertThreshold: 3, purchasePrice: 42, unitPrice: 70, species: ALL, supplierId: "S03", location: "Pharmacie", lots: [{ lot: "FB3", expiry: "2027-08-31", quantity: 8 }] }),
  item({ id: "M06", name: "Bénazépril 2,5mg", category: "Médicament", form: "Boîte de 28 comprimés", ...BOX, alertThreshold: 2, purchasePrice: 68, unitPrice: 110, species: PETS, supplierId: "S02", location: "Pharmacie", lots: [{ lot: "BZ25", expiry: "2027-04-30", quantity: 6 }] }),
  item({ id: "M07", name: "Compléments vitaminés", category: "Médicament", form: "Flacon de 100 ml", ...BOTTLE, alertThreshold: 5, purchasePrice: 35, unitPrice: 60, species: ALL, supplierId: "S04", location: "Pharmacie", lots: [{ lot: "VT5", expiry: "2027-03-31", quantity: 5 }] }),
  item({ id: "M08", name: "Crème dermatologique", category: "Médicament", form: "Tube de 30 g", unit: "tube", unitPlural: "tubes", alertThreshold: 3, purchasePrice: 45, unitPrice: 75, species: PETS, supplierId: "S04", location: "Pharmacie", lots: [{ lot: "CD7", expiry: "2026-10-30", quantity: 7 }] }),
  item({ id: "M09", name: "Prednisolone 5mg", category: "Médicament", form: "Boîte de 20 comprimés", ...BOX, alertThreshold: 3, purchasePrice: 30, unitPrice: 55, species: PETS, supplierId: "S02", location: "Pharmacie", lots: [] }),
  item({ id: "M10", name: "Métronidazole 250mg", category: "Médicament", form: "Boîte de 20 comprimés", ...BOX, alertThreshold: 3, purchasePrice: 38, unitPrice: 65, species: PETS, supplierId: "S01", location: "Pharmacie", lots: [{ lot: "MZ25", expiry: "2027-06-30", quantity: 7 }] }),
  item({ id: "M11", name: "Surolan", category: "Médicament", form: "Flacon auriculaire 15 ml", ...BOTTLE, alertThreshold: 3, purchasePrice: 80, unitPrice: 125, species: PETS, supplierId: "S02", location: "Pharmacie", lots: [{ lot: "SR15", expiry: "2027-02-28", quantity: 4 }] }),
  item({ id: "M12", name: "Cerenia 16mg", category: "Médicament", form: "Boîte de 4 comprimés", ...BOX, alertThreshold: 2, purchasePrice: 150, unitPrice: 230, species: PETS, supplierId: "S02", location: "Pharmacie", lots: [{ lot: "CR16", expiry: "2027-05-31", quantity: 2 }] }),

  // Consommables
  item({ id: "C01", name: "Seringues 5 ml", category: "Consommable", form: "Boîte de 100", ...BOX, alertThreshold: 3, purchasePrice: 45, unitPrice: 70, species: ALL, supplierId: "S05", location: "Réserve", lots: [{ lot: "SR5-26", expiry: "2029-12-31", quantity: 12 }] }),
  item({ id: "C02", name: "Compresses stériles 10×10", category: "Consommable", form: "Paquet de 50", unit: "paquet", unitPlural: "paquets", alertThreshold: 5, purchasePrice: 18, unitPrice: 30, species: ALL, supplierId: "S05", location: "Réserve", lots: [{ lot: "CS1010", expiry: "2028-06-30", quantity: 24 }] }),
  item({ id: "C03", name: "Gants d'examen taille M", category: "Consommable", form: "Boîte de 100", ...BOX, alertThreshold: 4, purchasePrice: 40, unitPrice: 60, species: ALL, supplierId: "S05", location: "Réserve", lots: [{ lot: "GM-09", expiry: "2029-01-31", quantity: 3 }] }),
  item({ id: "C04", name: "Fil résorbable 3-0", category: "Consommable", form: "Sachet stérile 75 cm", unit: "sachet", unitPlural: "sachets", alertThreshold: 10, purchasePrice: 22, unitPrice: 40, species: ALL, supplierId: "S05", location: "Bloc opératoire", lots: [{ lot: "FS30-4", expiry: "2027-10-31", quantity: 36 }] }),
  item({ id: "C05", name: "Cathéter IV 22G", category: "Consommable", form: "Unité stérile", ...PIECE, alertThreshold: 10, purchasePrice: 9, unitPrice: 18, species: ALL, supplierId: "S05", location: "Bloc opératoire", lots: [{ lot: "CT22-7", expiry: "2028-03-31", quantity: 45 }] }),
  item({ id: "C06", name: "Collerette taille M", category: "Consommable", form: "Unité", ...PIECE, alertThreshold: 3, purchasePrice: 25, unitPrice: 45, species: PETS, supplierId: "S05", location: "Réserve", lots: [{ lot: "—", expiry: "", quantity: 8 }] }),
];

/* ------------------------------------------------------------ Mouvements --- */

export type MovementReason = "Consultation" | "Vente" | "Achat" | "Facture fournisseur" | "Ajustement" | "Péremption";

export interface StockMovement {
  id: string;
  date: string;
  productId: string;
  /** Positif pour une entrée, négatif pour une sortie. */
  delta: number;
  reason: MovementReason;
  reference?: string;
}

export const STOCK_MOVEMENTS: StockMovement[] = [];

let movementSeq = 0;
export function logMovement(movement: Omit<StockMovement, "id">) {
  movementSeq += 1;
  STOCK_MOVEMENTS.unshift({ id: `MV${movementSeq}`, ...movement });
}

/* ---------------------------------------------------------------- Lecture --- */

export function findStockItem(id: string | undefined) {
  return id ? STOCK.find((s) => s.id === id) : undefined;
}

export function formatQuantity(item: Pick<StockItem, "unit" | "unitPlural">, quantity: number) {
  const value = new Intl.NumberFormat("fr-FR").format(quantity);
  return `${value} ${Math.abs(quantity) > 1 ? item.unitPlural : item.unit}`;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(date: string, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Nombre de jours entre aujourd'hui et la date donnée (négatif si passée). */
export function daysUntil(date: string) {
  const ms = new Date(date).getTime() - new Date(today()).getTime();
  return Math.round(ms / 86_400_000);
}

/** Lots triés par date de péremption croissante — ordre de sortie (premier périmé, premier sorti). */
export function lotsByExpiry(item: StockItem) {
  return [...item.lots].sort((a, b) => (a.expiry || "9999").localeCompare(b.expiry || "9999"));
}

export function nearestExpiry(item: StockItem) {
  return lotsByExpiry(item).find((l) => l.quantity > 0 && l.expiry)?.expiry;
}

/** Seuil à partir duquel une péremption est signalée. */
export const EXPIRY_WARNING_DAYS = 60;

export type StockStatus = "Rupture" | "Lot périmé" | "Stock bas" | "Péremption proche" | "En stock";

export function stockStatus(item: StockItem): StockStatus {
  if (item.quantity <= 0) return "Rupture";
  const expiry = nearestExpiry(item);
  if (expiry && daysUntil(expiry) < 0) return "Lot périmé";
  if (item.quantity <= item.alertThreshold) return "Stock bas";
  if (expiry && daysUntil(expiry) <= EXPIRY_WARNING_DAYS) return "Péremption proche";
  return "En stock";
}

export const STATUS_BADGE: Record<StockStatus, "danger" | "warning" | "info" | "success"> = {
  Rupture: "danger",
  "Lot périmé": "danger",
  "Stock bas": "warning",
  "Péremption proche": "warning",
  "En stock": "success",
};

/* -------------------------------------------------------------- Écriture --- */

/**
 * Entrée (delta > 0) ou sortie (delta < 0) de stock.
 * Les sorties consomment les lots dans l'ordre de péremption ; une entrée va sur le lot indiqué, sinon le premier lot.
 */
export function adjustStock(
  id: string,
  delta: number,
  movement: { reason: MovementReason; reference?: string; lot?: { lot: string; expiry: string }; date?: string },
) {
  const product = findStockItem(id);
  if (!product || delta === 0) return;

  if (delta > 0) {
    const target = movement.lot
      ? product.lots.find((l) => l.lot === movement.lot!.lot)
      : lotsByExpiry(product).find((l) => l.quantity > 0);
    if (target) target.quantity += delta;
    else product.lots.push({ lot: movement.lot?.lot ?? "—", expiry: movement.lot?.expiry ?? "", quantity: delta });
  } else {
    let remaining = -delta;
    for (const lot of lotsByExpiry(product)) {
      const taken = Math.min(lot.quantity, remaining);
      lot.quantity -= taken;
      remaining -= taken;
      if (remaining === 0) break;
    }
    product.lots = product.lots.filter((l) => l.quantity > 0);
  }

  product.quantity = product.lots.reduce((sum, l) => sum + l.quantity, 0);
  logMovement({ date: movement.date ?? today(), productId: id, delta, reason: movement.reason, reference: movement.reference });
  notifyInventory();
}

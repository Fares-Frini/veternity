import type { StockCategory } from "@/app/(dashboard)/inventory/_components/stock-data";
import {
  AmbulanceIcon,
  BandageIcon,
  Bug01Icon,
  ChipIcon,
  ClipboardCheckIcon,
  DentalCareIcon,
  InjectionIcon,
  StethoscopeIcon,
  TestTube01Icon,
  VaccineIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export type ActId =
  | "consultation"
  | "controle"
  | "urgence"
  | "analyse"
  | "vaccination"
  | "deparasitage"
  | "injection"
  | "soins"
  | "detartrage"
  | "identification";

export type ActGroup = "Examens" | "Actes avec produit" | "Soins et interventions";

export interface ActDefinition {
  id: ActId;
  label: string;
  hint: string;
  icon: IconSvgElement;
  group: ActGroup;
  /** Honoraires de l'acte, en DH, hors produit. */
  price: number;
  /** Si défini, l'acte consomme un produit de cette catégorie du stock. */
  productCategory?: StockCategory;
  productPrompt?: string;
}

export const ACT_GROUPS: ActGroup[] = ["Examens", "Actes avec produit", "Soins et interventions"];

export const ACTS: ActDefinition[] = [
  { id: "consultation", label: "Consultation", hint: "Examen clinique général", icon: StethoscopeIcon, group: "Examens", price: 200 },
  { id: "controle", label: "Consultation de contrôle", hint: "Suivi d'un traitement en cours", icon: ClipboardCheckIcon, group: "Examens", price: 100 },
  { id: "urgence", label: "Supplément urgence", hint: "Hors horaires ou prise en charge immédiate", icon: AmbulanceIcon, group: "Examens", price: 150 },
  { id: "analyse", label: "Analyse sanguine", hint: "Hématologie et biochimie", icon: TestTube01Icon, group: "Examens", price: 350 },
  { id: "vaccination", label: "Vaccination", hint: "Vaccin prélevé sur le stock", icon: VaccineIcon, group: "Actes avec produit", price: 80, productCategory: "Vaccin", productPrompt: "Choisir le vaccin" },
  { id: "deparasitage", label: "Déparasitage", hint: "Antiparasitaire interne ou externe", icon: Bug01Icon, group: "Actes avec produit", price: 30, productCategory: "Antiparasitaire", productPrompt: "Choisir l'antiparasitaire" },
  { id: "injection", label: "Injection", hint: "Traitement injectable", icon: InjectionIcon, group: "Actes avec produit", price: 50, productCategory: "Injectable", productPrompt: "Choisir le produit injecté" },
  { id: "soins", label: "Soins / pansement", hint: "Nettoyage, désinfection, bandage", icon: BandageIcon, group: "Soins et interventions", price: 120 },
  { id: "detartrage", label: "Détartrage", hint: "Sous anesthésie, aux ultrasons", icon: DentalCareIcon, group: "Soins et interventions", price: 600 },
  { id: "identification", label: "Identification", hint: "Pose d'une puce électronique", icon: ChipIcon, group: "Soins et interventions", price: 300 },
];

export function getAct(id: ActId) {
  return ACTS.find((a) => a.id === id)!;
}

export interface VitalRange {
  temperature: [number, number];
  heartRate: [number, number];
  respiratoryRate: [number, number];
}

/** Valeurs usuelles chez l'adulte au repos. */
export const VITAL_RANGES: Record<string, VitalRange> = {
  Chat: { temperature: [38.0, 39.2], heartRate: [140, 220], respiratoryRate: [20, 30] },
  Chien: { temperature: [37.5, 39.2], heartRate: [60, 140], respiratoryRate: [10, 30] },
  Lapin: { temperature: [38.5, 40.0], heartRate: [180, 300], respiratoryRate: [30, 60] },
  Oiseau: { temperature: [40.0, 42.0], heartRate: [250, 400], respiratoryRate: [15, 45] },
  Mouton: { temperature: [38.5, 40.0], heartRate: [70, 90], respiratoryRate: [12, 20] },
  Vache: { temperature: [38.0, 39.5], heartRate: [48, 84], respiratoryRate: [26, 50] },
  Chèvre: { temperature: [38.5, 40.5], heartRate: [70, 90], respiratoryRate: [15, 30] },
  Volaille: { temperature: [40.6, 43.0], heartRate: [250, 300], respiratoryRate: [15, 40] },
};

export function vitalStatus(value: number | undefined, range: [number, number] | undefined) {
  if (value === undefined || Number.isNaN(value) || !range) return "normal";
  if (value < range[0]) return "low";
  if (value > range[1]) return "high";
  return "normal";
}

export function formatNumber(value: number, maxDecimals = 1) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: maxDecimals }).format(value);
}

/** Montant en DH : entier tel quel, centimes affichés seulement quand il y en a. */
export function formatPrice(value: number) {
  const decimals = Number.isInteger(Math.round(value * 100) / 100) ? 0 : 2;
  return `${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: 2 }).format(value)} DH`;
}

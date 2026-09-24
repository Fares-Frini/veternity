export type BilanPeriod = "daily" | "weekly" | "monthly";

export const BILAN_PERIODS: { value: BilanPeriod; label: string }[] = [
  { value: "daily", label: "Journalier" },
  { value: "weekly", label: "Hebdo" },
  { value: "monthly", label: "Mensuel" },
];

export const PERIOD_NOUN: Record<BilanPeriod, string> = {
  daily: "aujourd'hui",
  weekly: "cette semaine",
  monthly: "ce mois",
};

export const PERIOD_BUCKET_NOUN: Record<BilanPeriod, string> = {
  daily: "jour",
  weekly: "semaine",
  monthly: "mois",
};

export const CURRENCY = "DH";

export function formatMoney(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(value))} ${CURRENCY}`;
}

export interface FinanceBucket {
  label: string;
  /** Argent effectivement rentré. */
  encaisse: number;
  /** Facturé mais impayé — à relancer. */
  impaye: number;
  /** Acte réalisé, pas encore facturé. */
  attente: number;
}

export interface StockBucket {
  label: string;
  /** Réappro / achats entrés en stock. */
  entrees: number;
  /** Produits consommés ou vendus. */
  sorties: number;
}

export interface Bilan {
  period: BilanPeriod;
  finance: FinanceBucket[];
  stock: StockBucket[];
  clientsRecus: number;
  clientsRecusPrev: number;
  totalEncaisse: number;
  totalImpaye: number;
  totalAttente: number;
  totalFacture: number;
  /** Part de l'encaissé sur le total facturé, 0..1. */
  tauxRecouvrement: number;
}

/** Petit générateur pseudo-aléatoire déterministe (Lehmer) — données stables entre SSR et client. */
function rng(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTH_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

function bucketLabels(period: BilanPeriod): string[] {
  if (period === "daily") return DAY_LABELS;
  if (period === "weekly") return ["S-5", "S-4", "S-3", "S-2", "S-1", "Cette sem."];
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => MONTH_LABELS[(now.getMonth() - (5 - i) + 12) % 12]);
}

/** Multiplicateur de volume : une journée < une semaine < un mois. */
const VOLUME: Record<BilanPeriod, number> = { daily: 1, weekly: 6, monthly: 26 };
const SEED: Record<BilanPeriod, number> = { daily: 11, weekly: 37, monthly: 91 };
const CLIENTS: Record<BilanPeriod, [current: number, previous: number]> = {
  daily: [14, 12],
  weekly: [82, 76],
  monthly: [318, 291],
};

export function getBilan(period: BilanPeriod): Bilan {
  const labels = bucketLabels(period);
  const rand = rng(SEED[period]);
  const k = VOLUME[period];

  const finance: FinanceBucket[] = labels.map((label, i) => {
    const weekendDip = period === "daily" && (i === 5 || i === 6) ? 0.4 : 1;
    const facture = (2400 + rand() * 2800) * k * (0.75 + rand() * 0.5) * weekendDip;
    const encaisse = facture * (0.6 + rand() * 0.28);
    const impaye = (facture - encaisse) * (0.4 + rand() * 0.4);
    const attente = Math.max(0, facture - encaisse - impaye);
    return {
      label,
      encaisse: Math.round(encaisse),
      impaye: Math.round(impaye),
      attente: Math.round(attente),
    };
  });

  const stock: StockBucket[] = labels.map((label, i) => {
    const weekendDip = period === "daily" && (i === 5 || i === 6) ? 0.3 : 1;
    return {
      label,
      entrees: Math.round((5 + rand() * 20) * k * weekendDip),
      sorties: Math.round((8 + rand() * 24) * k * weekendDip),
    };
  });

  const totalEncaisse = finance.reduce((sum, b) => sum + b.encaisse, 0);
  const totalImpaye = finance.reduce((sum, b) => sum + b.impaye, 0);
  const totalAttente = finance.reduce((sum, b) => sum + b.attente, 0);
  const totalFacture = totalEncaisse + totalImpaye + totalAttente;

  return {
    period,
    finance,
    stock,
    clientsRecus: CLIENTS[period][0],
    clientsRecusPrev: CLIENTS[period][1],
    totalEncaisse,
    totalImpaye,
    totalAttente,
    totalFacture,
    tauxRecouvrement: totalFacture ? totalEncaisse / totalFacture : 0,
  };
}

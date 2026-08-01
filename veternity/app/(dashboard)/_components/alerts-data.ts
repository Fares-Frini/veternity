export type AlertType = "stock" | "vaccination" | "rdv" | "facture";
export type AlertSeverity = "high" | "medium" | "low";

export interface DashboardAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  detail: string;
  dueDate: string;
}
export const ALERTS: DashboardAlert[] = [
  { id: "AL01", type: "stock", severity: "high", title: "Stock faible — Amoxicilline 250mg", detail: "Il ne reste que 3 boîtes en stock", dueDate: "2026-08-01" },
  { id: "AL02", type: "rdv", severity: "high", title: "RDV non confirmé — Mango", detail: "En attente de confirmation depuis le 31 juillet", dueDate: "2026-07-31" },
  { id: "AL03", type: "vaccination", severity: "high", title: "Rappel vaccinal — Rex", detail: "Vaccin antirabique à renouveler", dueDate: "2026-08-02" },
  { id: "AL04", type: "facture", severity: "medium", title: "Facture en retard — F-1042", detail: "Paiement en attente depuis 12 jours", dueDate: "2026-08-01" },
  { id: "AL05", type: "rdv", severity: "medium", title: "RDV non confirmé — Coco", detail: "En attente de confirmation pour le 2 août", dueDate: "2026-08-02" },
  { id: "AL06", type: "vaccination", severity: "medium", title: "Rappel vaccinal — Coco", detail: "Vaccin polyvalent oiseaux à prévoir", dueDate: "2026-08-04" },
  { id: "AL07", type: "stock", severity: "low", title: "Stock faible — Compléments vitaminés", detail: "Il reste 5 unités", dueDate: "2026-08-05" },
];

export type ConsultationStatus = "Terminée" | "En cours" | "Annulée";

export interface ConsultationAct {
  label: string;
  /** Produit utilisé, quantité… */
  detail?: string;
  amount: number;
}

export interface ConsultationVitals {
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
}

export interface Consultation {
  id: string;
  animal: string;
  species: string;
  owner: string;
  vet: string;
  date: string;
  diagnostic: string;
  status: ConsultationStatus;
  weightKg: number;
  motif?: string;
  vitals?: ConsultationVitals;
  acts?: ConsultationAct[];
  invoiceId?: string;
  total?: number;
}

export const CONSULTATIONS: Consultation[] = [
  {
    id: "C001", animal: "Luna", species: "Chat", owner: "Leila Mansouri", vet: "Dr. Kadiri", date: "2026-07-28",
    diagnostic: "Otite externe de l'oreille droite, cérumen abondant, pas d'atteinte du tympan.", status: "Terminée", weightKg: 4.0,
    motif: "Se gratte l'oreille droite et secoue la tête depuis une semaine",
    vitals: { temperature: 38.7, heartRate: 176, respiratoryRate: 26 },
    acts: [
      { label: "Consultation", amount: 200 },
      { label: "Soins / pansement", detail: "Nettoyage auriculaire", amount: 120 },
    ],
    total: 320, invoiceId: "F-1041",
  },
  { id: "C002", animal: "Rex", species: "Chien", owner: "Karim Bouzidi", vet: "Dr. Amrani", date: "2026-07-28", diagnostic: "Entorse patte avant", status: "Terminée", weightKg: 28.0 },
  { id: "C003", animal: "Noisette", species: "Lapin", owner: "Sara El Fassi", vet: "Dr. Kadiri", date: "2026-07-29", diagnostic: "Contrôle post-opératoire", status: "Terminée", weightKg: 1.7 },
  { id: "C004", animal: "Simba", species: "Chat", owner: "Fatima Alaoui", vet: "Dr. Amrani", date: "2026-07-29", diagnostic: "Gingivite", status: "Terminée", weightKg: 5.0 },
  { id: "C005", animal: "Bella", species: "Chien", owner: "Yassine Idrissi", vet: "Dr. Kadiri", date: "2026-07-30", diagnostic: "Bilan de santé annuel", status: "En cours", weightKg: 11.0 },
  { id: "C006", animal: "Mango", species: "Oiseau", owner: "Sara El Fassi", vet: "Dr. Amrani", date: "2026-07-30", diagnostic: "Perte de plumes", status: "En cours", weightKg: 0.38 },
  { id: "C007", animal: "Milo", species: "Chien", owner: "Omar Ziani", vet: "Dr. Kadiri", date: "2026-07-30", diagnostic: "Suivi post-stérilisation", status: "En cours", weightKg: 31.5 },
  { id: "C008", animal: "Tom", species: "Chat", owner: "Amine Tazi", vet: "Dr. Kadiri", date: "2026-07-31", diagnostic: "Vomissements récurrents", status: "En cours", weightKg: 6.6 },
  { id: "C009", animal: "Zorro", species: "Chien", owner: "Hicham Alami", vet: "Dr. Amrani", date: "2026-07-27", diagnostic: "Consultation annulée par le client", status: "Annulée", weightKg: 24.0 },
  {
    id: "C010", animal: "Nala", species: "Chat", owner: "Salma Idrissi", vet: "Dr. Kadiri", date: "2026-07-26",
    diagnostic: "Dermatite allergique, probablement alimentaire. Lésions sur le cou et les flancs.", status: "Terminée", weightKg: 4.3,
    motif: "Perte de poils et démangeaisons",
    vitals: { temperature: 38.9, heartRate: 190, respiratoryRate: 28 },
    acts: [
      { label: "Consultation", amount: 200 },
      { label: "Injection", detail: "Dexaméthasone · 1 ml", amount: 62 },
    ],
    total: 262, invoiceId: "F-1040",
  },
  {
    id: "C011", animal: "Rocky", species: "Chien", owner: "Mehdi Chraibi", vet: "Dr. Amrani", date: "2026-07-25",
    diagnostic: "Bon état général. Rappel vaccinal effectué, vermifugation de routine.", status: "Terminée", weightKg: 13.0,
    motif: "Rappel vaccinal annuel",
    vitals: { temperature: 38.5, heartRate: 96, respiratoryRate: 20 },
    acts: [
      { label: "Consultation", amount: 200 },
      { label: "Vaccination", detail: "Nobivac DHPPi · 1 dose", amount: 230 },
      { label: "Déparasitage", detail: "Milbemax chien · 1 comprimé", amount: 75 },
    ],
    total: 505, invoiceId: "F-1039",
  },
  { id: "C012", animal: "Minou", species: "Chat", owner: "Imane Saidi", vet: "Dr. Kadiri", date: "2026-07-24", diagnostic: "Insuffisance rénale légère", status: "Terminée", weightKg: 3.9 },
  {
    id: "C013", animal: "Oscar", species: "Chien", owner: "Khadija Ouazzani", vet: "Dr. Amrani", date: "2026-07-23",
    diagnostic: "Otite bilatérale à levures. Conduits érythémateux, odeur marquée.", status: "Terminée", weightKg: 29.5,
    motif: "Oreilles rouges et odeur forte",
    vitals: { temperature: 39.0, heartRate: 88, respiratoryRate: 18 },
    acts: [
      { label: "Consultation", amount: 200 },
      { label: "Soins / pansement", detail: "Nettoyage des deux conduits", amount: 120 },
    ],
    total: 320, invoiceId: "F-1038",
  },
  { id: "C014", animal: "Lola", species: "Chat", owner: "Amine Tazi", vet: "Dr. Kadiri", date: "2026-08-01", diagnostic: "Consultation de routine", status: "En cours", weightKg: 5.2 },
];

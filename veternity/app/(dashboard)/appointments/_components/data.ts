export type AppointmentStatus = "Confirmé" | "En attente" | "Terminé" | "Annulé";

export interface Appointment {
  id: string;
  date: string;
  time: string;
  animal: string;
  species: string;
  owner: string;
  reason: string;
  vet: string;
  status: AppointmentStatus;
}

export const VETS = ["Dr. Kadiri", "Dr. Amrani"];

export const APPOINTMENTS: Appointment[] = [
  { id: "R001", date: "2026-07-30", time: "09:00", animal: "Luna", species: "Chat", owner: "Leila Mansouri", reason: "Vaccination annuelle", vet: "Dr. Kadiri", status: "Confirmé" },
  { id: "R002", date: "2026-07-30", time: "09:30", animal: "Rex", species: "Chien", owner: "Karim Bouzidi", reason: "Consultation générale", vet: "Dr. Amrani", status: "Confirmé" },
  { id: "R003", date: "2026-07-30", time: "10:15", animal: "Noisette", species: "Lapin", owner: "Sara El Fassi", reason: "Contrôle post-opératoire", vet: "Dr. Kadiri", status: "En attente" },
  { id: "R004", date: "2026-07-30", time: "11:00", animal: "Simba", species: "Chat", owner: "Fatima Alaoui", reason: "Détartrage dentaire", vet: "Dr. Amrani", status: "Confirmé" },
  { id: "R005", date: "2026-07-31", time: "09:00", animal: "Bella", species: "Chien", owner: "Yassine Idrissi", reason: "Bilan de santé", vet: "Dr. Kadiri", status: "Confirmé" },
  { id: "R006", date: "2026-07-31", time: "10:00", animal: "Mango", species: "Oiseau", owner: "Sara El Fassi", reason: "Consultation générale", vet: "Dr. Amrani", status: "En attente" },
  { id: "R007", date: "2026-07-31", time: "14:30", animal: "Milo", species: "Chien", owner: "Omar Ziani", reason: "Chirurgie - stérilisation", vet: "Dr. Kadiri", status: "Confirmé" },
  { id: "R008", date: "2026-08-01", time: "09:30", animal: "Choupette", species: "Chat", owner: "Nadia Berrada", reason: "Vaccination annuelle", vet: "Dr. Amrani", status: "Confirmé" },
  { id: "R009", date: "2026-08-01", time: "11:15", animal: "Tom", species: "Chat", owner: "Amine Tazi", reason: "Urgence - vomissements", vet: "Dr. Kadiri", status: "Confirmé" },
  { id: "R010", date: "2026-08-01", time: "15:00", animal: "Zorro", species: "Chien", owner: "Hicham Alami", reason: "Toilettage médical", vet: "Dr. Amrani", status: "Annulé" },
  { id: "R011", date: "2026-08-02", time: "09:00", animal: "Nala", species: "Chat", owner: "Salma Idrissi", reason: "Consultation générale", vet: "Dr. Kadiri", status: "Confirmé" },
  { id: "R012", date: "2026-08-02", time: "10:30", animal: "Coco", species: "Oiseau", owner: "Rania Fassi", reason: "Bilan de santé", vet: "Dr. Amrani", status: "En attente" },
  { id: "R013", date: "2026-07-28", time: "09:00", animal: "Rocky", species: "Chien", owner: "Mehdi Chraibi", reason: "Vaccination annuelle", vet: "Dr. Kadiri", status: "Terminé" },
  { id: "R014", date: "2026-07-28", time: "10:45", animal: "Minou", species: "Chat", owner: "Imane Saidi", reason: "Contrôle post-opératoire", vet: "Dr. Amrani", status: "Terminé" },
  { id: "R015", date: "2026-07-29", time: "09:15", animal: "Pixel", species: "Lapin", owner: "Youssef Benali", reason: "Consultation générale", vet: "Dr. Kadiri", status: "Terminé" },
  { id: "R016", date: "2026-07-29", time: "13:30", animal: "Oscar", species: "Chien", owner: "Khadija Ouazzani", reason: "Détartrage dentaire", vet: "Dr. Amrani", status: "Terminé" },
  { id: "R017", date: "2026-08-03", time: "09:00", animal: "Lola", species: "Chat", owner: "Amine Tazi", reason: "Chirurgie - stérilisation", vet: "Dr. Kadiri", status: "Confirmé" },
  { id: "R018", date: "2026-08-03", time: "11:00", animal: "Max", species: "Chien", owner: "Leila Mansouri", reason: "Vaccination annuelle", vet: "Dr. Amrani", status: "Confirmé" },
];

export interface Prescription {
  id: string;
  animal: string;
  species: string;
  owner: string;
  medications: string;
  posology: string;
  date: string;
  vet: string;
}

export const PRESCRIPTIONS: Prescription[] = [
  { id: "P001", animal: "Luna", species: "Chat", owner: "Leila Mansouri", medications: "Otimectin", posology: "3 gouttes/oreille, 2x/jour, 7 jours", date: "2026-07-28", vet: "Dr. Kadiri" },
  { id: "P002", animal: "Rex", species: "Chien", owner: "Karim Bouzidi", medications: "Carprofène 50mg", posology: "1 cp/jour, 5 jours", date: "2026-07-28", vet: "Dr. Amrani" },
  { id: "P003", animal: "Simba", species: "Chat", owner: "Fatima Alaoui", medications: "Métacam", posology: "0,5 ml/jour, 3 jours", date: "2026-07-29", vet: "Dr. Amrani" },
  { id: "P004", animal: "Mango", species: "Oiseau", owner: "Sara El Fassi", medications: "Complément vitaminé", posology: "5 gouttes dans l'eau, 10 jours", date: "2026-07-30", vet: "Dr. Amrani" },
  { id: "P005", animal: "Milo", species: "Chien", owner: "Omar Ziani", medications: "Amoxicilline 250mg", posology: "1 cp matin et soir, 10 jours", date: "2026-07-30", vet: "Dr. Kadiri" },
  { id: "P006", animal: "Tom", species: "Chat", owner: "Amine Tazi", medications: "Ranitidine", posology: "1/4 cp, 2x/jour, 5 jours", date: "2026-07-31", vet: "Dr. Kadiri" },
  { id: "P007", animal: "Nala", species: "Chat", owner: "Salma Idrissi", medications: "Crème dermatologique", posology: "Application locale, 2x/jour, 14 jours", date: "2026-07-26", vet: "Dr. Kadiri" },
  { id: "P008", animal: "Rocky", species: "Chien", owner: "Mehdi Chraibi", medications: "Vaccin polyvalent", posology: "Injection unique", date: "2026-07-25", vet: "Dr. Amrani" },
  { id: "P009", animal: "Minou", species: "Chat", owner: "Imane Saidi", medications: "Bénazépril 2,5mg", posology: "1/2 cp/jour, en continu", date: "2026-07-24", vet: "Dr. Kadiri" },
  { id: "P010", animal: "Oscar", species: "Chien", owner: "Khadija Ouazzani", medications: "Otoflush + Surolan", posology: "Nettoyage puis 4 gouttes/oreille, 7 jours", date: "2026-07-23", vet: "Dr. Amrani" },
  { id: "P011", animal: "Lola", species: "Chat", owner: "Amine Tazi", medications: "Fenbendazole", posology: "1 dose/jour, 3 jours", date: "2026-08-01", vet: "Dr. Kadiri" },
];

export type AnimalKind = "individuel" | "troupeau";
export type AnimalSex = "M" | "F" | "Mixte";

export interface Animal {
  id: string;
  /** Un animal unique, ou un lot / troupeau (ex: 50 moutons d'un éleveur). */
  kind: AnimalKind;
  /** Nom de l'animal, ou libellé du lot pour un troupeau. */
  name: string;
  /** Nombre de têtes. Toujours 1 pour un individuel. */
  count: number;
  sex: AnimalSex;
  species: string;
  breed: string;
  coat: string;
  /** Date de naissance. Peut être vide pour un troupeau. */
  birthDate: string;
  /** Poids de l'animal, ou poids moyen par tête pour un troupeau. 0 si inconnu. */
  weightKg: number;
  owner: string;
}

const individuel = (
  a: Omit<Animal, "kind" | "count"> & Partial<Pick<Animal, "count">>,
): Animal => ({ kind: "individuel", count: 1, ...a });

export const ANIMALS: Animal[] = [
  individuel({ id: "A001", name: "Luna", sex: "F", species: "Chat", breed: "Persan", coat: "Blanc", birthDate: "2022-03-14", weightKg: 4.2, owner: "Leila Mansouri" }),
  individuel({ id: "A002", name: "Rex", sex: "M", species: "Chien", breed: "Labrador", coat: "Fauve", birthDate: "2021-07-02", weightKg: 28.5, owner: "Karim Bouzidi" }),
  individuel({ id: "A003", name: "Noisette", sex: "F", species: "Lapin", breed: "Bélier", coat: "Marron", birthDate: "2023-01-20", weightKg: 1.8, owner: "Sara El Fassi" }),
  individuel({ id: "A004", name: "Simba", sex: "M", species: "Chat", breed: "Européen", coat: "Roux", birthDate: "2020-11-05", weightKg: 5.1, owner: "Fatima Alaoui" }),
  individuel({ id: "A005", name: "Bella", sex: "F", species: "Chien", breed: "Bulldog Français", coat: "Bringé", birthDate: "2022-09-18", weightKg: 11.3, owner: "Yassine Idrissi" }),
  individuel({ id: "A006", name: "Mango", sex: "M", species: "Oiseau", breed: "Perroquet Gris du Gabon", coat: "Gris", birthDate: "2019-05-30", weightKg: 0.4, owner: "Sara El Fassi" }),
  individuel({ id: "A007", name: "Milo", sex: "M", species: "Chien", breed: "Berger Allemand", coat: "Noir et feu", birthDate: "2021-02-10", weightKg: 32.0, owner: "Omar Ziani" }),
  individuel({ id: "A008", name: "Choupette", sex: "F", species: "Chat", breed: "Siamois", coat: "Seal point", birthDate: "2023-06-01", weightKg: 3.6, owner: "Nadia Berrada" }),
  individuel({ id: "A009", name: "Tom", sex: "M", species: "Chat", breed: "Maine Coon", coat: "Tigré", birthDate: "2019-08-22", weightKg: 6.8, owner: "Amine Tazi" }),
  individuel({ id: "A010", name: "Zorro", sex: "M", species: "Chien", breed: "Husky Sibérien", coat: "Noir et blanc", birthDate: "2020-04-12", weightKg: 24.0, owner: "Hicham Alami" }),
  individuel({ id: "A011", name: "Nala", sex: "F", species: "Chat", breed: "Bengal", coat: "Doré tacheté", birthDate: "2022-01-09", weightKg: 4.5, owner: "Salma Idrissi" }),
  individuel({ id: "A012", name: "Coco", sex: "F", species: "Oiseau", breed: "Perruche Ondulée", coat: "Vert", birthDate: "2023-03-15", weightKg: 0.05, owner: "Rania Fassi" }),
  individuel({ id: "A013", name: "Rocky", sex: "M", species: "Chien", breed: "Beagle", coat: "Tricolore", birthDate: "2021-10-30", weightKg: 13.5, owner: "Mehdi Chraibi" }),
  individuel({ id: "A014", name: "Minou", sex: "F", species: "Chat", breed: "Chartreux", coat: "Bleu", birthDate: "2020-06-17", weightKg: 4.0, owner: "Imane Saidi" }),
  individuel({ id: "A015", name: "Pixel", sex: "M", species: "Lapin", breed: "Nain", coat: "Blanc et noir", birthDate: "2023-05-02", weightKg: 1.3, owner: "Youssef Benali" }),
  individuel({ id: "A016", name: "Oscar", sex: "M", species: "Chien", breed: "Golden Retriever", coat: "Doré", birthDate: "2019-12-25", weightKg: 30.2, owner: "Khadija Ouazzani" }),
  individuel({ id: "A017", name: "Lola", sex: "F", species: "Chat", breed: "Ragdoll", coat: "Colourpoint", birthDate: "2022-07-08", weightKg: 5.4, owner: "Amine Tazi" }),
  individuel({ id: "A018", name: "Max", sex: "M", species: "Chien", breed: "Jack Russell", coat: "Blanc et fauve", birthDate: "2021-05-19", weightKg: 7.2, owner: "Leila Mansouri" }),
  individuel({ id: "A019", name: "Kiwi", sex: "M", species: "Oiseau", breed: "Canari", coat: "Jaune", birthDate: "2023-02-14", weightKg: 0.03, owner: "Rania Fassi" }),
  individuel({ id: "A020", name: "Cannelle", sex: "F", species: "Lapin", breed: "Angora", coat: "Roux", birthDate: "2022-11-11", weightKg: 2.1, owner: "Karim Bouzidi" }),
  individuel({ id: "A021", name: "Loulou", sex: "M", species: "Chien", breed: "Caniche", coat: "Blanc", birthDate: "2020-09-03", weightKg: 6.5, owner: "Salma Idrissi" }),
  individuel({ id: "A022", name: "Filou", sex: "M", species: "Chat", breed: "British Shorthair", coat: "Gris bleu", birthDate: "2021-08-27", weightKg: 5.8, owner: "Hicham Alami" }),
  individuel({ id: "A023", name: "Praline", sex: "F", species: "Lapin", breed: "Rex", coat: "Chocolat", birthDate: "2023-04-06", weightKg: 1.6, owner: "Sara El Fassi" }),
  individuel({ id: "A024", name: "Titan", sex: "M", species: "Chien", breed: "Cocker Spaniel", coat: "Roux", birthDate: "2019-03-28", weightKg: 14.8, owner: "Omar Ziani" }),
  individuel({ id: "A025", name: "Whiskers", sex: "M", species: "Chat", breed: "Sphynx", coat: "Rose", birthDate: "2022-05-16", weightKg: 3.9, owner: "Mehdi Chraibi" }),
  individuel({ id: "A026", name: "Cléo", sex: "F", species: "Chat", breed: "Sacré de Birmanie", coat: "Crème", birthDate: "2021-01-23", weightKg: 4.4, owner: "Nadia Berrada" }),
  individuel({ id: "A027", name: "Balou", sex: "M", species: "Lapin", breed: "Géant des Flandres", coat: "Gris", birthDate: "2020-10-14", weightKg: 5.5, owner: "Youssef Benali" }),
  individuel({ id: "A028", name: "Pepper", sex: "F", species: "Chien", breed: "Yorkshire Terrier", coat: "Noir et feu", birthDate: "2023-07-19", weightKg: 2.8, owner: "Fatima Alaoui" }),

  // Troupeaux — éleveurs consultant pour un lot d'animaux
  { id: "A101", kind: "troupeau", name: "Troupeau ovin Nord", count: 52, sex: "Mixte", species: "Mouton", breed: "Sardi", coat: "Blanc", birthDate: "", weightKg: 45, owner: "Ferme Ait Baha" },
  { id: "A102", kind: "troupeau", name: "Cheptel bovin laitier", count: 18, sex: "F", species: "Vache", breed: "Holstein", coat: "Noir et blanc", birthDate: "", weightKg: 620, owner: "Brahim Ouhadi" },
  { id: "A103", kind: "troupeau", name: "Troupeau caprin", count: 34, sex: "Mixte", species: "Chèvre", breed: "Alpine", coat: "Chamoisé", birthDate: "", weightKg: 38, owner: "Coopérative Tafraout" },
  { id: "A104", kind: "troupeau", name: "Poulailler pondeuses", count: 240, sex: "F", species: "Volaille", breed: "ISA Brown", coat: "Roux", birthDate: "", weightKg: 1.9, owner: "Ferme El Menzeh" },
  { id: "A105", kind: "troupeau", name: "Lot d'agneaux à l'engraissement", count: 76, sex: "Mixte", species: "Mouton", breed: "Boujaâd", coat: "Blanc", birthDate: "2025-02-01", weightKg: 22, owner: "Said Benali" },
];

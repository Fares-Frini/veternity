export interface Animal {
  id: string;
  name: string;
  sex: "M" | "F";
  species: string;
  breed: string;
  coat: string;
  birthDate: string;
  weightKg: number;
  owner: string;
}

export const ANIMALS: Animal[] = [
  { id: "A001", name: "Luna", sex: "F", species: "Chat", breed: "Persan", coat: "Blanc", birthDate: "2022-03-14", weightKg: 4.2, owner: "Leila Mansouri" },
  { id: "A002", name: "Rex", sex: "M", species: "Chien", breed: "Labrador", coat: "Fauve", birthDate: "2021-07-02", weightKg: 28.5, owner: "Karim Bouzidi" },
  { id: "A003", name: "Noisette", sex: "F", species: "Lapin", breed: "Bélier", coat: "Marron", birthDate: "2023-01-20", weightKg: 1.8, owner: "Sara El Fassi" },
  { id: "A004", name: "Simba", sex: "M", species: "Chat", breed: "Européen", coat: "Roux", birthDate: "2020-11-05", weightKg: 5.1, owner: "Fatima Alaoui" },
  { id: "A005", name: "Bella", sex: "F", species: "Chien", breed: "Bulldog Français", coat: "Bringé", birthDate: "2022-09-18", weightKg: 11.3, owner: "Yassine Idrissi" },
  { id: "A006", name: "Mango", sex: "M", species: "Oiseau", breed: "Perroquet Gris du Gabon", coat: "Gris", birthDate: "2019-05-30", weightKg: 0.4, owner: "Sara El Fassi" },
  { id: "A007", name: "Milo", sex: "M", species: "Chien", breed: "Berger Allemand", coat: "Noir et feu", birthDate: "2021-02-10", weightKg: 32.0, owner: "Omar Ziani" },
  { id: "A008", name: "Choupette", sex: "F", species: "Chat", breed: "Siamois", coat: "Seal point", birthDate: "2023-06-01", weightKg: 3.6, owner: "Nadia Berrada" },
  { id: "A009", name: "Tom", sex: "M", species: "Chat", breed: "Maine Coon", coat: "Tigré", birthDate: "2019-08-22", weightKg: 6.8, owner: "Amine Tazi" },
  { id: "A010", name: "Zorro", sex: "M", species: "Chien", breed: "Husky Sibérien", coat: "Noir et blanc", birthDate: "2020-04-12", weightKg: 24.0, owner: "Hicham Alami" },
  { id: "A011", name: "Nala", sex: "F", species: "Chat", breed: "Bengal", coat: "Doré tacheté", birthDate: "2022-01-09", weightKg: 4.5, owner: "Salma Idrissi" },
  { id: "A012", name: "Coco", sex: "F", species: "Oiseau", breed: "Perruche Ondulée", coat: "Vert", birthDate: "2023-03-15", weightKg: 0.05, owner: "Rania Fassi" },
  { id: "A013", name: "Rocky", sex: "M", species: "Chien", breed: "Beagle", coat: "Tricolore", birthDate: "2021-10-30", weightKg: 13.5, owner: "Mehdi Chraibi" },
  { id: "A014", name: "Minou", sex: "F", species: "Chat", breed: "Chartreux", coat: "Bleu", birthDate: "2020-06-17", weightKg: 4.0, owner: "Imane Saidi" },
  { id: "A015", name: "Pixel", sex: "M", species: "Lapin", breed: "Nain", coat: "Blanc et noir", birthDate: "2023-05-02", weightKg: 1.3, owner: "Youssef Benali" },
  { id: "A016", name: "Oscar", sex: "M", species: "Chien", breed: "Golden Retriever", coat: "Doré", birthDate: "2019-12-25", weightKg: 30.2, owner: "Khadija Ouazzani" },
  { id: "A017", name: "Lola", sex: "F", species: "Chat", breed: "Ragdoll", coat: "Colourpoint", birthDate: "2022-07-08", weightKg: 5.4, owner: "Amine Tazi" },
  { id: "A018", name: "Max", sex: "M", species: "Chien", breed: "Jack Russell", coat: "Blanc et fauve", birthDate: "2021-05-19", weightKg: 7.2, owner: "Leila Mansouri" },
  { id: "A019", name: "Kiwi", sex: "M", species: "Oiseau", breed: "Canari", coat: "Jaune", birthDate: "2023-02-14", weightKg: 0.03, owner: "Rania Fassi" },
  { id: "A020", name: "Cannelle", sex: "F", species: "Lapin", breed: "Angora", coat: "Roux", birthDate: "2022-11-11", weightKg: 2.1, owner: "Karim Bouzidi" },
  { id: "A021", name: "Loulou", sex: "M", species: "Chien", breed: "Caniche", coat: "Blanc", birthDate: "2020-09-03", weightKg: 6.5, owner: "Salma Idrissi" },
  { id: "A022", name: "Filou", sex: "M", species: "Chat", breed: "British Shorthair", coat: "Gris bleu", birthDate: "2021-08-27", weightKg: 5.8, owner: "Hicham Alami" },
  { id: "A023", name: "Praline", sex: "F", species: "Lapin", breed: "Rex", coat: "Chocolat", birthDate: "2023-04-06", weightKg: 1.6, owner: "Sara El Fassi" },
  { id: "A024", name: "Titan", sex: "M", species: "Chien", breed: "Cocker Spaniel", coat: "Roux", birthDate: "2019-03-28", weightKg: 14.8, owner: "Omar Ziani" },
  { id: "A025", name: "Whiskers", sex: "M", species: "Chat", breed: "Sphynx", coat: "Rose", birthDate: "2022-05-16", weightKg: 3.9, owner: "Mehdi Chraibi" },
  { id: "A026", name: "Cléo", sex: "F", species: "Chat", breed: "Sacré de Birmanie", coat: "Crème", birthDate: "2021-01-23", weightKg: 4.4, owner: "Nadia Berrada" },
  { id: "A027", name: "Balou", sex: "M", species: "Lapin", breed: "Géant des Flandres", coat: "Gris", birthDate: "2020-10-14", weightKg: 5.5, owner: "Youssef Benali" },
  { id: "A028", name: "Pepper", sex: "F", species: "Chien", breed: "Yorkshire Terrier", coat: "Noir et feu", birthDate: "2023-07-19", weightKg: 2.8, owner: "Fatima Alaoui" },
];

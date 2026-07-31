export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  animalsCount: number;
}

export const CLIENTS: Client[] = [
  { id: "C001", name: "Leila Mansouri", email: "leila.mansouri@gmail.com", phone: "+212 661 234 567", address: "12 Rue Al Massira, Casablanca", animalsCount: 2 },
  { id: "C002", name: "Karim Bouzidi", email: "karim.bouzidi@gmail.com", phone: "+212 662 345 678", address: "45 Avenue Hassan II, Rabat", animalsCount: 2 },
  { id: "C003", name: "Sara El Fassi", email: "sara.elfassi@gmail.com", phone: "+212 663 456 789", address: "8 Rue Ibn Sina, Marrakech", animalsCount: 3 },
  { id: "C004", name: "Fatima Alaoui", email: "fatima.alaoui@gmail.com", phone: "+212 664 567 890", address: "23 Boulevard Zerktouni, Casablanca", animalsCount: 2 },
  { id: "C005", name: "Yassine Idrissi", email: "yassine.idrissi@gmail.com", phone: "+212 665 678 901", address: "3 Rue des Orangers, Fès", animalsCount: 1 },
  { id: "C006", name: "Omar Ziani", email: "omar.ziani@gmail.com", phone: "+212 666 789 012", address: "17 Avenue Mohammed V, Tanger", animalsCount: 2 },
  { id: "C007", name: "Nadia Berrada", email: "nadia.berrada@gmail.com", phone: "+212 667 890 123", address: "56 Rue Moulay Ismail, Meknès", animalsCount: 2 },
  { id: "C008", name: "Amine Tazi", email: "amine.tazi@gmail.com", phone: "+212 668 901 234", address: "9 Rue Tarik Ibnou Ziad, Agadir", animalsCount: 2 },
  { id: "C009", name: "Hicham Alami", email: "hicham.alami@gmail.com", phone: "+212 669 012 345", address: "31 Boulevard Anfa, Casablanca", animalsCount: 2 },
  { id: "C010", name: "Salma Idrissi", email: "salma.idrissi@gmail.com", phone: "+212 660 123 456", address: "14 Rue Abou Bakr Seddik, Rabat", animalsCount: 2 },
  { id: "C011", name: "Rania Fassi", email: "rania.fassi@gmail.com", phone: "+212 671 234 567", address: "27 Avenue des FAR, Marrakech", animalsCount: 2 },
  { id: "C012", name: "Mehdi Chraibi", email: "mehdi.chraibi@gmail.com", phone: "+212 672 345 678", address: "5 Rue Oued Ziz, Oujda", animalsCount: 2 },
  { id: "C013", name: "Imane Saidi", email: "imane.saidi@gmail.com", phone: "+212 673 456 789", address: "19 Rue Ibn Batouta, Kénitra", animalsCount: 1 },
  { id: "C014", name: "Youssef Benali", email: "youssef.benali@gmail.com", phone: "+212 674 567 890", address: "22 Avenue Allal Ben Abdellah, Rabat", animalsCount: 2 },
  { id: "C015", name: "Khadija Ouazzani", email: "khadija.ouazzani@gmail.com", phone: "+212 675 678 901", address: "11 Rue Ba Hmad, Casablanca", animalsCount: 1 },
];

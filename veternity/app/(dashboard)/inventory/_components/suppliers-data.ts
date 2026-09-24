export type SupplierKind = "Grossiste" | "Laboratoire" | "Importateur" | "Consommables";

export interface Supplier {
  id: string;
  name: string;
  kind: SupplierKind;
  city: string;
  address: string;
  contact: string;
  phone: string;
  email: string;
  /** Délai de livraison habituel, en jours ouvrés. */
  leadTimeDays: number;
  paymentTermsDays: number;
  minimumOrder: number;
  since: string;
}

export const SUPPLIERS: Supplier[] = [
  {
    id: "S01", name: "Atlas Vet Distribution", kind: "Grossiste", city: "Casablanca",
    address: "Zone industrielle Sidi Maârouf, lot 42, Casablanca", contact: "Hamza El Idrissi",
    phone: "+212 522 45 67 89", email: "commandes@atlasvet.ma", leadTimeDays: 2, paymentTermsDays: 30, minimumOrder: 1500, since: "2021-03-01",
  },
  {
    id: "S02", name: "Zoolab Maroc", kind: "Laboratoire", city: "Rabat",
    address: "12 avenue Annakhil, Hay Riad, Rabat", contact: "Nadia Cherkaoui",
    phone: "+212 537 71 22 40", email: "pro@zoolab.ma", leadTimeDays: 4, paymentTermsDays: 45, minimumOrder: 2000, since: "2022-01-15",
  },
  {
    id: "S03", name: "Sud Élevage Santé", kind: "Grossiste", city: "Agadir",
    address: "Route de Tiznit km 6, Agadir", contact: "Youssef Ait Lahcen",
    phone: "+212 528 33 90 14", email: "ventes@sudelevage.ma", leadTimeDays: 3, paymentTermsDays: 30, minimumOrder: 1000, since: "2021-09-10",
  },
  {
    id: "S04", name: "PetCare Import", kind: "Importateur", city: "Tanger",
    address: "Zone franche Tanger Med, bât. B7", contact: "Karima Bennani",
    phone: "+212 539 94 18 02", email: "orders@petcare-import.ma", leadTimeDays: 5, paymentTermsDays: 60, minimumOrder: 3000, since: "2023-05-02",
  },
  {
    id: "S05", name: "Clinisoin Fournitures", kind: "Consommables", city: "Casablanca",
    address: "88 boulevard Brahim Roudani, Casablanca", contact: "Omar Tahiri",
    phone: "+212 522 25 61 77", email: "contact@clinisoin.ma", leadTimeDays: 1, paymentTermsDays: 15, minimumOrder: 500, since: "2020-11-20",
  },
];

export function findSupplier(id: string | undefined) {
  return id ? SUPPLIERS.find((s) => s.id === id) : undefined;
}

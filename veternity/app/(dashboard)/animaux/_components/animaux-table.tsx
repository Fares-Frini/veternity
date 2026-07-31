import { HugeiconsIcon } from "@hugeicons/react";
import { FemaleSymbolIcon, MaleSymbolIcon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Animal } from "./data";
import { SPECIES_COLOR, SPECIES_ICON, formatDate } from "./utils";

export function AnimauxTable({ animals }: { animals: Animal[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="pl-5 text-muted-foreground">ID</TableHead>
          <TableHead className="text-muted-foreground">Animal</TableHead>
          <TableHead className="text-muted-foreground">Sexe</TableHead>
          <TableHead className="text-muted-foreground">Espèce</TableHead>
          <TableHead className="text-muted-foreground">Race</TableHead>
          <TableHead className="text-muted-foreground">Robe</TableHead>
          <TableHead className="text-muted-foreground">Naissance</TableHead>
          <TableHead className="text-muted-foreground">Poids</TableHead>
          <TableHead className="pr-5 text-muted-foreground">Propriétaire</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {animals.map((animal) => {
          const speciesClasses = SPECIES_COLOR[animal.species] ?? "bg-muted text-muted-foreground";
          const speciesIcon = SPECIES_ICON[animal.species];
          return (
            <TableRow key={animal.id} className="border-border">
              <TableCell className="pl-5 font-mono text-xs text-muted-foreground">#{animal.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`text-xs font-bold ${speciesClasses}`}>
                      {animal.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-foreground">{animal.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <HugeiconsIcon
                  icon={animal.sex === "M" ? MaleSymbolIcon : FemaleSymbolIcon}
                  className={`h-4 w-4 ${animal.sex === "M" ? "text-status-info" : "text-status-pink"}`}
                  strokeWidth={2.2}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-foreground">
                  {speciesIcon && <HugeiconsIcon icon={speciesIcon} className="h-4 w-4 text-foreground" strokeWidth={2.2} />}
                  {animal.species}
                </div>
              </TableCell>
              <TableCell className="text-foreground">{animal.breed}</TableCell>
              <TableCell className="text-foreground">{animal.coat}</TableCell>
              <TableCell className="text-foreground">{formatDate(animal.birthDate)}</TableCell>
              <TableCell className="text-foreground">{animal.weightKg} kg</TableCell>
              <TableCell className="pr-5 text-foreground">{animal.owner}</TableCell>
            </TableRow>
          );
        })}
        {animals.length === 0 && (
          <TableRow className="border-border hover:bg-transparent">
            <TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
              Aucun animal ne correspond à votre recherche.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

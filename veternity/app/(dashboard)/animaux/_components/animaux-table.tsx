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
        <TableRow className="border-[#eef0f5] hover:bg-transparent">
          <TableHead className="pl-5 text-[#7b88a8]">ID</TableHead>
          <TableHead className="text-[#7b88a8]">Animal</TableHead>
          <TableHead className="text-[#7b88a8]">Sexe</TableHead>
          <TableHead className="text-[#7b88a8]">Espèce</TableHead>
          <TableHead className="text-[#7b88a8]">Race</TableHead>
          <TableHead className="text-[#7b88a8]">Robe</TableHead>
          <TableHead className="text-[#7b88a8]">Naissance</TableHead>
          <TableHead className="text-[#7b88a8]">Poids</TableHead>
          <TableHead className="pr-5 text-[#7b88a8]">Propriétaire</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {animals.map((animal) => {
          const speciesClasses = SPECIES_COLOR[animal.species] ?? "bg-[#eef0f5] text-[#5b6479]";
          const speciesIcon = SPECIES_ICON[animal.species];
          return (
            <TableRow key={animal.id} className="border-[#eef0f5]">
              <TableCell className="pl-5 font-mono text-xs text-[#7b88a8]">#{animal.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`text-xs font-bold ${speciesClasses}`}>
                      {animal.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-[#1e2a4a]">{animal.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <HugeiconsIcon
                  icon={animal.sex === "M" ? MaleSymbolIcon : FemaleSymbolIcon}
                  className={`h-4 w-4 ${animal.sex === "M" ? "text-[#3b82f6]" : "text-[#e879b9]"}`}
                  strokeWidth={2.2}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-[#374151]">
                  {speciesIcon && <HugeiconsIcon icon={speciesIcon} className="h-4 w-4 text-black" strokeWidth={2.2} />}
                  {animal.species}
                </div>
              </TableCell>
              <TableCell className="text-[#374151]">{animal.breed}</TableCell>
              <TableCell className="text-[#374151]">{animal.coat}</TableCell>
              <TableCell className="text-[#374151]">{formatDate(animal.birthDate)}</TableCell>
              <TableCell className="text-[#374151]">{animal.weightKg} kg</TableCell>
              <TableCell className="pr-5 text-[#374151]">{animal.owner}</TableCell>
            </TableRow>
          );
        })}
        {animals.length === 0 && (
          <TableRow className="border-[#eef0f5] hover:bg-transparent">
            <TableCell colSpan={9} className="py-8 text-center text-sm text-[#7b88a8]">
              Aucun animal ne correspond à votre recherche.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

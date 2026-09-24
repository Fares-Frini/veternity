import { HugeiconsIcon } from "@hugeicons/react";
import { FemaleSymbolIcon, MaleSymbolIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Animal } from "./data";
import { SPECIES_COLOR, SPECIES_ICON, formatCount, formatDate, formatWeight } from "./utils";

function SexCell({ sex }: { sex: Animal["sex"] }) {
  if (sex === "Mixte") {
    return <span className="text-xs font-medium text-muted-foreground">Mixte</span>;
  }
  return (
    <HugeiconsIcon
      icon={sex === "M" ? MaleSymbolIcon : FemaleSymbolIcon}
      className={`h-4 w-4 ${sex === "M" ? "text-status-info" : "text-status-pink"}`}
      strokeWidth={2.2}
    />
  );
}

export function AnimauxTable({ animals }: { animals: Animal[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="pl-5 text-muted-foreground">ID</TableHead>
          <TableHead className="text-muted-foreground">Animal / Lot</TableHead>
          <TableHead className="text-muted-foreground">Effectif</TableHead>
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
          const isHerd = animal.kind === "troupeau";
          return (
            <TableRow key={animal.id} className="border-border">
              <TableCell className="pl-5 font-mono text-xs text-muted-foreground">#{animal.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`text-xs font-bold ${speciesClasses}`}>
                      {isHerd ? (
                        <HugeiconsIcon icon={UserGroupIcon} className="h-4 w-4" strokeWidth={2.2} />
                      ) : (
                        animal.name.slice(0, 2).toUpperCase()
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{animal.name}</span>
                    {isHerd && (
                      <Badge variant="brown" className="mt-0.5 h-4 px-1.5 text-[10px]">
                        Troupeau
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className={isHerd ? "font-semibold text-foreground" : "text-muted-foreground"}>
                {formatCount(animal)}
              </TableCell>
              <TableCell>
                <SexCell sex={animal.sex} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-foreground">
                  {speciesIcon && <HugeiconsIcon icon={speciesIcon} className="h-4 w-4 text-foreground" strokeWidth={2.2} />}
                  {animal.species}
                </div>
              </TableCell>
              <TableCell className="text-foreground">{animal.breed}</TableCell>
              <TableCell className="text-foreground">{animal.coat}</TableCell>
              <TableCell className="text-foreground">{animal.birthDate ? formatDate(animal.birthDate) : "—"}</TableCell>
              <TableCell className="text-foreground">{formatWeight(animal)}</TableCell>
              <TableCell className="pr-5 text-foreground">{animal.owner}</TableCell>
            </TableRow>
          );
        })}
        {animals.length === 0 && (
          <TableRow className="border-border hover:bg-transparent">
            <TableCell colSpan={10} className="py-8 text-center text-sm text-muted-foreground">
              Aucun animal ne correspond à votre recherche.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

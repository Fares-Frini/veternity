import { HugeiconsIcon } from "@hugeicons/react";
import { FemaleSymbolIcon, MaleSymbolIcon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Animal } from "./data";
import { SPECIES_COLOR, SPECIES_ICON, formatDate } from "./utils";

export function AnimauxGrid({ animals }: { animals: Animal[] }) {
  if (animals.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Aucun animal ne correspond à votre recherche.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {animals.map((animal) => {
        const speciesClasses = SPECIES_COLOR[animal.species] ?? "bg-muted text-muted-foreground";
        const speciesIcon = SPECIES_ICON[animal.species];
        return (
          <div
            key={animal.id}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Avatar className="h-12 w-12">
                <AvatarFallback className={`text-sm font-bold ${speciesClasses}`}>
                  {animal.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <HugeiconsIcon
                icon={animal.sex === "M" ? MaleSymbolIcon : FemaleSymbolIcon}
                className={`h-4 w-4 ${animal.sex === "M" ? "text-status-info" : "text-status-pink"}`}
                strokeWidth={2.2}
              />
            </div>

            <div>
              <div className="font-bold text-foreground">{animal.name}</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>#{animal.id}</span>
                <span>·</span>
                {speciesIcon && <HugeiconsIcon icon={speciesIcon} className="h-3.5 w-3.5 text-foreground" strokeWidth={2.2} />}
                <span>{animal.species}</span>
                <span>·</span>
                <span>{animal.breed}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
              <span>Robe</span>
              <span className="text-right font-medium text-foreground">{animal.coat}</span>
              <span>Naissance</span>
              <span className="text-right font-medium text-foreground">{formatDate(animal.birthDate)}</span>
              <span>Poids</span>
              <span className="text-right font-medium text-foreground">{animal.weightKg} kg</span>
              <span>Propriétaire</span>
              <span className="text-right font-medium text-foreground">{animal.owner}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

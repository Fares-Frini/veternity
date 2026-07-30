import { HugeiconsIcon } from "@hugeicons/react";
import { FemaleSymbolIcon, MaleSymbolIcon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Animal } from "./data";
import { SPECIES_COLOR, SPECIES_ICON, formatDate } from "./utils";

export function AnimauxGrid({ animals }: { animals: Animal[] }) {
  if (animals.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-[#7b88a8]">
        Aucun animal ne correspond à votre recherche.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {animals.map((animal) => {
        const speciesClasses = SPECIES_COLOR[animal.species] ?? "bg-[#eef0f5] text-[#5b6479]";
        const speciesIcon = SPECIES_ICON[animal.species];
        return (
          <div
            key={animal.id}
            className="flex flex-col gap-3 rounded-lg border border-[#eef0f5] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Avatar className="h-12 w-12">
                <AvatarFallback className={`text-sm font-bold ${speciesClasses}`}>
                  {animal.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <HugeiconsIcon
                icon={animal.sex === "M" ? MaleSymbolIcon : FemaleSymbolIcon}
                className={`h-4 w-4 ${animal.sex === "M" ? "text-[#3b82f6]" : "text-[#e879b9]"}`}
                strokeWidth={2.2}
              />
            </div>

            <div>
              <div className="font-bold text-[#1e2a4a]">{animal.name}</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-[#7b88a8]">
                <span>#{animal.id}</span>
                <span>·</span>
                {speciesIcon && <HugeiconsIcon icon={speciesIcon} className="h-3.5 w-3.5 text-black" strokeWidth={2.2} />}
                <span>{animal.species}</span>
                <span>·</span>
                <span>{animal.breed}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-1.5 border-t border-[#eef0f5] pt-3 text-xs text-[#5b6479]">
              <span>Robe</span>
              <span className="text-right font-medium text-[#1e2a4a]">{animal.coat}</span>
              <span>Naissance</span>
              <span className="text-right font-medium text-[#1e2a4a]">{formatDate(animal.birthDate)}</span>
              <span>Poids</span>
              <span className="text-right font-medium text-[#1e2a4a]">{animal.weightKg} kg</span>
              <span>Propriétaire</span>
              <span className="text-right font-medium text-[#1e2a4a]">{animal.owner}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

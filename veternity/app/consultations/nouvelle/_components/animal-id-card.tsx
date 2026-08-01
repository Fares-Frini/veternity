import { HugeiconsIcon } from "@hugeicons/react";
import { FemaleSymbolIcon, MaleSymbolIcon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Animal } from "@/app/(dashboard)/animaux/_components/data";
import { SPECIES_COLOR, SPECIES_ICON } from "@/app/(dashboard)/animaux/_components/utils";

function formatAge(birthDate: string, asOf: string) {
  const birth = new Date(birthDate);
  const ref = new Date(asOf);
  let years = ref.getFullYear() - birth.getFullYear();
  const hadBirthdayByThen =
    ref.getMonth() > birth.getMonth() || (ref.getMonth() === birth.getMonth() && ref.getDate() >= birth.getDate());
  if (!hadBirthdayByThen) years -= 1;
  return years <= 0 ? "< 1 an" : `${years} an${years > 1 ? "s" : ""}`;
}

interface AnimalIdCardProps {
  animal: Animal;
  weightKg?: number;
  asOfDate?: string;
  note?: string;
}
export function AnimalIdCard({ animal, weightKg, asOfDate, note }: AnimalIdCardProps) {
  const speciesClasses = SPECIES_COLOR[animal.species] ?? "bg-muted text-muted-foreground";
  const speciesIcon = SPECIES_ICON[animal.species];
  const effectiveWeight = weightKg ?? animal.weightKg;
  const effectiveDate = asOfDate ?? new Date().toISOString().slice(0, 10);

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex gap-4">
        <Avatar className="h-20 w-20 shrink-0 rounded-xl">
          <AvatarFallback className={`rounded-xl text-xl font-bold ${speciesClasses}`}>
            {animal.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-lg leading-tight font-extrabold text-foreground">{animal.name}</h3>
              <HugeiconsIcon
                icon={animal.sex === "M" ? MaleSymbolIcon : FemaleSymbolIcon}
                className={`h-4 w-4 shrink-0 ${animal.sex === "M" ? "text-status-info" : "text-status-pink"}`}
                strokeWidth={2.4}
              />
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {animal.breed} · {animal.owner}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 border-t border-border pt-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Espèce</span>
              <span className={`inline-flex w-fit items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-semibold ${speciesClasses}`}>
                {speciesIcon && <HugeiconsIcon icon={speciesIcon} className="h-3 w-3" strokeWidth={2.2} />}
                {animal.species}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Robe</span>
              <span className="truncate text-sm font-semibold text-foreground">{animal.coat}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Âge</span>
              <span className="text-sm font-semibold text-foreground">{formatAge(animal.birthDate, effectiveDate)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Poids</span>
              <span className="text-sm font-semibold text-foreground">{effectiveWeight} kg</span>
            </div>
          </div>
        </div>
      </div>

      {note && <p className="mt-3 border-t border-border pt-2 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

import type { Animal } from "@/app/(dashboard)/animaux/_components/data";
import { SPECIES_COLOR, SPECIES_ICON } from "@/app/(dashboard)/animaux/_components/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FemaleSymbolIcon, MaleSymbolIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import { formatNumber } from "./catalog";
import { DataLabel } from "./form-section";

export function formatAge(birthDate: string, asOf: string) {
  if (!birthDate) return "—";
  const birth = new Date(birthDate);
  const ref = new Date(asOf);
  let years = ref.getFullYear() - birth.getFullYear();
  const hadBirthdayByThen =
    ref.getMonth() > birth.getMonth() || (ref.getMonth() === birth.getMonth() && ref.getDate() >= birth.getDate());
  if (!hadBirthdayByThen) years -= 1;
  return years <= 0 ? "< 1 an" : `${years} an${years > 1 ? "s" : ""}`;
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <DataLabel>{label}</DataLabel>
      <span className="truncate text-sm font-semibold text-foreground">{children}</span>
    </div>
  );
}

/** Fiche d'identité compacte, pensée pour la colonne patient. */
export function PatientCard({
  animal,
  weightKg,
  asOfDate,
  action,
}: {
  animal: Animal;
  weightKg?: number;
  asOfDate?: string;
  action?: ReactNode;
}) {
  const speciesClasses = SPECIES_COLOR[animal.species] ?? "bg-muted text-muted-foreground";
  const speciesIcon = SPECIES_ICON[animal.species];
  const herd = animal.kind === "troupeau";
  const weight = formatNumber(weightKg ?? animal.weightKg, 2);
  const date = asOfDate ?? new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 shrink-0 rounded-xl">
          <AvatarFallback className={`rounded-xl text-base font-bold ${speciesClasses}`}>
            {animal.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate text-base leading-tight font-extrabold text-foreground">{animal.name}</h2>
            {animal.sex !== "Mixte" && (
              <HugeiconsIcon
                icon={animal.sex === "M" ? MaleSymbolIcon : FemaleSymbolIcon}
                className={`h-4 w-4 shrink-0 ${animal.sex === "M" ? "text-status-info" : "text-status-pink"}`}
                strokeWidth={2.4}
              />
            )}
          </div>
          <p className="truncate text-sm text-muted-foreground">{animal.owner}</p>
        </div>
        {action}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg bg-muted p-3">
        <div className="flex min-w-0 flex-col gap-1">
          <DataLabel>Espèce</DataLabel>
          <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${speciesClasses}`}>
            {speciesIcon && <HugeiconsIcon icon={speciesIcon} className="h-3 w-3" strokeWidth={2.2} />}
            {animal.species}
          </span>
        </div>
        <Fact label="Race">{animal.breed}</Fact>
        <Fact label={herd ? "Effectif" : "Âge"}>{herd ? `${animal.count} têtes` : formatAge(animal.birthDate, date)}</Fact>
        <Fact label="Poids">{herd ? `~${weight} kg/tête` : `${weight} kg`}</Fact>
      </div>
    </div>
  );
}

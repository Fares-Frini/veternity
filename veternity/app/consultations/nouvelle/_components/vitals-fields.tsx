"use client";

import type { Animal } from "@/app/(dashboard)/animaux/_components/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { VITAL_RANGES, formatNumber, vitalStatus } from "./catalog";
import { parseAmount, useConsultationDraft, type DraftVitals } from "./draft-context";

function VitalField({
  id,
  label,
  unit,
  value,
  onChange,
  hint,
  warning,
  step = "1",
}: {
  id: string;
  label: string;
  unit: string;
  value: string;
  onChange: (value: string) => void;
  hint: string;
  warning?: boolean;
  step?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={`${id}-hint`}
          className={cn(
            "h-10 bg-muted pr-11 tabular-nums",
            warning && "border-status-warning focus-visible:border-status-warning focus-visible:ring-status-warning/25",
          )}
        />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
          {unit}
        </span>
      </div>
      <span
        id={`${id}-hint`}
        className={cn("truncate text-xs", warning ? "font-medium text-status-warning" : "text-muted-foreground")}
      >
        {hint}
      </span>
    </div>
  );
}

function rangeHint(raw: string, range: [number, number] | undefined): { text: string; warning: boolean } {
  if (!range) return { text: "Pas de norme pour cette espèce", warning: false };
  const norm = `${formatNumber(range[0])}–${formatNumber(range[1])}`;
  const status = raw.trim() === "" ? "normal" : vitalStatus(parseAmount(raw), range);
  if (status === "high") return { text: `Élevée · norme ${norm}`, warning: true };
  if (status === "low") return { text: `Basse · norme ${norm}`, warning: true };
  return { text: `Norme ${norm}`, warning: false };
}

export function VitalsFields({ animal }: { animal: Animal | null }) {
  const { draft, update } = useConsultationDraft();
  const range = animal ? VITAL_RANGES[animal.species] : undefined;
  const set = (key: keyof DraftVitals) => (value: string) =>
    update((d) => ({ vitals: { ...d.vitals, [key]: value } }));

  const hintFor = (raw: string, r: [number, number] | undefined) => {
    if (!animal) return { text: "Sélectionnez un patient", warning: false };
    return rangeHint(raw, r);
  };

  const weight = parseAmount(draft.vitals.weightKg);
  let weightHint = "Poids du jour";
  if (animal?.weightKg) {
    const delta = weight !== undefined && draft.vitals.weightKg.trim() !== "" ? weight - animal.weightKg : 0;
    weightHint =
      Math.abs(delta) < 0.05
        ? `Dossier : ${formatNumber(animal.weightKg, 2)} kg`
        : `${delta > 0 ? "+" : "−"}${formatNumber(Math.abs(delta), 2)} kg vs dossier`;
  }

  const temperature = hintFor(draft.vitals.temperature, range?.temperature);
  const heartRate = hintFor(draft.vitals.heartRate, range?.heartRate);
  const respiratoryRate = hintFor(draft.vitals.respiratoryRate, range?.respiratoryRate);

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4 @xl:grid-cols-4">
      <VitalField
        id="vital-weight"
        label="Poids *"
        unit={animal?.kind === "troupeau" ? "kg/tête" : "kg"}
        step="0.1"
        value={draft.vitals.weightKg}
        onChange={set("weightKg")}
        hint={weightHint}
      />
      <VitalField
        id="vital-temperature"
        label="Température"
        unit="°C"
        step="0.1"
        value={draft.vitals.temperature}
        onChange={set("temperature")}
        hint={temperature.text}
        warning={temperature.warning}
      />
      <VitalField
        id="vital-heart-rate"
        label="Fréq. cardiaque"
        unit="bpm"
        value={draft.vitals.heartRate}
        onChange={set("heartRate")}
        hint={heartRate.text}
        warning={heartRate.warning}
      />
      <VitalField
        id="vital-respiratory-rate"
        label="Fréq. respiratoire"
        unit="/min"
        value={draft.vitals.respiratoryRate}
        onChange={set("respiratoryRate")}
        hint={respiratoryRate.text}
        warning={respiratoryRate.warning}
      />
    </div>
  );
}

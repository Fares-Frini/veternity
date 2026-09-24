import { ANIMALS } from "@/app/(dashboard)/animaux/_components/data";
import { CLIENTS } from "@/app/(dashboard)/clients/_components/data";
import { CONSULTATIONS } from "@/app/(dashboard)/consultations/(tabs)/liste/_components/data";
import type { Prescription, PrescriptionLine } from "@/app/(dashboard)/consultations/(tabs)/prescriptions/_components/data";
import { formatNumber } from "@/app/consultations/nouvelle/_components/catalog";
import { formatAge } from "@/app/consultations/nouvelle/_components/patient-card";
import { DocFooter, DocHeader, DocLabel, DocParty, DocSheet, formatDocDate } from "./document-parts";

/** Les anciennes ordonnances n'ont qu'un texte libre : on les présente comme une seule ligne. */
function linesOf(prescription: Prescription): PrescriptionLine[] {
  if (prescription.lines?.length) return prescription.lines;
  return [{ name: prescription.medications, posology: prescription.posology, duration: "", dispensedQuantity: 0 }];
}

export function PrescriptionDocument({ prescription }: { prescription: Prescription }) {
  const animal = ANIMALS.find((a) => a.name === prescription.animal);
  const client = CLIENTS.find((c) => c.name === prescription.owner);
  const consultation =
    CONSULTATIONS.find((c) => c.id === prescription.consultationId) ??
    CONSULTATIONS.find((c) => c.animal === prescription.animal && c.date === prescription.date);
  const weight = consultation?.weightKg ?? animal?.weightKg;

  const patientLines = animal
    ? [
        `${animal.species} · ${animal.breed}${animal.sex !== "Mixte" ? ` · ${animal.sex === "M" ? "mâle" : "femelle"}` : ""}`,
        [
          animal.kind === "troupeau" ? `${animal.count} têtes` : formatAge(animal.birthDate, prescription.date),
          weight ? `${formatNumber(weight, 2)} kg` : undefined,
        ]
          .filter(Boolean)
          .join(" · "),
      ]
    : [prescription.species];

  return (
    <DocSheet>
      <DocHeader title="Ordonnance" reference={prescription.id} date={prescription.date} />

      <section className="grid grid-cols-3 gap-6">
        <DocParty label="Vétérinaire" name={prescription.vet} lines={["Veternity · Clinique vétérinaire"]} />
        <DocParty label="Patient" name={prescription.animal} lines={patientLines} />
        <DocParty label="Propriétaire" name={prescription.owner} lines={[client?.phone]} />
      </section>

      {consultation && (
        <section className="flex flex-col gap-1">
          <DocLabel>Diagnostic</DocLabel>
          <p className="mt-1">{consultation.diagnostic}</p>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <DocLabel>Prescription</DocLabel>
        <ol className="flex flex-col">
          {linesOf(prescription).map((line, i) => (
            <li key={i} className="flex gap-4 border-b border-border py-3 first:border-t">
              <span className="w-5 shrink-0 font-bold text-muted-foreground tabular-nums">{i + 1}.</span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[15px] font-bold">{line.name}</span>
                  {line.dispensedQuantity > 0 && (
                    <span className="shrink-0 text-[11px] text-muted-foreground">Délivré par la clinique</span>
                  )}
                </div>
                <span>{line.posology || "Posologie à préciser"}</span>
                {line.duration && <span className="text-muted-foreground">Pendant {line.duration}</span>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {prescription.notes && (
        <section className="flex flex-col gap-1">
          <DocLabel>Recommandations</DocLabel>
          <p className="mt-1 whitespace-pre-line">{prescription.notes}</p>
        </section>
      )}

      <section className="flex justify-end">
        <div className="flex w-64 flex-col gap-1">
          <DocLabel>Signature et cachet</DocLabel>
          <div className="mt-1 h-24 rounded-md border border-dashed border-border" />
          <span className="mt-1 font-semibold">{prescription.vet}</span>
          <span className="text-muted-foreground">Le {formatDocDate(prescription.date)}</span>
        </div>
      </section>

      <DocFooter>Veternity · Clinique vétérinaire · Ordonnance {prescription.id}</DocFooter>
    </DocSheet>
  );
}

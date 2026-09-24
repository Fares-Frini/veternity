import { formatMoney } from "@/app/(dashboard)/_components/bilan-data";
import { PRESCRIPTIONS } from "@/app/(dashboard)/consultations/(tabs)/prescriptions/_components/data";
import { VITAL_RANGES, formatNumber, vitalStatus } from "@/app/consultations/nouvelle/_components/catalog";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { Consultation } from "./data";

export function findPrescriptionFor(consultation: Consultation) {
  return (
    PRESCRIPTIONS.find((p) => p.consultationId === consultation.id) ??
    PRESCRIPTIONS.find((p) => p.animal === consultation.animal && p.date === consultation.date)
  );
}

function Section({ label, aside, children }: { label: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5 border-t border-border pt-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
        {aside}
      </div>
      {children}
    </section>
  );
}

function VitalCell({ label, value, unit, range }: { label: string; value?: number; unit: string; range?: [number, number] }) {
  const status = vitalStatus(value, range);
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn("text-sm font-semibold tabular-nums", status === "normal" ? "text-foreground" : "text-status-warning")}
      >
        {value !== undefined ? formatNumber(value) : "—"}
        <span className="ml-0.5 text-xs font-normal text-muted-foreground">{unit}</span>
        {status !== "normal" && <span className="ml-1 text-xs">{status === "high" ? "↑" : "↓"}</span>}
      </span>
    </div>
  );
}

/**
 * Contenu clinique d'une consultation : motif, constantes, diagnostic, actes et ordonnance.
 * `wide` étale les constantes et les actes quand la place le permet (dialog).
 */
export function ConsultationRecord({ consultation, wide = false }: { consultation: Consultation; wide?: boolean }) {
  const range = VITAL_RANGES[consultation.species];
  const prescription = findPrescriptionFor(consultation);

  return (
    <div className="flex flex-col gap-4">
      {consultation.motif && (
        <Section label="Motif">
          <p className="text-sm text-foreground">{consultation.motif}</p>
        </Section>
      )}

      {consultation.vitals && (
        <Section label="Constantes">
          <div className="grid grid-cols-3 gap-2">
            <VitalCell label={wide ? "Température" : "Temp."} value={consultation.vitals.temperature} unit="°C" range={range?.temperature} />
            <VitalCell label={wide ? "Fréq. cardiaque" : "FC"} value={consultation.vitals.heartRate} unit="bpm" range={range?.heartRate} />
            <VitalCell
              label={wide ? "Fréq. respiratoire" : "FR"}
              value={consultation.vitals.respiratoryRate}
              unit="/min"
              range={range?.respiratoryRate}
            />
          </div>
        </Section>
      )}

      <Section label="Diagnostic">
        <p className="text-sm leading-relaxed whitespace-pre-line text-foreground">{consultation.diagnostic}</p>
      </Section>

      {consultation.acts && consultation.acts.length > 0 && (
        <Section label="Actes">
          <ul className="flex flex-col gap-2">
            {consultation.acts.map((act, i) => (
              <li key={i} className="flex items-baseline justify-between gap-3">
                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="text-sm text-foreground">{act.label}</span>
                  {act.detail && <span className="truncate text-xs text-muted-foreground">{act.detail}</span>}
                </div>
                <span className="shrink-0 text-sm text-foreground tabular-nums">{formatMoney(act.amount)}</span>
              </li>
            ))}
          </ul>
          {consultation.total !== undefined && (
            <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-dashed border-border pt-2">
              <span className="text-sm font-semibold text-foreground">
                Facturé
                {consultation.invoiceId && (
                  <span className="font-normal text-muted-foreground"> · {consultation.invoiceId}</span>
                )}
              </span>
              <span className="text-sm font-bold text-foreground tabular-nums">{formatMoney(consultation.total)}</span>
            </div>
          )}
        </Section>
      )}

      {prescription && (
        <Section label="Ordonnance" aside={<span className="font-mono text-xs text-muted-foreground">{prescription.id}</span>}>
          {prescription.lines?.length ? (
            <ul className="flex flex-col gap-2">
              {prescription.lines.map((line, i) => (
                <li key={i} className="flex flex-col leading-tight">
                  <span className="text-sm font-medium text-foreground">{line.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {[line.posology, line.duration].filter(Boolean).join(" · ") || "Posologie non précisée"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-foreground">{prescription.medications}</span>
              <span className="text-xs text-muted-foreground">{prescription.posology}</span>
            </div>
          )}
          {prescription.notes && <p className="mt-1 text-xs text-muted-foreground italic">{prescription.notes}</p>}
        </Section>
      )}
    </div>
  );
}

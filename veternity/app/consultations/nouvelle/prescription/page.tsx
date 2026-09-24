"use client";

import { formatMoney } from "@/app/(dashboard)/_components/bilan-data";
import { formatDate } from "@/app/(dashboard)/consultations/(tabs)/liste/_components/utils";
import { PRESCRIPTIONS, type Prescription } from "@/app/(dashboard)/consultations/(tabs)/prescriptions/_components/data";
import { STOCK, findStockItem, formatQuantity } from "@/app/(dashboard)/inventory/_components/stock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Delete02Icon,
  Note01Icon,
  PillIcon,
  PlusSignIcon,
  RepeatIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAct } from "../_components/catalog";
import { STEP_HREFS } from "../_components/consultation-stepper";
import {
  availableStock,
  commitStock,
  computeTotals,
  stockUsage,
  uid,
  useConsultationDraft,
  type DraftRxLine,
} from "../_components/draft-context";
import { FormSection } from "../_components/form-section";
import { MedicationCombobox } from "../_components/medication-combobox";
import { MissingDraft } from "../_components/missing-draft";
import { removePrescription, savePrescription } from "../_components/persist";
import { QuantityStepper } from "../_components/quantity-stepper";
import { PatientCard } from "../_components/patient-card";
import { StockImpact } from "../_components/stock-impact";
import { StockProjection } from "../_components/stock-projection";
import { RailHeading, RailRow, RailSection, RailTotal, SummaryRail, Workspace } from "../_components/workspace";

function emptyLine(): DraftRxLine {
  return { uid: uid("rx"), name: "", posology: "", duration: "", dispensed: false, quantity: 1 };
}

function findProductByName(name: string) {
  const n = name.trim().toLowerCase();
  return STOCK.find((s) => s.name.toLowerCase().startsWith(n) || n.startsWith(s.name.toLowerCase()));
}

/** Convertit une ordonnance passée en lignes éditables. */
function linesFrom(prescription: Prescription): DraftRxLine[] {
  if (prescription.lines) {
    return prescription.lines.map((l) => ({
      ...emptyLine(),
      name: l.name,
      posology: l.posology,
      duration: l.duration,
      productId: l.productId,
    }));
  }
  const names = prescription.medications.split(" + ");
  return names.map((name, i) => ({
    ...emptyLine(),
    name,
    productId: findProductByName(name)?.id,
    posology: i === 0 ? prescription.posology : "",
  }));
}

function RxLineEditor({ line, index }: { line: DraftRxLine; index: number }) {
  const { draft, update } = useConsultationDraft();
  const product = findStockItem(line.productId);
  const set = (patch: Partial<DraftRxLine>) =>
    update((d) => ({ rxLines: d.rxLines.map((l) => (l.uid === line.uid ? { ...l, ...patch } : l)) }));

  const usage = stockUsage(draft);
  const ownUsage = line.dispensed ? line.quantity : 0;
  const before = product ? availableStock(product.id, draft) - ((usage[product.id] ?? 0) - ownUsage) : 0;

  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <span className="mt-8 w-4 shrink-0 text-sm font-bold text-muted-foreground tabular-nums">{index + 1}</span>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`rx-name-${line.uid}`} className="text-xs">
            Médicament
          </Label>
          <MedicationCombobox
            id={`rx-name-${line.uid}`}
            name={line.name}
            productId={line.productId}
            onChange={(name, productId) =>
              set({ name, productId, dispensed: productId ? line.dispensed : false, quantity: 1 })
            }
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_10rem]">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`rx-posology-${line.uid}`} className="text-xs">
              Posologie
            </Label>
            <Input
              id={`rx-posology-${line.uid}`}
              value={line.posology}
              onChange={(e) => set({ posology: e.target.value })}
              placeholder="Ex : 1 comprimé matin et soir"
              className="h-10 bg-muted"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`rx-duration-${line.uid}`} className="text-xs">
              Durée
            </Label>
            <Input
              id={`rx-duration-${line.uid}`}
              value={line.duration}
              onChange={(e) => set({ duration: e.target.value })}
              placeholder="Ex : 7 jours"
              className="h-10 bg-muted"
            />
          </div>
        </div>

        {product && (
          <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg bg-muted px-3 py-2">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground has-disabled:cursor-not-allowed has-disabled:opacity-60">
              <Checkbox
                checked={line.dispensed}
                disabled={before <= 0 && !line.dispensed}
                onCheckedChange={(checked) => set({ dispensed: checked === true, quantity: 1 })}
              />
              Délivré par la clinique
            </label>
            {line.dispensed ? (
              <div className="flex flex-wrap items-center gap-3">
                <StockProjection item={product} before={before} after={before - line.quantity} />
                <QuantityStepper
                  value={line.quantity}
                  max={before}
                  onChange={(quantity) => set({ quantity })}
                  label={`Quantité de ${product.name} délivrée`}
                />
                <span className="w-20 text-right text-sm font-semibold text-foreground tabular-nums">
                  {formatMoney(product.unitPrice * line.quantity)}
                </span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground tabular-nums">
                {before > 0 ? `${formatQuantity(product, before)} en stock` : "Rupture de stock"} ·{" "}
                {formatMoney(product.unitPrice)} / {product.unit}
              </span>
            )}
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="mt-7"
        onClick={() => update((d) => ({ rxLines: d.rxLines.filter((l) => l.uid !== line.uid) }))}
        aria-label={`Retirer le médicament ${index + 1}`}
      >
        <HugeiconsIcon icon={Delete02Icon} className="text-muted-foreground" strokeWidth={2} />
      </Button>
    </li>
  );
}

export default function OrdonnancePage() {
  const router = useRouter();
  const { draft, animal, update } = useConsultationDraft();
  const [renewed, setRenewed] = useState<Set<string>>(new Set());

  if (!draft.consultationId || !animal) return <MissingDraft step="ordonnance" />;

  const previous = PRESCRIPTIONS.filter((p) => p.animal === animal.name && p.id !== draft.prescriptionId).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  const validLines = draft.rxLines.filter((l) => l.name.trim() !== "");
  const dispensedCount = validLines.filter((l) => l.productId && l.dispensed).length;
  const { total } = computeTotals(draft);

  const addLine = () => update((d) => ({ rxLines: [...d.rxLines, emptyLine()] }));

  const renew = (p: Prescription) => {
    update((d) => ({ rxLines: [...d.rxLines.filter((l) => l.name.trim() !== ""), ...linesFrom(p)] }));
    setRenewed((s) => new Set(s).add(p.id));
  };

  const handleContinue = () => {
    const rxLines = validLines;
    const next = { ...draft, rxLines };
    const committedStock = commitStock(next, draft.consultationId ?? "");
    let prescriptionId: string | null = null;
    if (rxLines.length > 0) prescriptionId = savePrescription(next, animal);
    else removePrescription(draft.prescriptionId);
    update({ rxLines, committedStock, prescriptionId, prescriptionStepDone: true });
    router.push(STEP_HREFS.facture);
  };

  return (
    <Workspace
      left={
        <>
          <div className="border-b border-border p-4">
            <PatientCard animal={animal} asOfDate={draft.date} />
          </div>

          <div className="flex flex-col gap-3 border-b border-border p-4">
            <RailHeading>Consultation du jour</RailHeading>
            {draft.motif.trim() && <p className="text-sm text-muted-foreground">{draft.motif}</p>}
            <p className="text-sm leading-relaxed whitespace-pre-line text-foreground">{draft.diagnostic}</p>
            <div className="flex flex-wrap gap-1.5">
              {draft.acts.map((act) => {
                const product = findStockItem(act.productId);
                return (
                  <Badge key={act.uid} variant="outline" className="h-6 px-2.5">
                    {getAct(act.actId).label}
                    {product && ` · ${product.name}`}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 p-4">
            <RailHeading>
              Ordonnances précédentes{" "}
              <span className="font-normal text-muted-foreground tabular-nums">· {previous.length}</span>
            </RailHeading>
            {previous.length === 0 && (
              <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                Aucune ordonnance antérieure pour {animal.name}.
              </p>
            )}
            {previous.map((p) => {
              const isRenewed = renewed.has(p.id);
              return (
                <div key={p.id} className="flex flex-col gap-2 rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatDate(p.date)} · {p.vet}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      disabled={isRenewed}
                      onClick={() => renew(p)}
                    >
                      <HugeiconsIcon icon={isRenewed ? Tick02Icon : RepeatIcon} strokeWidth={2.2} />
                      {isRenewed ? "Ajoutée" : "Renouveler"}
                    </Button>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{p.medications}</span>
                  <span className="text-sm text-muted-foreground">{p.posology}</span>
                </div>
              );
            })}
          </div>
        </>
      }
      right={
        <SummaryRail
          title="Récapitulatif"
          footer={
            <>
              <RailTotal
                label="Total provisoire"
                value={formatMoney(total)}
                detail={dispensedCount > 0 ? `dont ${dispensedCount} médicament${dispensedCount > 1 ? "s" : ""} délivré${dispensedCount > 1 ? "s" : ""}` : undefined}
              />
              <Button type="button" size="lg" onClick={handleContinue} className="h-10 w-full">
                {validLines.length > 0 ? "Enregistrer l'ordonnance" : "Continuer sans ordonnance"}
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2.2} data-icon="inline-end" />
              </Button>
              <Button asChild variant="ghost" className="w-full text-muted-foreground">
                <Link href={STEP_HREFS.consultation}>
                  <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2.2} data-icon="inline-start" />
                  Retour à la consultation
                </Link>
              </Button>
            </>
          }
        >
          <RailSection label="Ordonnance">
            {validLines.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun médicament. L&apos;ordonnance est facultative.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {validLines.map((l) => {
                  const product = findStockItem(l.productId);
                  return (
                    <RailRow
                      key={l.uid}
                      label={l.name}
                      value={product && l.dispensed ? formatMoney(product.unitPrice * l.quantity) : "Prescrit"}
                      muted
                    />
                  );
                })}
              </ul>
            )}
          </RailSection>
          <RailSection label="Sorties de stock">
            <StockImpact emptyText="Aucun produit utilisé." />
          </RailSection>
        </SummaryRail>
      }
    >
      <FormSection
        icon={PillIcon}
        title="Traitement prescrit"
        hint="Un médicament délivré par la clinique est facturé et sorti du stock"
        action={
          draft.rxLines.length > 0 && (
            <Button type="button" variant="outline" size="sm" onClick={addLine}>
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2.4} />
              Ajouter
            </Button>
          )
        }
      >
        {draft.rxLines.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-10 text-center">
            <p className="text-sm font-semibold text-foreground">Aucun médicament prescrit</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Ajoutez un médicament, renouvelez une ordonnance précédente, ou continuez sans ordonnance.
            </p>
            <Button type="button" variant="outline" size="sm" onClick={addLine} className="mt-1">
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2.4} />
              Ajouter un médicament
            </Button>
          </div>
        ) : (
          <ol className="flex flex-col gap-3">
            {draft.rxLines.map((line, i) => (
              <RxLineEditor key={line.uid} line={line} index={i} />
            ))}
          </ol>
        )}
      </FormSection>

      <FormSection icon={Note01Icon} title="Recommandations" hint="Conseils au propriétaire, prochain contrôle">
        <Textarea
          value={draft.rxNotes}
          onChange={(e) => update({ rxNotes: e.target.value })}
          placeholder="Ex : garder la collerette 10 jours, contrôle dans 2 semaines"
          aria-label="Recommandations"
          className="min-h-24 resize-y bg-muted"
        />
      </FormSection>
    </Workspace>
  );
}

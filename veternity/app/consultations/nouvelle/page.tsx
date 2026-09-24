"use client";

import type { Animal } from "@/app/(dashboard)/animaux/_components/data";
import { VETS } from "@/app/(dashboard)/appointments/_components/data";
import { formatMoney } from "@/app/(dashboard)/_components/bilan-data";
import { findStockItem } from "@/app/(dashboard)/inventory/_components/stock-data";
import { PawIcon } from "@/components/layout/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  AiMagicIcon,
  ArrowRight01Icon,
  Calendar03Icon,
  PulseIcon,
  StethoscopeIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ActsSection } from "./_components/acts-section";
import { getAct } from "./_components/catalog";
import { STEP_HREFS } from "./_components/consultation-stepper";
import { commitStock, computeTotals, parseAmount, useConsultationDraft } from "./_components/draft-context";
import { FormSection } from "./_components/form-section";
import { HistoryPanel } from "./_components/history-panel";
import { PatientCard } from "./_components/patient-card";
import { PatientPicker } from "./_components/patient-picker";
import { saveConsultation } from "./_components/persist";
import { StockImpact } from "./_components/stock-impact";
import { VitalsFields } from "./_components/vitals-fields";
import { RailRow, RailSection, RailTotal, SummaryRail, Workspace } from "./_components/workspace";

function ChecklistItem({ done, children }: { done: boolean; children: string }) {
  return (
    <li className="flex items-center gap-2.5 text-sm">
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          done ? "bg-primary text-primary-foreground" : "border border-dashed border-muted-foreground/50",
        )}
      >
        {done && <HugeiconsIcon icon={Tick02Icon} className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className={done ? "text-muted-foreground" : "text-foreground"}>
        {children}
      </span>
    </li>
  );
}

export default function NouvelleConsultationPage() {
  const router = useRouter();
  const { draft, animal, update } = useConsultationDraft();
  const [isImproving, setIsImproving] = useState(false);

  const checklist = [
    { label: "Patient sélectionné", done: animal !== null },
    { label: "Poids du jour", done: draft.vitals.weightKg.trim() !== "" },
    { label: "Diagnostic rédigé", done: draft.diagnostic.trim() !== "" },
    { label: "Au moins un acte", done: draft.acts.length > 0 },
  ];
  const canSave = checklist.every((c) => c.done);

  const { total } = computeTotals(draft);
  const fees = draft.acts.reduce((sum, a) => sum + getAct(a.actId).price, 0);
  const products = draft.acts.reduce((sum, a) => sum + (findStockItem(a.productId)?.unitPrice ?? 0) * a.quantity, 0);

  const selectAnimal = (a: Animal) =>
    update((d) => ({
      animalId: a.id,
      vitals: { ...d.vitals, weightKg: a.weightKg ? String(a.weightKg) : "" },
    }));

  const handleSave = () => {
    if (!canSave || !animal) return;
    const consultationId = saveConsultation(draft, animal);
    const committedStock = commitStock(draft, consultationId);
    update({ committedStock, consultationId });
    router.push(STEP_HREFS.ordonnance);
  };

  const handleImproveDiagnostic = () => {
    const current = draft.diagnostic.trim();
    if (!current || isImproving) return;

    setIsImproving(true);
    setTimeout(() => {
      const polished = current
        .replace(/\s+/g, " ")
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
        .join(" ")
        .trim();
      update({ diagnostic: /[.!?]$/.test(polished) ? polished : `${polished}.` });
      setIsImproving(false);
    }, 900);
  };

  const weight = parseAmount(draft.vitals.weightKg);

  return (
    <Workspace
      left={
        animal ? (
          <>
            <div className="border-b border-border p-4">
              <PatientCard
                animal={animal}
                weightKg={draft.vitals.weightKg.trim() !== "" ? weight : undefined}
                asOfDate={draft.date}
                action={
                  <Button type="button" variant="ghost" size="sm" onClick={() => update({ animalId: null })}>
                    Changer
                  </Button>
                }
              />
            </div>
            <HistoryPanel key={animal.id} animal={animal} excludeId={draft.consultationId} />
          </>
        ) : (
          <PatientPicker onSelect={selectAnimal} />
        )
      }
      right={
        <SummaryRail
          title="Récapitulatif"
          footer={
            <>
              <RailTotal
                label="Total provisoire"
                value={formatMoney(total)}
                detail={`${draft.acts.length} acte${draft.acts.length > 1 ? "s" : ""}`}
              />
              <Button type="button" size="lg" disabled={!canSave} onClick={handleSave} className="h-10 w-full">
                {draft.consultationId ? "Mettre à jour et continuer" : "Enregistrer et continuer"}
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2.2} data-icon="inline-end" />
              </Button>
            </>
          }
        >
          <RailSection label="Avant d'enregistrer">
            <ul className="flex flex-col gap-2">
              {checklist.map((c) => (
                <ChecklistItem key={c.label} done={c.done}>
                  {c.label}
                </ChecklistItem>
              ))}
            </ul>
          </RailSection>

          <RailSection label="Montant">
            <div className="flex flex-col gap-1.5">
              <RailRow label="Honoraires" value={formatMoney(fees)} muted />
              <RailRow label="Produits du stock" value={formatMoney(products)} muted />
            </div>
          </RailSection>

          <RailSection label="Sorties de stock">
            <StockImpact emptyText="Aucun produit utilisé pour l'instant." />
          </RailSection>
        </SummaryRail>
      }
    >
      {!animal ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card px-8 py-20 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 text-foreground">
            <PawIcon className="h-5 w-5" />
          </span>
          <p className="text-sm font-semibold text-foreground">Quel patient consultez-vous ?</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Choisissez l&apos;animal dans la liste à gauche. Son dossier et ses antécédents s&apos;afficheront à côté de la
            saisie.
          </p>
        </div>
      ) : (
        <>
          <FormSection icon={Calendar03Icon} title="Séance" hint="Date, vétérinaire et motif de la visite">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="consultation-date" className="text-xs">
                  Date
                </Label>
                <Input
                  id="consultation-date"
                  type="date"
                  value={draft.date}
                  onChange={(e) => update({ date: e.target.value })}
                  className="h-10 bg-muted"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="consultation-vet" className="text-xs">
                  Vétérinaire
                </Label>
                <Select value={draft.vet} onValueChange={(vet) => update({ vet })}>
                  <SelectTrigger id="consultation-vet" className="h-10! w-full bg-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VETS.map((vet) => (
                      <SelectItem key={vet} value={vet}>
                        {vet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="consultation-motif" className="text-xs">
                Motif de consultation
              </Label>
              <Textarea
                id="consultation-motif"
                value={draft.motif}
                onChange={(e) => update({ motif: e.target.value })}
                placeholder="Ex : se gratte l'oreille droite depuis une semaine"
                className="min-h-16 resize-none bg-muted"
              />
            </div>
          </FormSection>

          <FormSection
            icon={PulseIcon}
            title="Constantes"
            hint={`Comparées aux normes : ${animal.species.toLowerCase()} adulte au repos`}
          >
            <VitalsFields animal={animal} />
          </FormSection>

          <FormSection
            icon={StethoscopeIcon}
            title="Diagnostic"
            hint="Examen clinique, hypothèses et conclusion"
            action={
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isImproving || !draft.diagnostic.trim()}
                onClick={handleImproveDiagnostic}
                className={!isImproving && draft.diagnostic.trim() ? "ai-shine-btn" : undefined}
              >
                <HugeiconsIcon icon={AiMagicIcon} strokeWidth={2.2} />
                {isImproving ? "Amélioration…" : "Améliorer"}
              </Button>
            }
          >
            <Textarea
              id="consultation-diagnostic"
              aria-label="Diagnostic"
              value={draft.diagnostic}
              onChange={(e) => update({ diagnostic: e.target.value })}
              placeholder="Observations cliniques, hypothèses, diagnostic retenu…"
              className="min-h-36 resize-y bg-muted leading-relaxed"
            />
          </FormSection>

          <ActsSection animal={animal} />
        </>
      )}
    </Workspace>
  );
}

"use client";

import { Suspense, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, ClipboardCheckIcon, Medicine02Icon, PillIcon, StethoscopeIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ANIMALS } from "@/app/(dashboard)/animaux/_components/data";
import { VETS } from "@/app/(dashboard)/appointments/_components/data";
import { CONSULTATIONS } from "@/app/(dashboard)/consultations/(tabs)/liste/_components/data";
import { STATUS_META, formatDate } from "@/app/(dashboard)/consultations/(tabs)/liste/_components/utils";
import { PRESCRIPTIONS } from "@/app/(dashboard)/consultations/(tabs)/prescriptions/_components/data";
import { EditorTopbar } from "../_components/editor-topbar";
import { BookSpine } from "../_components/book-spine";
import { AnimalIdCard } from "../_components/animal-id-card";
import { ClinicalNote } from "../_components/clinical-note";
import { SectionLabel } from "../_components/section-label";
import { AiChat } from "../_components/ai-chat";

function PrescriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const animal = searchParams.get("animal") ?? "";
  const owner = searchParams.get("owner") ?? "";
  const species = searchParams.get("species") ?? "";
  const animalRecord = ANIMALS.find((a) => a.name.toLowerCase() === animal.toLowerCase());

  const [medications, setMedications] = useState("");
  const [posology, setPosology] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [vet, setVet] = useState(VETS[0]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const history = useMemo(() => {
    if (!animal) return [];
    return CONSULTATIONS.filter((c) => c.animal.toLowerCase() === animal.toLowerCase()).sort((a, b) =>
      b.date.localeCompare(a.date)
    );
  }, [animal]);

  const canSave = animal !== "" && medications.trim() !== "" && date !== "";

  const handleSave = (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSave) return;

    PRESCRIPTIONS.unshift({
      id: `P${Math.floor(1000 + Math.random() * 9000)}`,
      animal,
      species: species || "—",
      owner: owner || "—",
      medications: medications.trim(),
      posology: posology.trim() || "—",
      date,
      vet,
    });

    router.push("/consultations/prescriptions");
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      <EditorTopbar
        title="Écrire une prescription"
        subtitle={animal ? `${animal} · ${owner}` : "Aucun animal sélectionné"}
        backHref="/consultations/nouvelle"
      />

      <div className="flex min-h-0 flex-1 justify-center bg-muted p-2 sm:p-3">
        <div className="relative flex min-h-0 w-full max-w-[1900px] overflow-hidden rounded-xl bg-card shadow-2xl">
          <BookSpine />
          <div className="flex min-h-0 w-1/2 flex-col overflow-y-auto bg-muted/40 p-4">
            {animalRecord && (
              <div className="shrink-0">
                <AnimalIdCard animal={animalRecord} />
              </div>
            )}

            <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2">
              <div className="flex shrink-0 items-center gap-2 px-0.5">
                <HugeiconsIcon icon={ClipboardCheckIcon} className="h-4 w-4 text-muted-foreground" strokeWidth={2.2} />
                <h2 className="text-sm font-bold text-foreground">Antécédents{animal ? ` de ${animal}` : ""}</h2>
              </div>

              {!animal && (
                <EmptyState
                  icon={StethoscopeIcon}
                  title="Aucun animal sélectionné"
                  description="Revenez à la consultation pour choisir un patient."
                />
              )}
              {animal && history.length === 0 && (
                <EmptyState icon={StethoscopeIcon} title="Aucun antécédent" description={`Rien à afficher pour ${animal}.`} />
              )}
              {history.map((c) => {
                const status = STATUS_META[c.status];
                const isOpen = expandedId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setExpandedId(isOpen ? null : c.id)}
                    className="rounded-lg border border-border bg-card p-3 text-left shadow-sm transition-colors hover:border-primary/30"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(c.date)} · {c.vet}
                      </span>
                      <Badge className={`shrink-0 ${status.bg} ${status.text}`}>{c.status}</Badge>
                    </div>
                    <p className={`mt-2 text-sm text-foreground ${isOpen ? "" : "truncate"}`}>{c.diagnostic}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSave} className="flex min-h-0 w-1/2 flex-col gap-5 overflow-y-auto bg-card p-6">
            {!animalRecord && (
              <div className="rounded-xl border border-dashed border-border bg-muted p-4 text-sm text-muted-foreground">
                Sélectionnez d&apos;abord un animal depuis la consultation.
              </div>
            )}

            <div className="rounded-xl border border-border bg-muted p-5">
              <SectionLabel icon={PillIcon} title="Médicaments" hint="Traitement prescrit et posologie" />
              <div className="mt-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="prescription-medications">Médicaments *</Label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Medicine02Icon}
                      className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      strokeWidth={2}
                    />
                    <Input
                      id="prescription-medications"
                      value={medications}
                      onChange={(e) => setMedications(e.target.value)}
                      placeholder="Ex: Amoxicilline 250mg"
                      className="h-11 bg-card pl-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="prescription-date">Date *</Label>
                    <div className="relative">
                      <HugeiconsIcon
                        icon={Calendar03Icon}
                        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        strokeWidth={2}
                      />
                      <Input
                        id="prescription-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-11 bg-card pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Vétérinaire</Label>
                    <Select value={vet} onValueChange={setVet}>
                      <SelectTrigger className="h-11 w-full bg-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VETS.map((v) => (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <ClinicalNote icon={ClipboardCheckIcon} title="Posologie" meta="Dosage, fréquence et durée du traitement">
              <Textarea
                id="prescription-posology"
                aria-label="Posologie"
                value={posology}
                onChange={(e) => setPosology(e.target.value)}
                placeholder="Ex: 1 comprimé matin et soir, pendant 10 jours"
                className="min-h-32 flex-1 resize-none border-none bg-transparent p-0 shadow-none focus-visible:ring-0"
              />
            </ClinicalNote>
          </form>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border bg-card px-6 py-4">
        <Button type="button" disabled={!canSave} onClick={() => handleSave()} className="gap-1.5 bg-primary hover:bg-primary/90">
          Enregistrer la prescription
        </Button>
      </div>

      <AiChat animal={animalRecord ?? null} />
    </div>
  );
}

export default function NouvellePrescriptionPage() {
  return (
    <Suspense fallback={null}>
      <PrescriptionForm />
    </Suspense>
  );
}

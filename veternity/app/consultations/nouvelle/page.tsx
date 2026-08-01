"use client";

import { ANIMALS } from "@/app/(dashboard)/animaux/_components/data";
import { VETS } from "@/app/(dashboard)/appointments/_components/data";
import {
  CONSULTATIONS,
  type Consultation,
  type ConsultationStatus,
} from "@/app/(dashboard)/consultations/(tabs)/liste/_components/data";
import { STATUS_META, formatDate } from "@/app/(dashboard)/consultations/(tabs)/liste/_components/utils";
import { PawIcon } from "@/components/layout/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AiMagicIcon,
  ArrowLeft01Icon,
  Calendar03Icon,
  ClipboardCheckIcon,
  PillIcon,
  Search01Icon,
  StethoscopeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { AiChat } from "./_components/ai-chat";
import { AnimalIdCard } from "./_components/animal-id-card";
import { BookSpine } from "./_components/book-spine";
import { ClinicalNote } from "./_components/clinical-note";
import { EditorTopbar } from "./_components/editor-topbar";
import { SectionLabel } from "./_components/section-label";

function ConsultationDetailView({ consultation, onBack }: { consultation: Consultation; onBack: () => void }) {
  const animal = ANIMALS.find((a) => a.name.toLowerCase() === consultation.animal.toLowerCase());
  const status = STATUS_META[consultation.status];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-border bg-card p-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Retour à l'historique"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4.5 w-4.5" strokeWidth={2.2} />
        </button>
        <div className="flex flex-col leading-tight">
          <h2 className="text-sm font-bold text-foreground">Consultation du {formatDate(consultation.date)}</h2>
          <span className="text-xs text-muted-foreground">{consultation.vet}</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
        {animal && (
          <AnimalIdCard
            animal={animal}
            weightKg={consultation.weightKg}
            asOfDate={consultation.date}
            note={`Âge et poids enregistrés lors de cette visite du ${formatDate(consultation.date)} — peuvent différer des valeurs actuelles du dossier.`}
          />
        )}

        <ClinicalNote
          icon={StethoscopeIcon}
          title="Diagnostic"
          meta={`${formatDate(consultation.date)} · ${consultation.vet}`}
          status={consultation.status}
          statusClassName={`${status.bg} ${status.text}`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-line text-foreground">{consultation.diagnostic}</p>
        </ClinicalNote>
      </div>
    </div>
  );
}

const STATUS_OPTIONS: ConsultationStatus[] = ["En cours", "Terminée", "Annulée"];

const EMPTY_FORM = {
  animal: "",
  date: new Date().toISOString().slice(0, 10),
  vet: VETS[0],
  diagnostic: "",
  status: "En cours" as ConsultationStatus,
  weightKg: "",
};

export default function NouvelleConsultationPage() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [animalOpen, setAnimalOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [viewingConsultation, setViewingConsultation] = useState<Consultation | null>(null);
  const [isImproving, setIsImproving] = useState(false);

  const animalQuery = form.animal.trim().toLowerCase();
  const filteredAnimals = animalQuery
    ? ANIMALS.filter((a) => `${a.name} ${a.owner}`.toLowerCase().includes(animalQuery))
    : ANIMALS;
  const selectedAnimal = ANIMALS.find((a) => a.name.toLowerCase() === animalQuery);

  const canSave = !!selectedAnimal && form.date !== "" && form.diagnostic.trim() !== "" && form.weightKg.trim() !== "";

  const effectiveQuery = historySearch.trim() || selectedAnimal?.name || "";
  const history = useMemo(() => {
    if (!effectiveQuery) return CONSULTATIONS;
    const q = effectiveQuery.toLowerCase();
    return CONSULTATIONS.filter((c) => `${c.animal} ${c.owner} ${c.diagnostic}`.toLowerCase().includes(q));
  }, [effectiveQuery]);

  const handleSave = (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSave || !selectedAnimal) return;

    CONSULTATIONS.unshift({
      id: `C${Math.floor(1000 + Math.random() * 9000)}`,
      animal: selectedAnimal.name,
      species: selectedAnimal.species,
      owner: selectedAnimal.owner,
      vet: form.vet,
      date: form.date,
      diagnostic: form.diagnostic.trim(),
      status: form.status,
      weightKg: Number(form.weightKg),
    });

    router.push("/consultations/liste");
  };

  const handleImproveDiagnostic = () => {
    const current = form.diagnostic.trim();
    if (!current || isImproving) return;

    setIsImproving(true);
    setTimeout(() => {
      const polished = current
        .replace(/\s+/g, " ")
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
        .join(" ")
        .trim();
      const withPunctuation = /[.!?]$/.test(polished) ? polished : `${polished}.`;
      setForm((f) => ({ ...f, diagnostic: withPunctuation }));
      setIsImproving(false);
    }, 900);
  };

  const handleWritePrescription = () => {
    if (!selectedAnimal) return;
    const params = new URLSearchParams({
      animal: selectedAnimal.name,
      owner: selectedAnimal.owner,
      species: selectedAnimal.species,
    });
    router.push(`/consultations/nouvelle/prescription?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      <EditorTopbar
        title="Nouvelle consultation"
        subtitle={selectedAnimal ? `${selectedAnimal.name} · ${selectedAnimal.owner}` : "Aucun animal sélectionné"}
        backHref="/consultations/liste"
      />

      <div className="flex min-h-0 flex-1 justify-center bg-muted p-2 sm:p-3">
        <div className="relative flex min-h-0 w-full max-w-[1900px] overflow-hidden rounded-xl bg-card shadow-2xl">
          <BookSpine />
          <div className="flex min-h-0 w-1/2 flex-col bg-muted/40">
            {viewingConsultation ? (
              <ConsultationDetailView
                consultation={viewingConsultation}
                onBack={() => setViewingConsultation(null)}
              />
            ) : (
              <>
                <div className="flex shrink-0 flex-col gap-3 border-b border-border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={ClipboardCheckIcon} className="h-4 w-4 text-muted-foreground" strokeWidth={2.2} />
                    <h2 className="text-sm font-bold text-foreground">Historique des consultations</h2>
                  </div>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      strokeWidth={2}
                    />
                    <Input
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      placeholder={
                        selectedAnimal ? `Filtrer l'historique de ${selectedAnimal.name}...` : "Rechercher un animal..."
                      }
                      className="h-10 rounded-full border-border bg-muted pl-9 text-sm"
                    />
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
                  {history.length === 0 && (
                    <EmptyState icon={StethoscopeIcon} title="Aucune consultation" description="Aucun antécédent trouvé." />
                  )}
                  {history.map((c) => {
                    const status = STATUS_META[c.status];
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setViewingConsultation(c);
                          const matchedAnimal = ANIMALS.find((a) => a.name.toLowerCase() === c.animal.toLowerCase());
                          setForm((f) => ({
                            ...f,
                            animal: c.animal,
                            weightKg: matchedAnimal ? String(matchedAnimal.weightKg) : f.weightKg,
                          }));
                        }}
                        className="rounded-lg border border-border bg-card p-3 text-left shadow-sm transition-colors hover:border-primary/30"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">
                              {c.animal} <span className="font-normal text-muted-foreground">· {c.owner}</span>
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(c.date)} · {c.vet}
                            </span>
                          </div>
                          <Badge className={`shrink-0 ${status.bg} ${status.text}`}>{c.status}</Badge>
                        </div>
                        <p className="mt-2 truncate text-sm text-foreground">{c.diagnostic}</p>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

        <form onSubmit={handleSave} className="flex min-h-0 w-1/2 flex-col gap-5 overflow-y-auto bg-card p-6">
          <div>
            <SectionLabel icon={PawIcon} title="Patient" hint="Sélectionnez l'animal à consulter" />
            <div className="mt-3 flex flex-col gap-3">
              <Popover open={animalOpen} onOpenChange={setAnimalOpen}>
                <PopoverAnchor asChild>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      strokeWidth={2}
                    />
                    <Input
                      id="new-consultation-animal"
                      value={form.animal}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, animal: e.target.value }));
                        setAnimalOpen(true);
                      }}
                      onFocus={() => setAnimalOpen(true)}
                      placeholder="Rechercher un animal..."
                      className="h-11 bg-muted pl-9"
                      autoComplete="off"
                    />
                  </div>
                </PopoverAnchor>
                <PopoverContent
                  align="start"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  className="max-h-56 w-96 overflow-y-auto p-1"
                >
                  {filteredAnimals.length > 0 ? (
                    <div className="flex flex-col gap-0.5">
                      {filteredAnimals.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => {
                            setForm((f) => ({ ...f, animal: a.name, weightKg: String(a.weightKg) }));
                            setHistorySearch("");
                            setAnimalOpen(false);
                          }}
                          className="flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm text-foreground hover:bg-muted"
                        >
                          <span className="font-medium">{a.name}</span>
                          <span className="text-xs text-muted-foreground">{a.owner}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-2.5 py-2 text-sm text-muted-foreground">Aucun animal trouvé</div>
                  )}
                </PopoverContent>
              </Popover>

              {selectedAnimal && (
                <AnimalIdCard
                  animal={selectedAnimal}
                  weightKg={form.weightKg.trim() !== "" ? Number(form.weightKg) : undefined}
                  asOfDate={form.date}
                  note="Poids du jour saisi ci-dessous — peut différer de la dernière valeur au dossier."
                />
              )}
            </div>
          </div>

          <div className="shrink-0 rounded-xl border border-border bg-muted p-3.5">
            <SectionLabel icon={Calendar03Icon} title="Détails" hint="Date, poids, vétérinaire et statut" />
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <Label htmlFor="new-consultation-date" className="text-xs">Date *</Label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                    strokeWidth={2}
                  />
                  <Input
                    id="new-consultation-date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="h-9 bg-card pl-8 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="new-consultation-weight" className="text-xs">Poids (kg) *</Label>
                <Input
                  id="new-consultation-weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.weightKg}
                  onChange={(e) => setForm((f) => ({ ...f, weightKg: e.target.value }))}
                  placeholder="Ex: 4.2"
                  className="h-9 bg-card text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Vétérinaire</Label>
                <Select value={form.vet} onValueChange={(value) => setForm((f) => ({ ...f, vet: value }))}>
                  <SelectTrigger className="h-9 w-full bg-card text-sm">
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
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Statut</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm((f) => ({ ...f, status: value as ConsultationStatus }))}
                >
                  <SelectTrigger className="h-9 w-full bg-card text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <ClinicalNote
            icon={StethoscopeIcon}
            title="Diagnostic"
            meta="Examen, symptômes et conclusion"
            headerAction={
              <Button
                type="button"
                size="xs"
                variant="outline"
                disabled={isImproving || !form.diagnostic.trim()}
                onClick={handleImproveDiagnostic}
                className={`gap-1 ${!isImproving && form.diagnostic.trim() ? "ai-shine-btn" : ""}`}
              >
                <HugeiconsIcon icon={AiMagicIcon} className="h-3.5 w-3.5" strokeWidth={2.2} />
                {isImproving ? "Amélioration..." : "Améliorer"}
              </Button>
            }
          >
            <Textarea
              id="new-consultation-diagnostic"
              aria-label="Diagnostic"
              value={form.diagnostic}
              onChange={(e) => setForm((f) => ({ ...f, diagnostic: e.target.value }))}
              placeholder="Décrivez l'examen, les symptômes observés et le diagnostic..."
              className="min-h-32 flex-1 resize-none border-none bg-transparent p-0 shadow-none focus-visible:ring-0"
            />
          </ClinicalNote>
        </form>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border bg-card px-6 py-4">
        <Button
          type="button"
          variant="outline"
          disabled={!selectedAnimal}
          onClick={handleWritePrescription}
          className="gap-1.5"
        >
          <HugeiconsIcon icon={PillIcon} className="h-4 w-4" strokeWidth={2.2} />
          Écrire une prescription
        </Button>
        <Button type="button" disabled={!canSave} onClick={() => handleSave()} className="gap-1.5 bg-primary hover:bg-primary/90">
          Enregistrer la consultation
        </Button>
      </div>

      <AiChat animal={selectedAnimal ?? null} />
    </div>
  );
}

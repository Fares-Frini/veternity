"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Calendar03Icon,
  Cancel01Icon,
  PillIcon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ANIMALS } from "../../../../animaux/_components/data";
import { VETS } from "../../../../appointments/_components/data";
import type { Prescription } from "./data";

const EMPTY_FORM = {
  animal: "",
  medications: "",
  posology: "",
  date: "",
  vet: VETS[0],
};

function SectionLabel({ icon, title, hint }: { icon: IconSvgElement; title: string; hint: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-card text-muted-foreground shadow-sm">
        <HugeiconsIcon icon={icon} className="h-3.5 w-3.5" strokeWidth={2.2} />
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-bold text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
    </div>
  );
}

interface AddPrescriptionDialogProps {
  onAdd: (prescription: Prescription) => void;
  trigger?: ReactNode;
}

export function AddPrescriptionDialog({ onAdd, trigger }: AddPrescriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [animalOpen, setAnimalOpen] = useState(false);

  const animalQuery = form.animal.trim().toLowerCase();
  const filteredAnimals = animalQuery
    ? ANIMALS.filter((a) => `${a.name} ${a.owner}`.toLowerCase().includes(animalQuery))
    : ANIMALS;
  const selectedAnimal = ANIMALS.find((a) => a.name.toLowerCase() === animalQuery);

  const canSubmit = !!selectedAnimal && form.medications.trim() !== "" && form.date !== "";

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setForm(EMPTY_FORM);
      setAnimalOpen(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !selectedAnimal) return;

    onAdd({
      id: `P${Math.floor(1000 + Math.random() * 9000)}`,
      animal: selectedAnimal.name,
      species: selectedAnimal.species,
      owner: selectedAnimal.owner,
      medications: form.medications.trim(),
      posology: form.posology.trim() || "—",
      date: form.date,
      vet: form.vet,
    });

    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-1.5 bg-primary hover:bg-primary/90">
            <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" strokeWidth={2.4} />
            Nouvelle prescription
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] w-full max-w-lg gap-0 overflow-y-auto rounded-lg p-0 sm:max-w-lg" showCloseButton={false}>
        <div className="relative flex items-center justify-between bg-primary px-6 py-1.5 text-primary-foreground">
          <DialogHeader className="gap-0">
            <DialogTitle className="text-sm font-bold text-primary-foreground">Nouvelle prescription</DialogTitle>
          </DialogHeader>

          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground transition-colors hover:bg-primary-foreground/25"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-3 w-3" strokeWidth={2.4} />
            <span className="sr-only">Fermer</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 pt-5 pb-3">
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted p-5">
            <SectionLabel icon={PillIcon} title="Prescription" hint="Animal, médicaments et posologie" />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="prescription-animal">Animal *</Label>
              <Popover open={animalOpen} onOpenChange={setAnimalOpen}>
                <PopoverAnchor asChild>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      strokeWidth={2}
                    />
                    <Input
                      id="prescription-animal"
                      value={form.animal}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, animal: e.target.value }));
                        setAnimalOpen(true);
                      }}
                      onFocus={() => setAnimalOpen(true)}
                      placeholder="Rechercher un animal..."
                      className="h-11 bg-card pl-9"
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
                            setForm((f) => ({ ...f, animal: a.name }));
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
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="prescription-medications">Médicaments *</Label>
              <Input
                id="prescription-medications"
                value={form.medications}
                onChange={(e) => setForm((f) => ({ ...f, medications: e.target.value }))}
                placeholder="Ex: Amoxicilline 250mg"
                className="h-11 bg-card"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="prescription-posology">Posologie</Label>
              <Textarea
                id="prescription-posology"
                value={form.posology}
                onChange={(e) => setForm((f) => ({ ...f, posology: e.target.value }))}
                placeholder="Ex: 1 cp matin et soir, 10 jours"
                className="min-h-20 bg-card"
              />
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
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="h-11 bg-card pl-9"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Vétérinaire</Label>
                <Select value={form.vet} onValueChange={(value) => setForm((f) => ({ ...f, vet: value }))}>
                  <SelectTrigger className="h-11 w-full bg-card">
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
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!canSubmit} className="gap-1.5 bg-primary hover:bg-primary/90">
              Enregistrer la prescription
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

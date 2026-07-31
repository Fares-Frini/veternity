"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Bone02Icon,
  Cancel01Icon,
  Calendar03Icon,
  Clock01Icon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ANIMALS } from "../../animaux/_components/data";
import type { Appointment, AppointmentStatus } from "./data";
import { VETS } from "./data";

const STATUS_OPTIONS: AppointmentStatus[] = ["Confirmé", "En attente", "Terminé", "Annulé"];

const EMPTY_FORM = {
  animal: "",
  date: "",
  time: "",
  reason: "",
  vet: VETS[0],
  status: "Confirmé" as AppointmentStatus,
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

interface AddAppointmentDialogProps {
  onAdd: (appointment: Appointment) => void;
  trigger?: ReactNode;
}

export function AddAppointmentDialog({ onAdd, trigger }: AddAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [animalOpen, setAnimalOpen] = useState(false);

  const animalQuery = form.animal.trim().toLowerCase();
  const filteredAnimals = animalQuery
    ? ANIMALS.filter((a) => `${a.name} ${a.owner}`.toLowerCase().includes(animalQuery))
    : ANIMALS;
  const selectedAnimal = ANIMALS.find((a) => a.name.toLowerCase() === animalQuery);

  const canSubmit = form.animal.trim() !== "" && !!selectedAnimal && form.date !== "" && form.time !== "";

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
      id: `R${Math.floor(1000 + Math.random() * 9000)}`,
      date: form.date,
      time: form.time,
      animal: selectedAnimal.name,
      species: selectedAnimal.species,
      owner: selectedAnimal.owner,
      reason: form.reason.trim() || "Consultation générale",
      vet: form.vet,
      status: form.status,
    });

    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-1.5 bg-primary hover:bg-primary/90">
            <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" strokeWidth={2.4} />
            Ajouter
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] w-full max-w-lg gap-0 overflow-y-auto rounded-lg p-0 sm:max-w-lg" showCloseButton={false}>
        {/* Header fin */}
        <div className="relative flex items-center justify-between bg-primary px-6 py-1.5 text-primary-foreground">
          <DialogHeader className="gap-0">
            <DialogTitle className="text-sm font-bold text-primary-foreground">Ajouter un rendez-vous</DialogTitle>
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
            <SectionLabel icon={Bone02Icon} title="Rendez-vous" hint="Animal, date et motif de la visite" />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="appointment-animal">Animal *</Label>
              <Popover open={animalOpen} onOpenChange={setAnimalOpen}>
                <PopoverAnchor asChild>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      strokeWidth={2}
                    />
                    <Input
                      id="appointment-animal"
                      value={form.animal}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, animal: e.target.value }));
                        setAnimalOpen(true);
                      }}
                      onFocus={() => setAnimalOpen(true)}
                      placeholder="Rechercher un animal..."
                      className="h-11 bg-white pl-9"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="appointment-date">Date *</Label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    strokeWidth={2}
                  />
                  <Input
                    id="appointment-date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="h-11 bg-white pl-9"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="appointment-time">Heure *</Label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    strokeWidth={2}
                  />
                  <Input
                    id="appointment-time"
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className="h-11 bg-white pl-9"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="appointment-reason">Motif</Label>
              <Input
                id="appointment-reason"
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                placeholder="Ex: Vaccination annuelle"
                className="h-11 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Vétérinaire</Label>
                <Select value={form.vet} onValueChange={(value) => setForm((f) => ({ ...f, vet: value }))}>
                  <SelectTrigger className="h-11 w-full bg-white">
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

              <div className="flex flex-col gap-1.5">
                <Label>Statut</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm((f) => ({ ...f, status: value as AppointmentStatus }))}
                >
                  <SelectTrigger className="h-11 w-full bg-white">
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

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!canSubmit} className="gap-1.5 bg-primary hover:bg-primary/90">
              Enregistrer le rendez-vous
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

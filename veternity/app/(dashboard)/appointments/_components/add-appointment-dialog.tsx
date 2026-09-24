"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Cancel01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, type FormEvent, type ReactNode } from "react";
import { ANIMALS } from "../../animaux/_components/data";
import { AppointmentFormFields, EMPTY_APPOINTMENT_FORM } from "./appointment-form-fields";
import type { Appointment } from "./data";

interface AddAppointmentDialogProps {
  onAdd: (appointment: Appointment) => void;
  trigger?: ReactNode;
}

export function AddAppointmentDialog({ onAdd, trigger }: AddAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_APPOINTMENT_FORM);
  const [animalOpen, setAnimalOpen] = useState(false);

  const animalQuery = form.animal.trim().toLowerCase();
  const selectedAnimal = ANIMALS.find((a) => a.name.toLowerCase() === animalQuery);

  const canSubmit = form.animal.trim() !== "" && !!selectedAnimal && form.date !== "" && form.time !== "";

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setForm(EMPTY_APPOINTMENT_FORM);
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
          <AppointmentFormFields
            form={form}
            onChange={setForm}
            animalOpen={animalOpen}
            onAnimalOpenChange={setAnimalOpen}
          />

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

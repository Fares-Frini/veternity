"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState, type FormEvent } from "react";
import { AppointmentFormFields, EMPTY_APPOINTMENT_FORM, type AppointmentFormValues } from "./appointment-form-fields";
import type { Appointment } from "./data";

interface EditAppointmentDialogProps {
  appointment: Appointment | null;
  onOpenChange: (open: boolean) => void;
  onSave: (appointment: Appointment) => void;
}

export function EditAppointmentDialog({ appointment, onOpenChange, onSave }: EditAppointmentDialogProps) {
  const [form, setForm] = useState<AppointmentFormValues>(EMPTY_APPOINTMENT_FORM);

  useEffect(() => {
    if (appointment) {
      setForm({
        animal: appointment.animal,
        date: appointment.date,
        time: appointment.time,
        reason: appointment.reason,
        vet: appointment.vet,
        status: appointment.status,
      });
    }
  }, [appointment]);

  const canSubmit = form.date !== "" && form.time !== "";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!appointment || !canSubmit) return;

    onSave({
      ...appointment,
      date: form.date,
      time: form.time,
      reason: form.reason.trim() || appointment.reason,
      vet: form.vet,
      status: form.status,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={!!appointment} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-full max-w-lg gap-0 overflow-y-auto rounded-lg p-0 sm:max-w-lg" showCloseButton={false}>
        <div className="relative flex items-center justify-between bg-primary px-6 py-1.5 text-primary-foreground">
          <DialogHeader className="gap-0">
            <DialogTitle className="text-sm font-bold text-primary-foreground">Modifier le rendez-vous</DialogTitle>
          </DialogHeader>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
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
            animalOpen={false}
            onAnimalOpenChange={() => {}}
            animalLocked
          />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!canSubmit} className="gap-1.5 bg-primary hover:bg-primary/90">
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

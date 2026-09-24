"use client";

import { PawIcon, type IconComponent } from "@/components/layout/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar03Icon,
  Clock01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { ANIMALS } from "../../animaux/_components/data";
import type { AppointmentStatus } from "./data";
import { VETS } from "./data";

export const STATUS_OPTIONS: AppointmentStatus[] = ["Confirmé", "En attente", "Terminé", "Annulé"];

export interface AppointmentFormValues {
  animal: string;
  date: string;
  time: string;
  reason: string;
  vet: string;
  status: AppointmentStatus;
}

export const EMPTY_APPOINTMENT_FORM: AppointmentFormValues = {
  animal: "",
  date: "",
  time: "",
  reason: "",
  vet: VETS[0],
  status: "Confirmé",
};

export function SectionLabel({
  icon,
  title,
  hint,
}: {
  icon: IconSvgElement | IconComponent;
  title: string;
  hint: string;
}) {
  const CustomIcon = typeof icon === "function" ? icon : null;
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-card text-muted-foreground shadow-sm">
        {CustomIcon ? (
          <CustomIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
        ) : (
          <HugeiconsIcon icon={icon as IconSvgElement} className="h-3.5 w-3.5" strokeWidth={2.2} />
        )}
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-bold text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
    </div>
  );
}

interface AppointmentFormFieldsProps {
  form: AppointmentFormValues;
  onChange: (form: AppointmentFormValues) => void;
  animalOpen: boolean;
  onAnimalOpenChange: (open: boolean) => void;
  animalLocked?: boolean;
}

export function AppointmentFormFields({
  form,
  onChange,
  animalOpen,
  onAnimalOpenChange,
  animalLocked,
}: AppointmentFormFieldsProps) {
  const animalQuery = form.animal.trim().toLowerCase();
  const filteredAnimals = animalQuery
    ? ANIMALS.filter((a) => `${a.name} ${a.owner}`.toLowerCase().includes(animalQuery))
    : ANIMALS;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted p-5">
      <SectionLabel icon={PawIcon} title="Rendez-vous" hint="Animal, date et motif de la visite" />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="appointment-animal">Animal *</Label>
        <Popover open={animalOpen} onOpenChange={onAnimalOpenChange}>
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
                disabled={animalLocked}
                onChange={(e) => {
                  onChange({ ...form, animal: e.target.value });
                  onAnimalOpenChange(true);
                }}
                onFocus={() => !animalLocked && onAnimalOpenChange(true)}
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
                      onChange({ ...form, animal: a.name });
                      onAnimalOpenChange(false);
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
              onChange={(e) => onChange({ ...form, date: e.target.value })}
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
              onChange={(e) => onChange({ ...form, time: e.target.value })}
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
          onChange={(e) => onChange({ ...form, reason: e.target.value })}
          placeholder="Ex: Vaccination annuelle"
          className="h-11 bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Vétérinaire</Label>
          <Select value={form.vet} onValueChange={(value) => onChange({ ...form, vet: value })}>
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
            onValueChange={(value) => onChange({ ...form, status: value as AppointmentStatus })}
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
  );
}

"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Calendar03Icon,
  Cancel01Icon,
  Mail01Icon,
  MapPinIcon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PawIcon } from "@/components/layout/icons";
import { ANIMALS } from "../../animaux/_components/data";
import { SPECIES_COLOR, SPECIES_ICON } from "../../animaux/_components/utils";
import { APPOINTMENTS, type AppointmentStatus } from "../../appointments/_components/data";
import type { Client } from "./data";

const STATUS_BADGE: Record<AppointmentStatus, "info" | "warning" | "teal" | "danger"> = {
  "Confirmé": "info",
  "En attente": "warning",
  "Terminé": "teal",
  "Annulé": "danger",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function InfoRow({ icon, label, value }: { icon: IconSvgElement; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-card text-muted-foreground shadow-sm">
        <HugeiconsIcon icon={icon} className="h-3.5 w-3.5" strokeWidth={2.2} />
      </span>
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="truncate text-sm font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}

interface ClientDetailDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientDetailDialog({ client, open, onOpenChange }: ClientDetailDialogProps) {
  const animals = client ? ANIMALS.filter((a) => a.owner === client.name) : [];
  const appointments = client
    ? APPOINTMENTS.filter((a) => a.owner === client.name).sort((a, b) =>
        `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
      )
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92vh] w-full max-w-lg gap-0 overflow-y-auto rounded-lg p-0 sm:max-w-lg"
        showCloseButton={false}
      >
        {client && (
          <>
            <div className="relative flex items-center gap-3 bg-primary px-6 py-3 text-primary-foreground">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary-foreground/15 text-sm font-bold text-primary-foreground">
                  {client.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <DialogHeader className="gap-0">
                <DialogTitle className="text-sm font-bold text-primary-foreground">{client.name}</DialogTitle>
                <span className="font-mono text-xs text-primary-foreground/70">#{client.id}</span>
              </DialogHeader>

              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="absolute top-3 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground transition-colors hover:bg-primary-foreground/25"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-3 w-3" strokeWidth={2.4} />
                <span className="sr-only">Fermer</span>
              </button>
            </div>

            <div className="flex flex-col gap-4 px-6 pt-5 pb-6">
              <div className="flex flex-col gap-3.5 rounded-xl border border-border bg-muted p-5">
                <span className="text-sm font-bold text-foreground">Coordonnées</span>
                <InfoRow icon={SmartPhone01Icon} label="Téléphone" value={client.phone} />
                <InfoRow icon={Mail01Icon} label="Email" value={client.email} />
                <InfoRow icon={MapPinIcon} label="Adresse" value={client.address} />
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted p-5">
                <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <PawIcon className="h-4 w-4 text-primary" strokeWidth={2.2} />
                  Animaux
                  <Badge variant="secondary" className="ml-auto">
                    {animals.length}
                  </Badge>
                </span>
                {animals.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun animal rattaché à ce client.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {animals.map((animal) => {
                      const speciesClasses = SPECIES_COLOR[animal.species] ?? "bg-card text-muted-foreground";
                      const speciesIcon = SPECIES_ICON[animal.species];
                      return (
                        <div
                          key={animal.id}
                          className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2"
                        >
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className={`text-[10px] font-bold ${speciesClasses}`}>
                              {animal.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex min-w-0 flex-col leading-tight">
                            <span className="truncate text-sm font-semibold text-foreground">{animal.name}</span>
                            <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                              {speciesIcon && (
                                <HugeiconsIcon icon={speciesIcon} className="h-3 w-3 shrink-0" strokeWidth={2.2} />
                              )}
                              {animal.species} · {animal.breed}
                            </span>
                          </div>
                          {animal.kind === "troupeau" && (
                            <Badge variant="brown" className="ml-auto shrink-0">
                              {animal.count} têtes
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted p-5">
                <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <HugeiconsIcon icon={Calendar03Icon} className="h-4 w-4 text-primary" strokeWidth={2.2} />
                  Rendez-vous
                  <Badge variant="secondary" className="ml-auto">
                    {appointments.length}
                  </Badge>
                </span>
                {appointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun rendez-vous enregistré.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {appointments.map((appt) => (
                      <div
                        key={appt.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2"
                      >
                        <div className="flex min-w-0 flex-col leading-tight">
                          <span className="truncate text-sm font-semibold text-foreground">
                            {appt.animal} — {appt.reason}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {formatDate(appt.date)} · {appt.time} · {appt.vet}
                          </span>
                        </div>
                        <Badge variant={STATUS_BADGE[appt.status]} className="shrink-0">
                          {appt.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

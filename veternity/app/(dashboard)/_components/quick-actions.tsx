"use client";

import { BoxIcon, CalendarIcon, PawIcon, UsersIcon, type IconComponent } from "@/components/layout/icons";
import { PAGE_THEMES } from "@/components/layout/page-theme";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentProps } from "react";
import { AddAnimalDialog } from "../animaux/_components/add-animal-dialog";
import { ANIMALS } from "../animaux/_components/data";
import { AddAppointmentDialog } from "../appointments/_components/add-appointment-dialog";
import { APPOINTMENTS } from "../appointments/_components/data";
import { AddClientDialog } from "../clients/_components/add-client-dialog";
import { CLIENTS } from "../clients/_components/data";
function ActionTrigger({
  icon: Icon,
  label,
  fullLabel,
  accent,
  className,
  ...props
}: {
  icon: IconComponent;
  label: string;
  fullLabel: string;
  accent: string;
} & ComponentProps<"button">) {
  return (
    <button
      type="button"
      title={fullLabel}
      aria-label={fullLabel}
      className={cn("flex w-full items-center gap-1.5 rounded-md py-1 pr-2 pl-1 text-left transition-colors hover:bg-muted", className)}
      {...props}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `color-mix(in srgb, ${accent} 16%, white)` }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: accent }} strokeWidth={2.2} />
      </span>
      <span className="truncate text-xs font-semibold text-foreground">{label}</span>
    </button>
  );
}

export function QuickActionsBar() {
  return (
    <div className="flex flex-col gap-3 p-5">
      <span className="text-sm text-muted-foreground">Accès rapides</span>
      <div className="grid grid-cols-2 gap-1.5">
        <AddAnimalDialog
          owners={CLIENTS.map((c) => c.name)}
          onAdd={(animal) => ANIMALS.unshift(animal)}
          onAddClient={(client) => CLIENTS.unshift(client)}
          trigger={<ActionTrigger icon={PawIcon} label="Ajouter animal" fullLabel="Ajouter un animal" accent={PAGE_THEMES.animaux.accent} />}
        />
        <AddClientDialog
          onAdd={(client) => CLIENTS.unshift(client)}
          trigger={<ActionTrigger icon={UsersIcon} label="Ajouter client" fullLabel="Ajouter un client" accent={PAGE_THEMES.clients.accent} />}
        />
        <AddAppointmentDialog
          onAdd={(appointment) => APPOINTMENTS.unshift(appointment)}
          trigger={<ActionTrigger icon={CalendarIcon} label="Ajouter RDV" fullLabel="Planifier un rendez-vous" accent={PAGE_THEMES.appointments.accent} />}
        />
        <Link
          href="/inventory"
          title="Gérer l'inventaire"
          aria-label="Gérer l'inventaire"
          className="flex items-center gap-1.5 rounded-md py-1 pr-2 pl-1 transition-colors hover:bg-muted"
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: `color-mix(in srgb, ${PAGE_THEMES.inventory.accent} 16%, white)` }}
          >
            <BoxIcon className="h-3.5 w-3.5" style={{ color: PAGE_THEMES.inventory.accent }} strokeWidth={2.2} />
          </span>
          <span className="truncate text-xs font-semibold text-foreground">Gérer stock</span>
        </Link>
      </div>
    </div>
  );
}

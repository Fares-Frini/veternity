"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, ListViewIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Appointment, AppointmentStatus } from "./data";
import { AppointmentsAgenda } from "./appointments-agenda";
import { AppointmentsCalendar } from "./appointments-calendar";
import { STATUS_META } from "./utils";

export type AppointmentsView = "list" | "calendar";

const STATUS_OPTIONS: AppointmentStatus[] = ["Confirmé", "En attente", "Terminé", "Annulé"];

interface AppointmentsPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: AppointmentStatus | "all";
  onStatusFilterChange: (status: AppointmentStatus | "all") => void;
  view: AppointmentsView;
  onViewChange: (view: AppointmentsView) => void;
  allAppointments: Appointment[];
  filteredAppointments: Appointment[];
}

export function AppointmentsPanel({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  view,
  onViewChange,
  allAppointments,
  filteredAppointments,
}: AppointmentsPanelProps) {
  const countFor = (status: AppointmentStatus | "all") =>
    status === "all" ? allAppointments.length : allAppointments.filter((a) => a.status === status).length;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <HugeiconsIcon
              icon={Search01Icon}
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={2}
            />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un animal, un propriétaire, un motif..."
              className="h-10 rounded-full border-border bg-muted pl-9 text-sm"
            />
          </div>

          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value) => value && onViewChange(value as AppointmentsView)}
            variant="outline"
            className="rounded-md border-border bg-card"
          >
            <ToggleGroupItem
              value="list"
              aria-label="Vue agenda"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <HugeiconsIcon icon={ListViewIcon} className="h-4 w-4" strokeWidth={2.2} />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="calendar"
              aria-label="Vue calendrier"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <HugeiconsIcon icon={Calendar03Icon} className="h-4 w-4" strokeWidth={2.2} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Quick status filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onStatusFilterChange("all")}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === "all"
                ? "border-primary bg-secondary text-secondary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-border/60"
            }`}
          >
            Tous
            <span className="opacity-70">{countFor("all")}</span>
          </button>
          {STATUS_OPTIONS.map((status) => {
            const meta = STATUS_META[status];
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => onStatusFilterChange(status)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isActive ? `border-transparent ${meta.bg} ${meta.text}` : "border-border bg-card text-muted-foreground hover:border-border/60"
                }`}
              >
                {status}
                <span className="opacity-70">{countFor(status)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {view === "list" ? (
        <AppointmentsAgenda appointments={filteredAppointments} />
      ) : (
        <AppointmentsCalendar appointments={filteredAppointments} />
      )}
    </div>
  );
}

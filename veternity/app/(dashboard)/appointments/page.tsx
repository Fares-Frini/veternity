"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { AppointmentsStats } from "./_components/appointments-stats";
import { AppointmentsPanel, type AppointmentsView } from "./_components/appointments-panel";
import { AddAppointmentDialog } from "./_components/add-appointment-dialog";
import { APPOINTMENTS, type Appointment, type AppointmentStatus } from "./_components/data";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(APPOINTMENTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [view, setView] = useState<AppointmentsView>("list");

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return appointments
      .filter((a) => statusFilter === "all" || a.status === statusFilter)
      .filter((a) => {
        if (!query) return true;
        return [a.id, a.animal, a.owner, a.reason, a.vet].join(" ").toLowerCase().includes(query);
      })
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  }, [appointments, search, statusFilter]);

  const handleAddAppointment = (appointment: Appointment) => {
    setAppointments((prev) => [appointment, ...prev]);
    setSearch("");
    setStatusFilter("all");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Rendez-vous</h1>
          <p className="text-sm text-muted-foreground">Planning et suivi des consultations de la clinique</p>
        </div>
        <AddAppointmentDialog
          onAdd={handleAddAppointment}
          trigger={
            <Button size="lg" className="gap-1.5 bg-primary hover:bg-primary/90">
              <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" strokeWidth={2.4} />
              Ajouter un rendez-vous
            </Button>
          }
        />
      </div>

      <AppointmentsStats appointments={appointments} />

      <AppointmentsPanel
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        view={view}
        onViewChange={setView}
        allAppointments={appointments}
        filteredAppointments={filteredAppointments}
      />
    </div>
  );
}

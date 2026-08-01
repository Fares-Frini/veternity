"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { AppointmentsBanner } from "./_components/appointments-banner";
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
    <div className="overflow-hidden border border-border bg-card shadow-sm">
      <AppointmentsBanner />

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
        headerAction={
          <AddAppointmentDialog
            onAdd={handleAddAppointment}
            trigger={
              <Button className="gap-1.5 bg-primary hover:bg-primary/90">
                <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" strokeWidth={2.4} />
                Ajouter
              </Button>
            }
          />
        }
      />
    </div>
  );
}

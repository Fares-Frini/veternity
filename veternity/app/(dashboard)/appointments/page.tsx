"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { AppointmentsBanner } from "./_components/appointments-banner";
import { AppointmentsStats } from "./_components/appointments-stats";
import { AppointmentsPanel, type AppointmentsView } from "./_components/appointments-panel";
import { AddAppointmentDialog } from "./_components/add-appointment-dialog";
import { EditAppointmentDialog } from "./_components/edit-appointment-dialog";
import { APPOINTMENTS, type Appointment, type AppointmentStatus, type MovedAppointment } from "./_components/data";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(APPOINTMENTS);
  const [movedAppointments, setMovedAppointments] = useState<MovedAppointment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [view, setView] = useState<AppointmentsView>("calendar");
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

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

  const handleUpdateAppointment = (updated: Appointment) => {
    setAppointments((prev) => {
      const previous = prev.find((a) => a.id === updated.id);
      if (previous && (previous.date !== updated.date || previous.time !== updated.time)) {
        setMovedAppointments((moved) => [
          ...moved,
          { ...previous, ghostId: `${previous.id}-${Date.now()}` },
        ]);
      }
      return prev.map((a) => (a.id === updated.id ? updated : a));
    });
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
        movedAppointments={movedAppointments}
        onAppointmentClick={setEditingAppointment}
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

      <EditAppointmentDialog
        appointment={editingAppointment}
        onOpenChange={(open) => !open && setEditingAppointment(null)}
        onSave={handleUpdateAppointment}
      />
    </div>
  );
}

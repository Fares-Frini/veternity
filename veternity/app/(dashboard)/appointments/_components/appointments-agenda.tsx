import { HugeiconsIcon } from "@hugeicons/react";
import { StethoscopeIcon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Appointment } from "./data";
import { STATUS_META, formatDayHeader, todayKey } from "./utils";

function groupByDate(appointments: Appointment[]) {
  const map = new Map<string, Appointment[]>();
  for (const appointment of appointments) {
    const list = map.get(appointment.date) ?? [];
    list.push(appointment);
    map.set(appointment.date, list);
  }
  for (const list of map.values()) list.sort((a, b) => a.time.localeCompare(b.time));
  return [...map.entries()].sort(([dateA], [dateB]) => dateA.localeCompare(dateB));
}

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  const status = STATUS_META[appointment.status];

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="w-12 shrink-0 text-center text-sm font-bold text-foreground">{appointment.time}</div>

      <span className={`h-10 w-1 shrink-0 rounded-full ${status.bar}`} />

      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className="bg-status-purple-bg text-xs font-bold text-status-purple">
          {appointment.animal.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-foreground">
          {appointment.animal} <span className="font-normal text-muted-foreground">· {appointment.owner}</span>
        </div>
        <div className="truncate text-xs text-muted-foreground">{appointment.reason}</div>
      </div>

      <div className="hidden shrink-0 items-center gap-1.5 text-xs text-muted-foreground sm:flex">
        <HugeiconsIcon icon={StethoscopeIcon} className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
        {appointment.vet}
      </div>

      <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${status.bg} ${status.text}`}>
        <HugeiconsIcon icon={status.icon} className="h-3 w-3" strokeWidth={2.4} />
        {appointment.status}
      </span>
    </div>
  );
}

export function AppointmentsAgenda({ appointments }: { appointments: Appointment[] }) {
  if (appointments.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Aucun rendez-vous ne correspond à votre recherche.
      </div>
    );
  }

  const groups = groupByDate(appointments);
  const current = todayKey();

  return (
    <div className="flex flex-col gap-6 p-4">
      {groups.map(([date, dayAppointments]) => {
        const isToday = date === current;
        return (
          <div key={date} className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold text-foreground">{formatDayHeader(date)}</span>
              {isToday && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                  Aujourd&apos;hui
                </span>
              )}
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">
                {dayAppointments.length} rendez-vous
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {dayAppointments.map((appointment) => (
                <AppointmentRow key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

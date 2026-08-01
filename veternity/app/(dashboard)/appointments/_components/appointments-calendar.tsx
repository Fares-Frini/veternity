"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import type { Appointment } from "./data";
import { STATUS_META, toDateKey, todayKey as getTodayKey } from "./utils";

const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MAX_VISIBLE_PER_DAY = 3;

function buildMonthCells(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;

  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = leadingBlanks; i > 0; i--) {
    cells.push({ date: new Date(year, month, 1 - i), inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month, day), inMonth: true });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1].date;
    cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
  }
  return cells;
}

export function AppointmentsCalendar({ appointments }: { appointments: Appointment[] }) {
  const [cursor, setCursor] = useState(() => {
    const first = appointments[0];
    return first ? new Date(first.date) : new Date();
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const byDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const appointment of appointments) {
      const list = map.get(appointment.date) ?? [];
      list.push(appointment);
      map.set(appointment.date, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.time.localeCompare(b.time));
    return map;
  }, [appointments]);

  const cells = useMemo(() => buildMonthCells(year, month), [year, month]);

  const currentDayKey = getTodayKey();
  const monthLabel = cursor.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold text-foreground capitalize">{monthLabel}</span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCursor(new Date())}
          >
            Aujourd&apos;hui
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Mois précédent"
            onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" strokeWidth={2.2} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Mois suivant"
            onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" strokeWidth={2.2} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 overflow-hidden rounded-t-md border border-b-0 border-border">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="border-r border-border bg-muted px-2 py-1.5 text-center text-xs font-semibold text-muted-foreground last:border-r-0"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 rounded-b-md border border-border">
        {cells.map(({ date, inMonth }, i) => {
          const key = toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
          const dayAppointments = byDate.get(key) ?? [];
          const isToday = key === currentDayKey;

          return (
            <div
              key={key + i}
              className={`flex min-h-24 flex-col gap-1 border-r border-b border-border p-1.5 last:border-r-0 ${
                inMonth ? "bg-card" : "bg-muted/40"
              }`}
            >
              <span
                className={`w-fit rounded-full px-1.5 text-xs font-semibold ${
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : inMonth
                      ? "text-foreground"
                      : "text-muted-foreground/50"
                }`}
              >
                {date.getDate()}
              </span>

              <div className="flex flex-col gap-0.5">
                {dayAppointments.slice(0, MAX_VISIBLE_PER_DAY).map((appointment) => {
                  const status = STATUS_META[appointment.status];
                  return (
                    <div
                      key={appointment.id}
                      title={`${appointment.time} · ${appointment.animal} · ${appointment.reason}`}
                      className={`truncate rounded px-1.5 py-0.5 text-[11px] font-medium ${status.bg} ${status.text}`}
                    >
                      {appointment.time} {appointment.animal}
                    </div>
                  );
                })}
                {dayAppointments.length > MAX_VISIBLE_PER_DAY && (
                  <span className="px-1.5 text-[11px] font-medium text-muted-foreground">
                    +{dayAppointments.length - MAX_VISIBLE_PER_DAY} de plus
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

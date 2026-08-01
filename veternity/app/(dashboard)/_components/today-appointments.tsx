import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, PawIcon } from "@/components/layout/icons";
import { APPOINTMENTS, type AppointmentStatus } from "../appointments/_components/data";
import { todayKey } from "../appointments/_components/utils";

const BORDER_COLOR: Record<AppointmentStatus, string> = {
  "Confirmé": "border-status-info",
  "En attente": "border-status-warning",
  "Terminé": "border-primary",
  "Annulé": "border-status-danger",
};

const ROW_BG: Record<AppointmentStatus, string> = {
  "Confirmé": "bg-status-info-bg",
  "En attente": "bg-status-warning-bg",
  "Terminé": "bg-secondary",
  "Annulé": "bg-status-danger-bg",
};

const BADGE_VARIANT: Record<AppointmentStatus, "info" | "warning" | "teal" | "danger"> = {
  "Confirmé": "info",
  "En attente": "warning",
  "Terminé": "teal",
  "Annulé": "danger",
};

export function TodayAppointments() {
  const today = todayKey();
  const todays = APPOINTMENTS.filter((a) => a.date === today).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <Card className="rounded-none shadow-none ring-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
          <CalendarIcon className="h-4.5 w-4.5 text-status-info" strokeWidth={2.2} />
          Rendez-vous d&apos;aujourd&apos;hui
          <Badge variant="teal" className="ml-auto">
            {todays.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        {todays.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">Aucun rendez-vous prévu aujourd&apos;hui.</p>
        )}
        {todays.map((appt) => (
          <div
            key={appt.id}
            className={`flex items-center justify-between gap-3 rounded-md border-l-4 py-3 pr-4 pl-3.5 ${BORDER_COLOR[appt.status]} ${ROW_BG[appt.status]}`}
          >
            <div className="flex items-center gap-3">
              <PawIcon className="h-3.5 w-3.5 text-primary" strokeWidth={2.4} />
              <div>
                <div className="text-sm font-semibold text-foreground">
                  {appt.animal} — {appt.reason}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {appt.owner} · {appt.time} · {appt.vet}
                </div>
              </div>
            </div>
            <Badge variant={BADGE_VARIANT[appt.status]} className="shrink-0">
              {appt.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

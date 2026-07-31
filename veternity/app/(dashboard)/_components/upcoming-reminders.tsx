import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BellIcon, PawIcon } from "@/components/layout/icons";

const REMINDERS = [
  { pet: "Luna", reason: "Vaccination", owner: "Leila Mansouri", date: "2026-07-30", done: false },
  { pet: "Rex", reason: "Antiparasitaire", owner: "Karim Bouzidi", date: "2026-07-28", done: false },
  { pet: "Noisette", reason: "Vaccination myxomatose", owner: "Sara El Fassi", date: "2026-08-05", done: false },
  { pet: "Simba", reason: "Stérilisation suivi", owner: "Fatima Alaoui", date: "2026-08-12", done: true },
] as const;

export function UpcomingReminders() {
  return (
    <Card className="rounded-lg border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
          <BellIcon className="h-4.5 w-4.5 text-status-warning" strokeWidth={2.2} />
          Rappels à venir
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        {REMINDERS.map(({ pet, reason, owner, date, done }) => (
          <div
            key={pet + reason}
            className={`flex items-center justify-between gap-3 rounded-md border-l-4 py-3 pr-4 pl-3.5 ${
              done ? "border-border bg-muted" : "border-status-warning bg-status-warning-bg"
            }`}
          >
            <div className="flex items-center gap-3">
              <Checkbox checked={done} className="data-checked:border-primary data-checked:bg-primary" />
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <PawIcon className="h-3.5 w-3.5 text-primary" strokeWidth={2.4} />
                  {pet} — {reason}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {owner} · {date}
                </div>
              </div>
            </div>
            {!done && (
              <Badge variant="warning" className="shrink-0">
                À faire
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

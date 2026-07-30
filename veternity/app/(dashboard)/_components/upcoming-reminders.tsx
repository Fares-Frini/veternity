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
    <Card className="rounded-lg border-[#eef0f5] shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold text-[#1e2a4a]">
          <BellIcon className="h-4.5 w-4.5 text-[#f5920a]" strokeWidth={2.2} />
          Rappels à venir
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        {REMINDERS.map(({ pet, reason, owner, date, done }) => (
          <div
            key={pet + reason}
            className={`flex items-center justify-between gap-3 rounded-md border px-4 py-3 ${
              done ? "border-[#eef0f5] bg-[#f7f8fc]" : "border-[#ffe8bf] bg-[#fff8ea]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Checkbox checked={done} className="data-checked:border-[#00998e] data-checked:bg-[#00998e]" />
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1e2a4a]">
                  <PawIcon className="h-3.5 w-3.5 text-[#00998e]" strokeWidth={2.4} />
                  {pet} — {reason}
                </div>
                <div className="mt-0.5 text-xs text-[#7b88a8]">
                  {owner} · {date}
                </div>
              </div>
            </div>
            {!done && (
              <Badge className="shrink-0 bg-[#fdecc8] text-[#a8660a]" variant="secondary">
                À faire
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

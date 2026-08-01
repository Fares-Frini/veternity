import { StatCard } from "./stat-card";
import { QuickActionsBar } from "./quick-actions";
import { PAGE_THEMES } from "@/components/layout/page-theme";
import { CalendarIcon, PawIcon, UsersIcon } from "@/components/layout/icons";
import { ANIMALS } from "../animaux/_components/data";
import { CLIENTS } from "../clients/_components/data";
import { APPOINTMENTS } from "../appointments/_components/data";
import { todayKey } from "../appointments/_components/utils";

export function StatsRow() {
  const today = todayKey();
  const todayCount = APPOINTMENTS.filter((a) => a.date === today).length;

  const STATS = [
    { value: ANIMALS.length, label: "Total Animaux", icon: PawIcon, accent: PAGE_THEMES.animaux.accent },
    { value: CLIENTS.length, label: "Total Clients", icon: UsersIcon, accent: PAGE_THEMES.clients.accent },
    { value: todayCount, label: "RDV aujourd'hui", icon: CalendarIcon, accent: PAGE_THEMES.appointments.accent },
  ] as const;

  return (
    <div className="grid grid-cols-2 divide-x divide-border border-b border-border lg:grid-cols-4">
      {STATS.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
      <QuickActionsBar />
    </div>
  );
}

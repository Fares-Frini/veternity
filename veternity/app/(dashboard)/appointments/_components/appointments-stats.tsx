import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { CalendarIcon, type IconComponent } from "@/components/layout/icons";
import { PAGE_THEMES } from "@/components/layout/page-theme";
import { StatCard } from "../../_components/stat-card";
import type { Appointment } from "./data";
import { todayKey, toDateKey, weekRange } from "./utils";

const ClockIcon: IconComponent = (props) => <HugeiconsIcon icon={Clock01Icon} {...props} />;
const CancelIcon: IconComponent = (props) => <HugeiconsIcon icon={Cancel01Icon} {...props} />;

export function AppointmentsStats({ appointments }: { appointments: Appointment[] }) {
  const now = new Date();
  const todayCount = appointments.filter((a) => a.date === todayKey()).length;

  const { start, end } = weekRange(now);
  const startKey = toDateKey(start.getFullYear(), start.getMonth(), start.getDate());
  const endKey = toDateKey(end.getFullYear(), end.getMonth(), end.getDate());
  const weekCount = appointments.filter((a) => a.date >= startKey && a.date <= endKey).length;

  const pendingCount = appointments.filter((a) => a.status === "En attente").length;
  const cancelledCount = appointments.filter((a) => a.status === "Annulé").length;

  return (
    <div className="grid grid-cols-2 divide-x divide-border border-b border-border lg:grid-cols-4">
      <StatCard value={todayCount} label="Aujourd'hui" icon={CalendarIcon} accent={PAGE_THEMES.appointments.accent} />
      <StatCard value={weekCount} label="Cette semaine" icon={CalendarIcon} accent={PAGE_THEMES.appointments.accent} />
      <StatCard value={pendingCount} label="En attente" icon={ClockIcon} accent={PAGE_THEMES.appointments.accent} />
      <StatCard value={cancelledCount} label="Annulés" icon={CancelIcon} accent={PAGE_THEMES.appointments.accent} />
    </div>
  );
}

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Calendar01Icon, Calendar02Icon, Cancel01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import type { Appointment } from "./data";
import { todayKey, toDateKey, weekRange } from "./utils";

function StatCard({
  value,
  label,
  icon,
  iconBg,
  iconColor,
}: {
  value: number;
  label: string;
  icon: IconSvgElement;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${iconBg}`}>
        <HugeiconsIcon icon={icon} className={`h-5 w-5 ${iconColor}`} strokeWidth={2.2} />
      </div>
      <div>
        <div className="text-2xl font-extrabold text-foreground">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

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
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard value={todayCount} label="Aujourd'hui" icon={Calendar01Icon} iconBg="bg-secondary" iconColor="text-secondary-foreground" />
      <StatCard value={weekCount} label="Cette semaine" icon={Calendar02Icon} iconBg="bg-status-info-bg" iconColor="text-status-info" />
      <StatCard value={pendingCount} label="En attente" icon={Clock01Icon} iconBg="bg-status-warning-bg" iconColor="text-status-warning" />
      <StatCard value={cancelledCount} label="Annulés" icon={Cancel01Icon} iconBg="bg-status-danger-bg" iconColor="text-status-danger" />
    </div>
  );
}

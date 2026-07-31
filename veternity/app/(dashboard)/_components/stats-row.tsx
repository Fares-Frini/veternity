import { Bone02Icon, Calendar03Icon, Clock01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { StatCard } from "./stat-card";
import { ANIMALS } from "../animaux/_components/data";
import { CLIENTS } from "../clients/_components/data";
import { APPOINTMENTS } from "../appointments/_components/data";
import { todayKey } from "../appointments/_components/utils";

export function StatsRow() {
  const today = todayKey();
  const todayCount = APPOINTMENTS.filter((a) => a.date === today).length;
  const pendingCount = APPOINTMENTS.filter((a) => a.status === "En attente").length;

  const STATS = [
    { value: ANIMALS.length, label: "Total Animaux", icon: Bone02Icon, iconBg: "bg-secondary", iconColor: "text-secondary-foreground" },
    { value: CLIENTS.length, label: "Total Clients", icon: UserGroupIcon, iconBg: "bg-status-purple-bg", iconColor: "text-status-purple" },
    { value: todayCount, label: "RDV aujourd'hui", icon: Calendar03Icon, iconBg: "bg-status-info-bg", iconColor: "text-status-info" },
    { value: pendingCount, label: "RDV en attente", icon: Clock01Icon, iconBg: "bg-status-warning-bg", iconColor: "text-status-warning" },
  ] as const;

  return (
    <div className="grid grid-cols-2 divide-x divide-border border-b border-border lg:grid-cols-4">
      {STATS.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

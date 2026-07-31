import { Bone02Icon, Scissor01Icon, UserGroupIcon, VaccineIcon } from "@hugeicons/core-free-icons";
import { StatCard } from "../../_components/stat-card";

const STATS = [
  { value: 142, label: "Total Animaux", icon: Bone02Icon, iconBg: "bg-secondary", iconColor: "text-secondary-foreground" },
  { value: 76, label: "Propriétaires", icon: UserGroupIcon, iconBg: "bg-status-purple-bg", iconColor: "text-status-purple" },
  { value: 98, label: "Vaccinés", icon: VaccineIcon, iconBg: "bg-status-info-bg", iconColor: "text-status-info" },
  { value: 54, label: "Stérilisés", icon: Scissor01Icon, iconBg: "bg-status-warning-bg", iconColor: "text-status-warning" },
] as const;

export function AnimauxStats() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {STATS.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

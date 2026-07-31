import {
  AlertDiamondIcon,
  Bone02Icon,
  Calendar03Icon,
  Scissor01Icon,
  UserGroupIcon,
  VaccineIcon,
} from "@hugeicons/core-free-icons";
import { StatCard } from "./stat-card";

const STATS = [
  { value: 142, label: "Total Animaux", icon: Bone02Icon, iconBg: "bg-secondary", iconColor: "text-secondary-foreground" },
  { value: 89, label: "Total Clients", icon: UserGroupIcon, iconBg: "bg-status-purple-bg", iconColor: "text-status-purple" },
  { value: 98, label: "Vaccinés", icon: VaccineIcon, iconBg: "bg-status-info-bg", iconColor: "text-status-info" },
  { value: 54, label: "Stérilisés", icon: Scissor01Icon, iconBg: "bg-status-warning-bg", iconColor: "text-status-warning" },
  { value: 7, label: "RDV du jour", icon: Calendar03Icon, iconBg: "bg-status-success-bg", iconColor: "text-status-success" },
  { value: 3, label: "Stock faible", icon: AlertDiamondIcon, iconBg: "bg-status-danger-bg", iconColor: "text-status-danger" },
] as const;

export function StatsRow() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {STATS.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

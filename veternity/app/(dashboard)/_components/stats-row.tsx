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
  { value: 142, label: "Total Animaux", icon: Bone02Icon, iconBg: "bg-[#e3f5f2]", iconColor: "text-[#00998e]" },
  { value: 89, label: "Total Clients", icon: UserGroupIcon, iconBg: "bg-[#f1eafe]", iconColor: "text-[#7c5cf0]" },
  { value: 98, label: "Vaccinés", icon: VaccineIcon, iconBg: "bg-[#e8f1ff]", iconColor: "text-[#3b82f6]" },
  { value: 54, label: "Stérilisés", icon: Scissor01Icon, iconBg: "bg-[#fff1e0]", iconColor: "text-[#f5920a]" },
  { value: 7, label: "RDV du jour", icon: Calendar03Icon, iconBg: "bg-[#e8f8ec]", iconColor: "text-[#16a34a]" },
  { value: 3, label: "Stock faible", icon: AlertDiamondIcon, iconBg: "bg-[#fde8ea]", iconColor: "text-[#e11d48]" },
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

import { Bone02Icon, Scissor01Icon, UserGroupIcon, VaccineIcon } from "@hugeicons/core-free-icons";
import { StatCard } from "../../_components/stat-card";

const STATS = [
  { value: 142, label: "Total Animaux", icon: Bone02Icon, iconBg: "bg-[#e3f5f2]", iconColor: "text-[#00998e]" },
  { value: 76, label: "Propriétaires", icon: UserGroupIcon, iconBg: "bg-[#f1eafe]", iconColor: "text-[#7c5cf0]" },
  { value: 98, label: "Vaccinés", icon: VaccineIcon, iconBg: "bg-[#e8f1ff]", iconColor: "text-[#3b82f6]" },
  { value: 54, label: "Stérilisés", icon: Scissor01Icon, iconBg: "bg-[#fff1e0]", iconColor: "text-[#f5920a]" },
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

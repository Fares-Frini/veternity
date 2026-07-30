import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

interface StatCardProps {
  value: string | number;
  label: string;
  icon: IconSvgElement;
  iconBg: string;
  iconColor: string;
}

export function StatCard({ value, label, icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#eef0f5] bg-white p-5 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-md ${iconBg}`}>
        <HugeiconsIcon icon={icon} className={`h-5 w-5 ${iconColor}`} strokeWidth={2.2} />
      </div>
      <div>
        <div className="text-2xl font-extrabold text-[#1e2a4a]">{value}</div>
        <div className="text-sm text-[#7b88a8]">{label}</div>
      </div>
    </div>
  );
}

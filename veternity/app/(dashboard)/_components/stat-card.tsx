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
    <div className="flex flex-col gap-3 p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-md ${iconBg}`}>
        <HugeiconsIcon icon={icon} className={`h-5 w-5 ${iconColor}`} strokeWidth={2.2} />
      </div>
      <div>
        <div className="text-2xl font-extrabold text-foreground">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

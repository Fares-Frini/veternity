import type { IconComponent } from "@/components/layout/icons";

interface StatCardProps {
  value: string | number;
  label: string;
  icon: IconComponent;
  accent: string;
}

export function StatCard({ value, label, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 p-5">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-md"
        style={{ backgroundColor: `color-mix(in srgb, ${accent} 16%, white)` }}
      >
        <Icon className="h-5 w-5" style={{ color: accent }} strokeWidth={2.2} />
      </div>
      <div>
        <div className="text-2xl font-extrabold text-foreground">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

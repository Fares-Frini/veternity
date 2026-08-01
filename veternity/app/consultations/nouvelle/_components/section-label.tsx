import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import type { IconComponent } from "@/components/layout/icons";

export function SectionLabel({
  icon,
  title,
  hint,
}: {
  icon: IconSvgElement | IconComponent;
  title: string;
  hint: string;
}) {
  const CustomIcon = typeof icon === "function" ? icon : null;
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-card text-muted-foreground shadow-sm">
        {CustomIcon ? (
          <CustomIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
        ) : (
          <HugeiconsIcon icon={icon as IconSvgElement} className="h-3.5 w-3.5" strokeWidth={2.2} />
        )}
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-bold text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
    </div>
  );
}

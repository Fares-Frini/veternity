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
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {CustomIcon ? (
          <CustomIcon className="h-4 w-4" strokeWidth={2.2} />
        ) : (
          <HugeiconsIcon icon={icon as IconSvgElement} className="h-4 w-4" strokeWidth={2.2} />
        )}
      </span>
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="text-sm font-bold text-foreground">{title}</span>
        <span className="truncate text-xs text-muted-foreground">{hint}</span>
      </div>
    </div>
  );
}

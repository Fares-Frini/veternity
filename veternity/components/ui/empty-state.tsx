import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description = "Bientôt disponible",
  className,
}: {
  icon: IconSvgElement;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/40 py-20 text-center",
        className
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-primary/30 bg-secondary text-primary">
        <HugeiconsIcon icon={icon} className="h-6 w-6" strokeWidth={2} />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

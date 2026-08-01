import { Badge } from "@/components/ui/badge";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

export function ClinicalNote({
  icon,
  title,
  meta,
  status,
  statusClassName,
  headerAction,
  children,
}: {
  icon: IconSvgElement;
  title: string;
  meta?: string;
  status?: string;
  statusClassName?: string;
  headerAction?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-card text-muted-foreground shadow-sm">
            <HugeiconsIcon icon={icon} className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="text-sm font-bold text-foreground">{title}</span>
            {meta && <span className="truncate text-xs text-muted-foreground">{meta}</span>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {headerAction}
          {status && <Badge className={statusClassName}>{status}</Badge>}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col border-l-4 border-l-primary/30 p-4">{children}</div>
    </div>
  );
}

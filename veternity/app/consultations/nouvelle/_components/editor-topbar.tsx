import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

export function EditorTopbar({
  title,
  subtitle,
  backHref,
}: {
  title: string;
  subtitle?: string;
  backHref: string;
}) {
  return (
    <div className="flex h-14 shrink-0 items-center gap-3 bg-primary px-4 text-primary-foreground">
      <Link
        href={backHref}
        aria-label="Retour"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-primary-foreground/15"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" strokeWidth={2.2} />
      </Link>
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-sm font-bold">{title}</span>
        {subtitle && <span className="truncate text-xs text-primary-foreground/75">{subtitle}</span>}
      </div>
    </div>
  );
}

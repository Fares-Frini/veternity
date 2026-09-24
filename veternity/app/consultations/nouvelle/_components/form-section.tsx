import type { IconComponent } from "@/components/layout/icons";
import type { IconSvgElement } from "@hugeicons/react";
import type { ReactNode } from "react";
import { SectionLabel } from "./section-label";

/** Carte de saisie de la colonne centrale. `@container` permet aux grilles internes de s'adapter à sa largeur. */
export function FormSection({
  icon,
  title,
  hint,
  action,
  children,
}: {
  icon: IconSvgElement | IconComponent;
  title: string;
  hint: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="@container flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <SectionLabel icon={icon} title={title} hint={hint} />
        {action}
      </div>
      {children}
    </section>
  );
}

/** Libellé de donnée en petites capitales, comme sur la fiche animal. */
export function DataLabel({ children }: { children: ReactNode }) {
  return <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{children}</span>;
}

/** Bloc de lecture : libellé + contenu. */
export function DetailBlock({ label, aside, children }: { label: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <DataLabel>{label}</DataLabel>
        {aside}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

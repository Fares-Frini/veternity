import type { ReactNode } from "react";
import { DataLabel } from "./form-section";

/**
 * Poste de travail en trois zones :
 * gauche = le patient et son dossier, centre = la saisie, droite = le récapitulatif et l'action principale.
 */
export function Workspace({ left, right, children }: { left: ReactNode; right: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:grid lg:grid-cols-[300px_minmax(0,1fr)_300px] lg:overflow-hidden 2xl:grid-cols-[340px_minmax(0,1fr)_360px]">
      <aside className="flex flex-col border-b border-border bg-card lg:min-h-0 lg:overflow-y-auto lg:border-r lg:border-b-0 lg:pb-24">
        {left}
      </aside>
      <main className="lg:min-h-0 lg:overflow-y-auto">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-6 lg:px-8">{children}</div>
      </main>
      <aside className="flex flex-col border-t border-border bg-card lg:min-h-0 lg:border-t-0 lg:border-l">{right}</aside>
    </div>
  );
}

export function SummaryRail({ title, children, footer }: { title: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border px-5 py-4">
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 py-5">{children}</div>
      <div className="flex shrink-0 flex-col gap-3 border-t border-border px-5 py-4">{footer}</div>
    </div>
  );
}

export function RailSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <DataLabel>{label}</DataLabel>
      {children}
    </section>
  );
}

export function RailRow({ label, value, muted }: { label: ReactNode; value: ReactNode; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className={muted ? "text-muted-foreground" : "text-foreground"}>{label}</span>
      <span className="shrink-0 text-foreground tabular-nums">{value}</span>
    </div>
  );
}

export function RailTotal({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {detail && <span className="text-xs text-muted-foreground">{detail}</span>}
      </div>
      <span className="text-2xl font-extrabold text-foreground tabular-nums">{value}</span>
    </div>
  );
}

/** En-tête d'une section de la colonne gauche. */
export function RailHeading({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-sm font-bold text-foreground">{children}</h2>
      {aside}
    </div>
  );
}

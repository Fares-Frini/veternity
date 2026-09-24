import Image from "next/image";
import type { ReactNode } from "react";

export function formatDocDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/** Feuille A4 : même typographie et mêmes couleurs que l'application, sans aucun élément d'interface. */
export function DocSheet({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex w-full max-w-[182mm] flex-col gap-8 text-[13px] leading-relaxed text-foreground">{children}</div>;
}

export function DocHeader({ title, reference, date }: { title: string; reference: string; date: string }) {
  return (
    <header className="flex items-start justify-between gap-6 border-b-2 border-primary pb-5">
      <div className="flex items-center gap-3">
        <Image src="/logos/logo_color.png" alt="" width={40} height={40} unoptimized loading="eager" className="rounded-sm" />
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-extrabold tracking-tight">Veternity</span>
          <span className="text-xs text-muted-foreground">Clinique vétérinaire</span>
        </div>
      </div>
      <div className="flex flex-col items-end leading-tight">
        <span className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">{title}</span>
        <span className="mt-1 font-mono text-lg font-bold">{reference}</span>
        <span className="mt-0.5 text-xs text-muted-foreground">{formatDocDate(date)}</span>
      </div>
    </header>
  );
}

export function DocLabel({ children }: { children: ReactNode }) {
  return <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">{children}</span>;
}

export function DocParty({ label, name, lines }: { label: string; name: string; lines: (string | undefined)[] }) {
  return (
    <div className="flex flex-col gap-0.5">
      <DocLabel>{label}</DocLabel>
      <span className="mt-1 font-semibold">{name}</span>
      {lines.filter(Boolean).map((line) => (
        <span key={line} className="text-muted-foreground">
          {line}
        </span>
      ))}
    </div>
  );
}

export function DocFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="mt-4 border-t border-border pt-3 text-center text-[11px] text-muted-foreground">{children}</footer>
  );
}

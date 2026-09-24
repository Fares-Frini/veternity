"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ArrowDown01Icon, ArrowUp01Icon, ArrowUpDownIcon, Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

/* ------------------------------------------------------------- Formatage --- */

/** Montant en DH : entier tel quel, centimes seulement s'il y en a. */
export function formatAmount(value: number) {
  const decimals = Number.isInteger(Math.round(value * 100) / 100) ? 0 : 2;
  return `${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: 2 }).format(value)} DH`;
}

export function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatLongDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/* ------------------------------------------------------------------ KPIs --- */

/** Bandeau d'indicateurs ; une tuile avec `onClick` sert aussi de filtre. */
export function KpiStrip({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4">
      {children}
    </div>
  );
}

export function KpiTile({
  label,
  value,
  detail,
  tone = "default",
  active,
  onClick,
}: {
  label: string;
  value: string | number;
  detail?: string;
  tone?: "default" | "warning" | "danger";
  active?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-2xl font-extrabold tabular-nums",
          tone === "warning" && "text-status-warning",
          tone === "danger" && "text-status-danger",
          tone === "default" && "text-foreground",
        )}
      >
        {value}
      </span>
      {detail && <span className="text-xs text-muted-foreground">{detail}</span>}
    </>
  );
  const className = cn(
    "relative flex flex-col gap-1 bg-card px-5 py-4 text-left",
    active && "bg-primary/8 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary",
  );

  if (!onClick) return <div className={className}>{content}</div>;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(className, "outline-none transition-colors hover:bg-muted focus-visible:bg-muted")}
    >
      {content}
    </button>
  );
}

/* --------------------------------------------------------------- Barre --- */

export function SearchField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full max-w-sm">
      <HugeiconsIcon
        icon={Search01Icon}
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        strokeWidth={2}
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 rounded-full border-border bg-muted pl-9 text-sm"
      />
    </div>
  );
}

/** Filtre actif, retirable. */
export function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary/12 pr-1.5 pl-3 text-xs font-semibold text-foreground">
      {label}
      <button
        type="button"
        onClick={onClear}
        aria-label={`Retirer le filtre ${label}`}
        className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-primary/20"
      >
        <HugeiconsIcon icon={Cancel01Icon} className="h-3 w-3" strokeWidth={2.4} />
      </button>
    </span>
  );
}

/* ------------------------------------------------------------------ Tri --- */

export type SortDirection = "asc" | "desc";

export function SortableHead({
  label,
  active,
  direction,
  onClick,
  align = "left",
}: {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
  align?: "left" | "right";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:text-foreground",
        active ? "text-foreground" : "text-muted-foreground",
        align === "right" && "flex-row-reverse",
      )}
    >
      {label}
      <HugeiconsIcon
        icon={active ? (direction === "asc" ? ArrowUp01Icon : ArrowDown01Icon) : ArrowUpDownIcon}
        className={cn("h-3.5 w-3.5", !active && "opacity-50")}
        strokeWidth={2}
      />
    </button>
  );
}

/* ------------------------------------------------------------- Pagination --- */

function pageNumbers(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push(null);
    result.push(p);
  });
  return result;
}

export function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  sizes = [10, 20, 50],
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sizes?: number[];
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Lignes par page</span>
        <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
          <SelectTrigger className="h-8 w-[70px] border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sizes.map((s) => (
              <SelectItem key={s} value={String(s)}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="hidden tabular-nums sm:inline">
          {start}–{end} sur {total}
        </span>
      </div>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) onPageChange(page - 1);
              }}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {pageNumbers(page, totalPages).map((n, i) =>
            n === null ? (
              <PaginationItem key={`e${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={n}>
                <PaginationLink
                  href="#"
                  isActive={n === page}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(n);
                  }}
                  className={n === page ? "border-primary text-primary" : ""}
                >
                  {n}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) onPageChange(page + 1);
              }}
              className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

/* ---------------------------------------------------------------- Dialogs --- */

/** En-tête de dialog de détail, identique aux dialogs client et consultation. */
export function DetailHeader({
  leading,
  title,
  subtitle,
  aside,
  onClose,
}: {
  leading?: ReactNode;
  title: string;
  subtitle?: string;
  aside?: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="relative flex shrink-0 items-center gap-3 bg-primary py-4 pr-14 pl-6 text-primary-foreground">
      {leading}
      <DialogHeader className="min-w-0 flex-1 gap-0.5">
        <DialogTitle className="truncate text-sm font-bold text-primary-foreground">{title}</DialogTitle>
        {subtitle && (
          <DialogDescription className="truncate text-xs text-primary-foreground/75">{subtitle}</DialogDescription>
        )}
      </DialogHeader>
      {aside}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-1/2 right-4 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-primary-foreground/15 transition-colors hover:bg-primary-foreground/25"
      >
        <HugeiconsIcon icon={Cancel01Icon} className="h-3.5 w-3.5" strokeWidth={2.4} />
        <span className="sr-only">Fermer</span>
      </button>
    </div>
  );
}

export function Fact({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5", className)}>
      <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
      <span className="text-sm font-semibold text-foreground">{children}</span>
    </div>
  );
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h3 className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{children}</h3>
      {aside}
    </div>
  );
}

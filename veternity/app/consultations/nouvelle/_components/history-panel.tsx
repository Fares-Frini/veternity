"use client";

import type { Animal } from "@/app/(dashboard)/animaux/_components/data";
import { formatMoney } from "@/app/(dashboard)/_components/bilan-data";
import { CONSULTATIONS, type Consultation } from "@/app/(dashboard)/consultations/(tabs)/liste/_components/data";
import { STATUS_META } from "@/app/(dashboard)/consultations/(tabs)/liste/_components/utils";
import { ConsultationRecord } from "@/app/(dashboard)/consultations/(tabs)/liste/_components/consultation-record";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { ArrowLeft01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { formatNumber } from "./catalog";
import { RailHeading } from "./workspace";

function formatLongDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function ConsultationDetail({
  consultation,
  showAnimal,
  onBack,
}: {
  consultation: Consultation;
  showAnimal: boolean;
  onBack: () => void;
}) {
  const status = STATUS_META[consultation.status];

  return (
    <div className="flex flex-col gap-4 p-4">
      <button
        type="button"
        onClick={onBack}
        className="-ml-1 flex w-fit items-center gap-1 rounded-md px-1 py-0.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" strokeWidth={2.2} />
        Historique
      </button>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base leading-snug font-extrabold text-foreground">{formatLongDate(consultation.date)}</h3>
          <Badge className={`shrink-0 ${status.bg} ${status.text}`}>{consultation.status}</Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {showAnimal && `${consultation.animal} · `}
          {consultation.vet} · {formatNumber(consultation.weightKg, 2)} kg · #{consultation.id}
        </span>
      </div>

      <ConsultationRecord consultation={consultation} />
    </div>
  );
}

function TimelineItem({
  consultation,
  showAnimal,
  isLast,
  onOpen,
}: {
  consultation: Consultation;
  showAnimal: boolean;
  isLast: boolean;
  onOpen: () => void;
}) {
  const status = STATUS_META[consultation.status];
  const date = new Date(consultation.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  return (
    <li className="relative pl-5">
      {!isLast && <span aria-hidden className="absolute top-3.5 bottom-0 left-[3px] w-px bg-border" />}
      <span aria-hidden className="absolute top-2.5 left-0 h-[7px] w-[7px] rounded-full bg-primary" />
      <button
        type="button"
        onClick={onOpen}
        className="-mr-2 mb-1 flex w-[calc(100%+0.5rem)] flex-col gap-1 rounded-lg py-1.5 pr-2 pl-1 text-left outline-none hover:bg-muted focus-visible:bg-muted"
      >
        <span className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="tabular-nums">{date}</span>
          <span className={cn("font-medium", status.text)}>{consultation.status}</span>
        </span>
        <span className="line-clamp-2 text-sm font-semibold text-foreground">{consultation.diagnostic}</span>
        <span className="truncate text-xs text-muted-foreground">
          {showAnimal ? `${consultation.animal} · ${consultation.owner}` : consultation.vet}
          {consultation.total !== undefined && ` · ${formatMoney(consultation.total)}`}
        </span>
      </button>
    </li>
  );
}

export function HistoryPanel({ animal, excludeId }: { animal: Animal; excludeId?: string | null }) {
  const [scope, setScope] = useState<"patient" | "all">("patient");
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Consultation | null>(null);
  const patientOnly = scope === "patient";

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CONSULTATIONS.filter((c) => c.id !== excludeId)
      .filter((c) => !patientOnly || c.animal.toLowerCase() === animal.name.toLowerCase())
      .filter((c) => !q || `${c.animal} ${c.owner} ${c.diagnostic} ${c.motif ?? ""} ${c.vet}`.toLowerCase().includes(q))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [animal, excludeId, patientOnly, search]);

  if (viewing) {
    return <ConsultationDetail consultation={viewing} showAnimal={!patientOnly} onBack={() => setViewing(null)} />;
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 flex flex-col gap-3 bg-card px-4 pt-4 pb-3">
        <RailHeading
          aside={
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              spacing={0}
              value={scope}
              onValueChange={(v) => v && setScope(v as "patient" | "all")}
              aria-label="Portée de l'historique"
            >
              <ToggleGroupItem value="patient" className="px-2.5 data-[state=on]:bg-primary/12 data-[state=on]:font-semibold">
                {animal.name}
              </ToggleGroupItem>
              <ToggleGroupItem value="all" className="px-2.5 data-[state=on]:bg-primary/12 data-[state=on]:font-semibold">
                Tous
              </ToggleGroupItem>
            </ToggleGroup>
          }
        >
          Historique <span className="font-normal text-muted-foreground tabular-nums">· {list.length}</span>
        </RailHeading>
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={2}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrer l'historique…"
            aria-label="Rechercher dans l'historique"
            className="h-9 bg-muted pl-9 text-sm"
          />
        </div>
      </div>

      {list.length === 0 ? (
        <p className="mx-4 rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          {patientOnly && !search ? `Première visite de ${animal.name}.` : "Aucun résultat."}
        </p>
      ) : (
        <ol className="px-4 pt-1">
          {list.map((c, i) => (
            <TimelineItem
              key={c.id}
              consultation={c}
              showAnimal={!patientOnly}
              isLast={i === list.length - 1}
              onOpen={() => setViewing(c)}
            />
          ))}
        </ol>
      )}
    </div>
  );
}

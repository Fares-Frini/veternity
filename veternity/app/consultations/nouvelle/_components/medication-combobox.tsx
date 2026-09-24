"use client";

import { formatMoney } from "@/app/(dashboard)/_components/bilan-data";
import { STOCK, formatQuantity } from "@/app/(dashboard)/inventory/_components/stock-data";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Medicine02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { availableStock, useConsultationDraft } from "./draft-context";

const DISPENSABLE = STOCK.filter((s) => s.category === "Médicament" || s.category === "Antiparasitaire");

/** Saisie libre d'un médicament, avec suggestions tirées du stock de la clinique. */
export function MedicationCombobox({
  id,
  name,
  productId,
  onChange,
}: {
  id: string;
  name: string;
  productId?: string;
  onChange: (name: string, productId?: string) => void;
}) {
  const { draft } = useConsultationDraft();
  const [open, setOpen] = useState(false);

  const q = name.trim().toLowerCase();
  const suggestions = DISPENSABLE.filter((s) => !q || s.name.toLowerCase().includes(q));
  const showPopover = open && suggestions.length > 0 && !productId;

  return (
    <Popover open={showPopover} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative">
          <HugeiconsIcon
            icon={Medicine02Icon}
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={2}
          />
          <Input
            id={id}
            value={name}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Ex : Amoxicilline 250mg"
            autoComplete="off"
            className="h-10 bg-muted pr-24 pl-9 font-medium"
          />
          {productId && (
            <Badge variant="secondary" className="absolute top-1/2 right-2.5 -translate-y-1/2">
              En stock
            </Badge>
          )}
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-64 w-(--radix-popover-trigger-width) overflow-y-auto p-1"
      >
        <span className="block px-2.5 pt-1.5 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Disponible à la clinique
        </span>
        {suggestions.map((s) => {
          const available = availableStock(s.id, draft);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                onChange(s.name, s.id);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left outline-none hover:bg-muted focus-visible:bg-muted"
            >
              <span className="truncate text-sm font-medium text-foreground">{s.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {available > 0 ? formatQuantity(s, available) : "Rupture"} · {formatMoney(s.unitPrice)}
              </span>
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

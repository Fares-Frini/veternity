"use client";

import { ANIMALS, type Animal } from "@/app/(dashboard)/animaux/_components/data";
import { SPECIES_COLOR } from "@/app/(dashboard)/animaux/_components/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { RailHeading } from "./workspace";

/** Choix du patient, directement dans la colonne gauche : recherche + liste. */
export function PatientPicker({ onSelect }: { onSelect: (animal: Animal) => void }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results = q
    ? ANIMALS.filter((a) => `${a.name} ${a.owner} ${a.species} ${a.breed}`.toLowerCase().includes(q))
    : ANIMALS;

  return (
    <>
      <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border bg-card p-4">
        <RailHeading>Choisir le patient</RailHeading>
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={2}
          />
          <Input
            id="consultation-patient"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) {
                e.preventDefault();
                onSelect(results[0]);
              }
            }}
            placeholder="Animal ou propriétaire…"
            aria-label="Rechercher un patient"
            autoComplete="off"
            className="h-10 bg-muted pl-9"
          />
        </div>
      </div>

      <div className="flex flex-col gap-0.5 p-2">
        {results.length === 0 && <p className="px-3 py-6 text-center text-sm text-muted-foreground">Aucun patient trouvé</p>}
        {results.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(a)}
            className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-left outline-none hover:bg-muted focus-visible:bg-muted"
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className={`text-[11px] font-bold ${SPECIES_COLOR[a.species] ?? "bg-muted"}`}>
                {a.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate text-sm font-medium text-foreground">{a.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {a.species} · {a.owner}
              </span>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

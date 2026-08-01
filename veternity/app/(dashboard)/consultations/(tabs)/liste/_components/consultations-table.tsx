import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SPECIES_COLOR, SPECIES_ICON } from "../../../../animaux/_components/utils";
import type { Consultation } from "./data";
import { STATUS_META, formatDate } from "./utils";

export function ConsultationsTable({ consultations }: { consultations: Consultation[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="pl-5 text-muted-foreground">Animal</TableHead>
          <TableHead className="text-muted-foreground">Propriétaire</TableHead>
          <TableHead className="text-muted-foreground">Vétérinaire</TableHead>
          <TableHead className="text-muted-foreground">Date</TableHead>
          <TableHead className="text-muted-foreground">Diagnostic</TableHead>
          <TableHead className="pr-5 text-muted-foreground">Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {consultations.map((c) => {
          const speciesClasses = SPECIES_COLOR[c.species] ?? "bg-muted text-muted-foreground";
          const speciesIcon = SPECIES_ICON[c.species];
          const status = STATUS_META[c.status];
          return (
            <TableRow key={c.id} className="border-border">
              <TableCell className="pl-5">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`text-xs font-bold ${speciesClasses}`}>
                      {c.animal.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-foreground">{c.animal}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {speciesIcon && <HugeiconsIcon icon={speciesIcon} className="h-3 w-3" strokeWidth={2.2} />}
                      {c.species}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-foreground">{c.owner}</TableCell>
              <TableCell className="text-foreground">{c.vet}</TableCell>
              <TableCell className="text-foreground">{formatDate(c.date)}</TableCell>
              <TableCell className="max-w-56 truncate text-foreground">{c.diagnostic}</TableCell>
              <TableCell className="pr-5">
                <Badge className={`${status.bg} ${status.text}`}>{c.status}</Badge>
              </TableCell>
            </TableRow>
          );
        })}
        {consultations.length === 0 && (
          <TableRow className="border-border hover:bg-transparent">
            <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
              Aucune consultation ne correspond à votre recherche.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

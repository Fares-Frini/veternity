import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SPECIES_COLOR, SPECIES_ICON } from "../../../../animaux/_components/utils";
import type { Prescription } from "./data";
import { formatDate } from "./utils";

export function PrescriptionsTable({ prescriptions }: { prescriptions: Prescription[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="pl-5 text-muted-foreground">Animal</TableHead>
          <TableHead className="text-muted-foreground">Propriétaire</TableHead>
          <TableHead className="text-muted-foreground">Médicaments</TableHead>
          <TableHead className="text-muted-foreground">Posologie</TableHead>
          <TableHead className="text-muted-foreground">Date</TableHead>
          <TableHead className="pr-5 text-muted-foreground">Vétérinaire</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prescriptions.map((p) => {
          const speciesClasses = SPECIES_COLOR[p.species] ?? "bg-muted text-muted-foreground";
          const speciesIcon = SPECIES_ICON[p.species];
          return (
            <TableRow key={p.id} className="border-border">
              <TableCell className="pl-5">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`text-xs font-bold ${speciesClasses}`}>
                      {p.animal.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-foreground">{p.animal}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {speciesIcon && <HugeiconsIcon icon={speciesIcon} className="h-3 w-3" strokeWidth={2.2} />}
                      {p.species}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-foreground">{p.owner}</TableCell>
              <TableCell className="max-w-48 truncate font-medium text-foreground">{p.medications}</TableCell>
              <TableCell className="max-w-64 truncate text-foreground">{p.posology}</TableCell>
              <TableCell className="text-foreground">{formatDate(p.date)}</TableCell>
              <TableCell className="pr-5 text-foreground">{p.vet}</TableCell>
            </TableRow>
          );
        })}
        {prescriptions.length === 0 && (
          <TableRow className="border-border hover:bg-transparent">
            <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
              Aucune prescription ne correspond à votre recherche.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

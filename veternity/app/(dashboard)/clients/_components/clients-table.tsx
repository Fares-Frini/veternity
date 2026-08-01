import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, MapPinIcon, SmartPhone01Icon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PawIcon } from "@/components/layout/icons";
import type { Client } from "./data";

export function ClientsTable({ clients }: { clients: Client[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="pl-5 text-muted-foreground">ID</TableHead>
          <TableHead className="text-muted-foreground">Client</TableHead>
          <TableHead className="text-muted-foreground">Téléphone</TableHead>
          <TableHead className="text-muted-foreground">Email</TableHead>
          <TableHead className="text-muted-foreground">Adresse</TableHead>
          <TableHead className="pr-5 text-muted-foreground">Animaux</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id} className="border-border">
            <TableCell className="pl-5 font-mono text-xs text-muted-foreground">#{client.id}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/12 text-xs font-bold text-primary">
                    {client.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-foreground">{client.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-foreground">
                <HugeiconsIcon icon={SmartPhone01Icon} className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
                {client.phone}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-foreground">
                <HugeiconsIcon icon={Mail01Icon} className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
                {client.email}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-foreground">
                <HugeiconsIcon icon={MapPinIcon} className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
                {client.address}
              </div>
            </TableCell>
            <TableCell className="pr-5">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-1 text-xs font-semibold text-primary">
                <PawIcon className="h-3 w-3" />
                {client.animalsCount}
              </span>
            </TableCell>
          </TableRow>
        ))}
        {clients.length === 0 && (
          <TableRow className="border-border hover:bg-transparent">
            <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
              Aucun client ne correspond à votre recherche.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

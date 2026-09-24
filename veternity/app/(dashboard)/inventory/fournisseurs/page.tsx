"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useInventoryVersion } from "../_components/inventory-store";
import { KpiStrip, KpiTile, SearchField, formatAmount, formatShortDate } from "../_components/inventory-ui";
import { SUPPLIERS, type Supplier } from "../_components/suppliers-data";
import { SupplierDialog } from "./_components/supplier-dialog";
import { supplierMetrics } from "./_components/supplier-metrics";

export default function FournisseursPage() {
  useInventoryVersion();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Supplier | null>(null);

  const rows = SUPPLIERS.map((s) => ({ supplier: s, metrics: supplierMetrics(s.id) }));
  const q = search.trim().toLowerCase();
  const shown = rows.filter(
    ({ supplier: s }) => !q || `${s.name} ${s.kind} ${s.city} ${s.contact} ${s.email}`.toLowerCase().includes(q),
  );

  const yearTotal = rows.reduce((sum, r) => sum + r.metrics.yearTotal, 0);
  const due = rows.reduce((sum, r) => sum + r.metrics.due, 0);
  const openOrders = rows.reduce((sum, r) => sum + r.metrics.openOrders, 0);

  return (
    <div className="flex flex-col gap-5">
      <KpiStrip>
        <KpiTile label="Fournisseurs actifs" value={SUPPLIERS.length} detail="Grossistes, laboratoires et consommables" />
        <KpiTile label="Achats sur 12 mois" value={formatAmount(yearTotal)} detail="Toutes commandes confondues" />
        <KpiTile label="Reste à régler" value={formatAmount(due)} detail="Livraisons reçues non payées" tone={due ? "warning" : "default"} />
        <KpiTile label="Commandes en cours" value={openOrders} detail="En attente de livraison" />
      </KpiStrip>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <SearchField value={search} onChange={setSearch} placeholder="Rechercher un fournisseur, une ville, un contact…" />
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="pl-5 text-muted-foreground">Fournisseur</TableHead>
              <TableHead className="text-muted-foreground">Contact</TableHead>
              <TableHead className="text-muted-foreground">Produits</TableHead>
              <TableHead className="text-muted-foreground">Conditions</TableHead>
              <TableHead className="text-muted-foreground">Dernière commande</TableHead>
              <TableHead className="text-right text-muted-foreground">Achats 12 mois</TableHead>
              <TableHead className="pr-5 text-right text-muted-foreground">À régler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map(({ supplier: s, metrics: m }) => (
              <TableRow
                key={s.id}
                tabIndex={0}
                onClick={() => setSelected(s)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(s);
                  }
                }}
                className="cursor-pointer border-border outline-none focus-visible:bg-muted"
              >
                <TableCell className="py-3 pl-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/12 text-xs font-bold text-foreground">
                        {s.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      <span className="font-semibold text-foreground">{s.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {s.kind} · {s.city}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col leading-tight">
                    <span className="text-foreground">{s.contact}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{s.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col leading-tight">
                    <span className="text-foreground tabular-nums">{m.productCount} références</span>
                    {m.toReorder > 0 ? (
                      <span className="text-xs font-medium text-status-warning">{m.toReorder} à réapprovisionner</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Stock suffisant</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {s.leadTimeDays} j · paiement {s.paymentTermsDays} j
                </TableCell>
                <TableCell>
                  <div className="flex flex-col leading-tight">
                    <span className="text-foreground tabular-nums">{m.lastOrder ? formatShortDate(m.lastOrder) : "—"}</span>
                    {m.openOrders > 0 && (
                      <span className="text-xs text-status-info">
                        {m.openOrders} en cours de livraison
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold text-foreground tabular-nums">{formatAmount(m.yearTotal)}</TableCell>
                <TableCell className="pr-5 text-right tabular-nums">
                  {m.due > 0 ? <span className="font-semibold text-status-warning">{formatAmount(m.due)}</span> : <span className="text-muted-foreground">—</span>}
                </TableCell>
              </TableRow>
            ))}
            {shown.length === 0 && (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  Aucun fournisseur ne correspond à votre recherche.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <SupplierDialog supplier={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

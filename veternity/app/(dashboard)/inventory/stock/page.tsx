"use client";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ShoppingCartAdd01Icon, Upload04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import { FilterChip, KpiStrip, KpiTile, SearchField, TablePagination, formatAmount, type SortDirection } from "../_components/inventory-ui";
import { useInventoryVersion } from "../_components/inventory-store";
import {
  EXPIRY_WARNING_DAYS,
  STOCK,
  STOCK_CATEGORIES,
  daysUntil,
  nearestExpiry,
  stockStatus,
  type StockCategory,
  type StockItem,
  type StockStatus,
} from "../_components/stock-data";
import { ProductDialog } from "./_components/product-dialog";
import { StockTable, type StockSortKey } from "./_components/stock-table";

type Attention = "reorder" | "rupture" | "expiry";

const ATTENTION_LABEL: Record<Attention, string> = {
  reorder: "À réapprovisionner",
  rupture: "En rupture",
  expiry: `Péremption ≤ ${EXPIRY_WARNING_DAYS} j`,
};

const CATEGORY_LABEL: Record<StockCategory, string> = {
  Vaccin: "Vaccins",
  Antiparasitaire: "Antiparasitaires",
  Injectable: "Injectables",
  Médicament: "Médicaments",
  Consommable: "Consommables",
};

const STATUS_RANK: Record<StockStatus, number> = {
  Rupture: 0,
  "Lot périmé": 1,
  "Stock bas": 2,
  "Péremption proche": 3,
  "En stock": 4,
};

function expiresSoon(item: StockItem) {
  const expiry = nearestExpiry(item);
  return !!expiry && daysUntil(expiry) <= EXPIRY_WARNING_DAYS;
}

const MATCHES: Record<Attention, (item: StockItem) => boolean> = {
  reorder: (i) => i.quantity <= i.alertThreshold,
  rupture: (i) => i.quantity === 0,
  expiry: expiresSoon,
};

function compare(a: StockItem, b: StockItem, key: StockSortKey) {
  switch (key) {
    case "name":
      return a.name.localeCompare(b.name, "fr");
    case "stock":
      return a.quantity / Math.max(1, a.alertThreshold) - b.quantity / Math.max(1, b.alertThreshold);
    case "expiry":
      return daysOrInfinity(a) - daysOrInfinity(b);
    case "value":
      return a.quantity * a.purchasePrice - b.quantity * b.purchasePrice;
    case "status":
      return STATUS_RANK[stockStatus(a)] - STATUS_RANK[stockStatus(b)] || a.name.localeCompare(b.name, "fr");
  }
}

function daysOrInfinity(item: StockItem) {
  const expiry = nearestExpiry(item);
  return expiry ? daysUntil(expiry) : Number.POSITIVE_INFINITY;
}

export default function StockPage() {
  useInventoryVersion();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<StockCategory | "all">("all");
  const [attention, setAttention] = useState<Attention | null>(null);
  const [sortKey, setSortKey] = useState<StockSortKey>("status");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<StockItem | null>(null);

  const totalValue = STOCK.reduce((sum, i) => sum + i.quantity * i.purchasePrice, 0);
  const counts = {
    reorder: STOCK.filter(MATCHES.reorder).length,
    rupture: STOCK.filter(MATCHES.rupture).length,
    expiry: STOCK.filter(MATCHES.expiry).length,
  };

  const q = search.trim().toLowerCase();
  const filtered = STOCK.filter((i) => category === "all" || i.category === category)
    .filter((i) => !attention || MATCHES[attention](i))
    .filter((i) => !q || `${i.name} ${i.form} ${i.location} ${i.id} ${i.lots.map((l) => l.lot).join(" ")}`.toLowerCase().includes(q))
    .sort((a, b) => (sortDirection === "asc" ? 1 : -1) * compare(a, b, sortKey));

  const categoryCounts = Object.fromEntries(STOCK_CATEGORIES.map((c) => [c, STOCK.filter((i) => i.category === c).length]));

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleAttention = (value: Attention) => {
    setAttention((current) => (current === value ? null : value));
    setPage(1);
  };

  const handleSort = (key: StockSortKey) => {
    if (key === sortKey) setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDirection(key === "value" ? "desc" : "asc");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <KpiStrip>
        <KpiTile label="Valeur du stock" value={formatAmount(Math.round(totalValue))} detail={`Au prix d'achat · ${STOCK.length} références`} />
        <KpiTile
          label="À réapprovisionner"
          value={counts.reorder}
          detail="Stock au seuil ou en dessous"
          tone={counts.reorder ? "warning" : "default"}
          active={attention === "reorder"}
          onClick={() => toggleAttention("reorder")}
        />
        <KpiTile
          label="En rupture"
          value={counts.rupture}
          detail="Plus aucune unité"
          tone={counts.rupture ? "danger" : "default"}
          active={attention === "rupture"}
          onClick={() => toggleAttention("rupture")}
        />
        <KpiTile
          label={`Péremption ≤ ${EXPIRY_WARNING_DAYS} jours`}
          value={counts.expiry}
          detail="Lots périmés inclus"
          tone={counts.expiry ? "warning" : "default"}
          active={attention === "expiry"}
          onClick={() => toggleAttention("expiry")}
        />
      </KpiStrip>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SearchField
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Rechercher un produit, un lot, un emplacement…"
            />
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="lg">
                <Link href="/inventory/factures">
                  <HugeiconsIcon icon={Upload04Icon} strokeWidth={2.2} data-icon="inline-start" />
                  Importer une facture
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/inventory/ventes-achats?commander=nouveau">
                  <HugeiconsIcon icon={ShoppingCartAdd01Icon} strokeWidth={2.2} data-icon="inline-start" />
                  Nouvelle commande
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              spacing={0}
              value={category}
              onValueChange={(v) => {
                if (!v) return;
                setCategory(v as StockCategory | "all");
                setPage(1);
              }}
              aria-label="Catégorie"
              className="flex-wrap"
            >
              <ToggleGroupItem value="all" className="px-3 data-[state=on]:bg-primary/12 data-[state=on]:font-semibold">
                Tout <span className="text-muted-foreground tabular-nums">{STOCK.length}</span>
              </ToggleGroupItem>
              {STOCK_CATEGORIES.map((c) => (
                <ToggleGroupItem key={c} value={c} className="px-3 data-[state=on]:bg-primary/12 data-[state=on]:font-semibold">
                  {CATEGORY_LABEL[c]} <span className="text-muted-foreground tabular-nums">{categoryCounts[c]}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {attention && <FilterChip label={ATTENTION_LABEL[attention]} onClear={() => setAttention(null)} />}
          </div>
        </div>

        <StockTable items={pageItems} sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} onSelect={setSelected} />

        <TablePagination
          page={page}
          pageSize={pageSize}
          total={filtered.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>

      <ProductDialog item={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartIcon } from "@/components/layout/icons";
import {
  BILAN_PERIODS,
  PERIOD_BUCKET_NOUN,
  PERIOD_NOUN,
  formatMoney,
  getBilan,
  type BilanPeriod,
} from "./bilan-data";
import { BilanFinancesChart } from "./bilan-finances-chart";
import { BilanStockChart } from "./bilan-stock-chart";
import { QuickActionsBar } from "./quick-actions";

type Tone = "neutral" | "success" | "danger" | "warning";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "text-foreground",
  success: "text-status-success",
  danger: "text-status-danger",
  warning: "text-status-warning",
};

function Kpi({
  label,
  value,
  hint,
  tone = "neutral",
  delta,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
  delta?: number;
}) {
  return (
    <div className="flex flex-col gap-1 p-5">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
      <span className="flex items-baseline gap-2">
        <span className={`text-xl font-extrabold ${TONE_CLASS[tone]}`}>{value}</span>
        {delta !== undefined && (
          <span className={`text-xs font-semibold ${delta >= 0 ? "text-status-success" : "text-status-danger"}`}>
            {delta >= 0 ? "+" : ""}
            {delta}
          </span>
        )}
      </span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

export function BilanSection() {
  const [period, setPeriod] = useState<BilanPeriod>("weekly");
  const bilan = useMemo(() => getBilan(period), [period]);

  return (
    <section className="border-b border-border">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <ChartIcon className="h-4.5 w-4.5 text-primary" strokeWidth={2.2} />
          <h2 className="text-base font-bold text-foreground">Bilan</h2>
          <span className="text-sm text-muted-foreground">· {PERIOD_NOUN[period]}</span>
        </div>
        <ToggleGroup
          type="single"
          value={period}
          onValueChange={(value) => value && setPeriod(value as BilanPeriod)}
          className="rounded-lg bg-muted p-1"
        >
          {BILAN_PERIODS.map((p) => (
            <ToggleGroupItem
              key={p.value}
              value={p.value}
              className="px-3 data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-sm"
            >
              {p.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-border border-b border-border lg:grid-cols-4 lg:divide-y-0">
        <Kpi
          label="Clients reçus"
          value={String(bilan.clientsRecus)}
          delta={bilan.clientsRecus - bilan.clientsRecusPrev}
          hint="vs période précédente"
        />
        <Kpi
          label="Encaissé"
          value={formatMoney(bilan.totalEncaisse)}
          tone="success"
          hint={`${Math.round(bilan.tauxRecouvrement * 100)} % du facturé`}
        />
        <Kpi label="Impayé" value={formatMoney(bilan.totalImpaye)} tone="danger" hint="À relancer" />
        <QuickActionsBar />
      </div>

      <div className="grid grid-cols-1 divide-y divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <div className="p-6">
          <h3 className="text-sm font-bold text-foreground">Argent</h3>
          <p className="mb-4 text-xs text-muted-foreground">
            Encaissé, impayé et en attente par {PERIOD_BUCKET_NOUN[period]}
          </p>
          <BilanFinancesChart data={bilan.finance} />
        </div>
        <div className="p-6">
          <h3 className="text-sm font-bold text-foreground">Stock</h3>
          <p className="mb-4 text-xs text-muted-foreground">
            Entrées et sorties de stock par {PERIOD_BUCKET_NOUN[period]}
          </p>
          <BilanStockChart data={bilan.stock} />
        </div>
      </div>
    </section>
  );
}

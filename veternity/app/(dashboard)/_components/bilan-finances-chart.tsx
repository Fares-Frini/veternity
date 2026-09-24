"use client";

import { Bar } from "react-chartjs-2";
import { formatMoney, type FinanceBucket } from "./bilan-data";
import { CHART_GRID_COLOR, CHART_TEXT_COLOR, STATUS_COLORS } from "./chartjs-theme";

export function BilanFinancesChart({ data }: { data: FinanceBucket[] }) {
  const chart = {
    labels: data.map((b) => b.label),
    datasets: [
      {
        label: "Encaissé",
        data: data.map((b) => b.encaisse),
        backgroundColor: STATUS_COLORS.success,
        stack: "money",
        borderRadius: 4,
        maxBarThickness: 40,
      },
      {
        label: "Impayé",
        data: data.map((b) => b.impaye),
        backgroundColor: STATUS_COLORS.danger,
        stack: "money",
        borderRadius: 4,
        maxBarThickness: 40,
      },
      {
        label: "En attente",
        data: data.map((b) => b.attente),
        backgroundColor: STATUS_COLORS.warning,
        stack: "money",
        borderRadius: 4,
        maxBarThickness: 40,
      },
    ],
  };

  return (
    <div className="h-72">
      <Bar
        data={chart}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: {
              position: "bottom",
              labels: { boxWidth: 10, boxHeight: 10, padding: 16, usePointStyle: true, pointStyle: "circle" },
            },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label ?? ""}: ${formatMoney(ctx.parsed.y ?? 0)}`,
              },
            },
          },
          scales: {
            x: { stacked: true, grid: { display: false }, ticks: { color: CHART_TEXT_COLOR } },
            y: {
              stacked: true,
              beginAtZero: true,
              grid: { color: CHART_GRID_COLOR },
              ticks: {
                color: CHART_TEXT_COLOR,
                callback: (value) => {
                  const n = Number(value);
                  return n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}

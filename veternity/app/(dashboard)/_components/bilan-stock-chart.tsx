"use client";

import { Bar } from "react-chartjs-2";
import type { StockBucket } from "./bilan-data";
import { CHART_COLORS, CHART_GRID_COLOR, CHART_TEXT_COLOR } from "./chartjs-theme";

export function BilanStockChart({ data }: { data: StockBucket[] }) {
  const chart = {
    labels: data.map((b) => b.label),
    datasets: [
      {
        label: "Entrées",
        data: data.map((b) => b.entrees),
        backgroundColor: CHART_COLORS.chart1,
        borderRadius: 4,
        maxBarThickness: 22,
      },
      {
        label: "Sorties",
        data: data.map((b) => b.sorties),
        backgroundColor: CHART_COLORS.chart3,
        borderRadius: 4,
        maxBarThickness: 22,
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
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: CHART_TEXT_COLOR } },
            y: {
              beginAtZero: true,
              grid: { color: CHART_GRID_COLOR },
              ticks: { precision: 0, color: CHART_TEXT_COLOR },
            },
          },
        }}
      />
    </div>
  );
}

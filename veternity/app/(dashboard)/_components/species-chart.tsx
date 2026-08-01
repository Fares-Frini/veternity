"use client";

import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ANIMALS } from "../animaux/_components/data";
import { CHART_GRID_COLOR, CHART_TEXT_COLOR } from "./chartjs-theme";

const counts = new Map<string, number>();
for (const animal of ANIMALS) {
  counts.set(animal.species, (counts.get(animal.species) ?? 0) + 1);
}

const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);

export function SpeciesChart() {
  const data = {
    labels: entries.map(([species]) => species),
    datasets: [
      {
        label: "Animaux",
        data: entries.map(([, count]) => count),
        backgroundColor: "#0065e4",
        borderRadius: 6,
        maxBarThickness: 48,
      },
    ],
  };

  return (
    <Card className="rounded-none shadow-none ring-0">
      <CardHeader>
        <CardTitle className="text-base font-bold text-foreground">Animaux par espèce</CardTitle>
        <CardDescription>Répartition de la patientèle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-55">
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false }, ticks: { color: CHART_TEXT_COLOR } },
                y: {
                  beginAtZero: true,
                  ticks: { precision: 0, color: CHART_TEXT_COLOR },
                  grid: { color: CHART_GRID_COLOR },
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

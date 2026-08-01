"use client";

import { Doughnut } from "react-chartjs-2";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PAGE_THEMES } from "@/components/layout/page-theme";
import { APPOINTMENTS, VETS } from "../appointments/_components/data";
const PALETTE = [
  PAGE_THEMES.dashboard.accent,
  PAGE_THEMES.inventory.accent,
  PAGE_THEMES.animaux.accent,
  PAGE_THEMES.clients.accent,
  PAGE_THEMES.consultations.accent,
];

export function VetWorkloadChart() {
  const counts = VETS.map((vet) => APPOINTMENTS.filter((a) => a.vet === vet).length);

  const data = {
    labels: VETS,
    datasets: [
      {
        data: counts,
        backgroundColor: VETS.map((_, i) => PALETTE[i % PALETTE.length]),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  return (
    <Card className="rounded-none shadow-none ring-0">
      <CardHeader>
        <CardTitle className="text-base font-bold text-foreground">Charge par vétérinaire</CardTitle>
        <CardDescription>Répartition des rendez-vous</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-55">
          <Doughnut
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "65%",
              plugins: {
                legend: {
                  position: "bottom",
                  labels: { boxWidth: 10, boxHeight: 10, padding: 16, usePointStyle: true, pointStyle: "circle" },
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

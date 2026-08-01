"use client";

import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APPOINTMENTS, type AppointmentStatus } from "../appointments/_components/data";
import { CHART_GRID_COLOR, CHART_TEXT_COLOR, STATUS_COLORS } from "./chartjs-theme";

const STATUS_ORDER: AppointmentStatus[] = ["Confirmé", "En attente", "Terminé", "Annulé"];

const STATUS_COLOR: Record<AppointmentStatus, string> = {
  "Confirmé": STATUS_COLORS.info,
  "En attente": STATUS_COLORS.warning,
  "Terminé": "#0065e4",
  "Annulé": STATUS_COLORS.danger,
};

export function AppointmentsStatusChart() {
  const data = {
    labels: STATUS_ORDER,
    datasets: [
      {
        label: "Rendez-vous",
        data: STATUS_ORDER.map((status) => APPOINTMENTS.filter((a) => a.status === status).length),
        backgroundColor: STATUS_ORDER.map((status) => STATUS_COLOR[status]),
        borderRadius: 6,
        maxBarThickness: 48,
      },
    ],
  };

  return (
    <Card className="rounded-none shadow-none ring-0">
      <CardHeader>
        <CardTitle className="text-base font-bold text-foreground">Rendez-vous par statut</CardTitle>
        <CardDescription>Tous les rendez-vous enregistrés</CardDescription>
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

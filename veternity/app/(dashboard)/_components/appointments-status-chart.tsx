"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { APPOINTMENTS, type AppointmentStatus } from "../appointments/_components/data";

const STATUS_ORDER: AppointmentStatus[] = ["Confirmé", "En attente", "Terminé", "Annulé"];

const STATUS_COLOR: Record<AppointmentStatus, string> = {
  "Confirmé": "var(--color-status-info)",
  "En attente": "var(--color-status-warning)",
  "Terminé": "var(--color-primary)",
  "Annulé": "var(--color-status-danger)",
};

const data = STATUS_ORDER.map((status) => ({
  status,
  count: APPOINTMENTS.filter((a) => a.status === status).length,
  fill: STATUS_COLOR[status],
}));

const chartConfig = {
  count: { label: "Rendez-vous" },
} satisfies ChartConfig;

export function AppointmentsStatusChart() {
  return (
    <Card className="rounded-none shadow-none ring-0">
      <CardHeader>
        <CardTitle className="text-base font-bold text-foreground">Rendez-vous par statut</CardTitle>
        <CardDescription>Tous les rendez-vous enregistrés</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

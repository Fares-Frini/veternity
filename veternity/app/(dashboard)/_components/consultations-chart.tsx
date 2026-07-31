"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const data = [
  { month: "Jan", consultations: 45 },
  { month: "Fév", consultations: 38 },
  { month: "Mar", consultations: 52 },
  { month: "Avr", consultations: 42 },
  { month: "Mai", consultations: 58 },
  { month: "Jun", consultations: 50 },
  { month: "Jul", consultations: 62 },
];

const chartConfig = {
  consultations: { label: "Consultations", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function ConsultationsChart() {
  return (
    <Card className="rounded-lg border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold text-foreground">Consultations / mois</CardTitle>
        <CardDescription>Année 2026</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="consultations" fill="var(--color-consultations)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

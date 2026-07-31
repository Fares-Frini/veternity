"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const data = [
  { month: "Jan", revenue: 18000 },
  { month: "Fév", revenue: 20000 },
  { month: "Mar", revenue: 23000 },
  { month: "Avr", revenue: 21000 },
  { month: "Mai", revenue: 27000 },
  { month: "Jun", revenue: 26000 },
  { month: "Jul", revenue: 29000 },
];

const chartConfig = {
  revenue: { label: "Revenus", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function RevenueChart() {
  return (
    <Card className="rounded-lg border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold text-foreground">Revenus (MAD)</CardTitle>
        <CardDescription>Année 2026</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2.5}
              fill="url(#fillRevenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

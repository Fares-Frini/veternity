"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ANIMALS } from "../animaux/_components/data";

const counts = new Map<string, number>();
for (const animal of ANIMALS) {
  counts.set(animal.species, (counts.get(animal.species) ?? 0) + 1);
}

const data = [...counts.entries()]
  .map(([species, count]) => ({ species, count }))
  .sort((a, b) => b.count - a.count);

const chartConfig = {
  count: { label: "Animaux", color: "var(--color-primary)" },
} satisfies ChartConfig;

export function SpeciesChart() {
  return (
    <Card className="rounded-none shadow-none ring-0">
      <CardHeader>
        <CardTitle className="text-base font-bold text-foreground">Animaux par espèce</CardTitle>
        <CardDescription>Répartition de la patientèle</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="species" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

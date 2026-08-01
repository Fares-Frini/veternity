import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StethoscopeIcon } from "@/components/layout/icons";
import { PillIcon as PillIconData } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PAGE_THEMES } from "@/components/layout/page-theme";
import { CONSULTATIONS } from "../consultations/(tabs)/liste/_components/data";
import { STATUS_META, formatDate } from "../consultations/(tabs)/liste/_components/utils";
import { PRESCRIPTIONS } from "../consultations/(tabs)/prescriptions/_components/data";

const PRESCRIPTION_ACCENT = PAGE_THEMES.consultations.accent;

interface ActivityItem {
  id: string;
  kind: "consultation" | "prescription";
  animal: string;
  owner: string;
  vet: string;
  date: string;
  summary: string;
  status?: string;
}

const items: ActivityItem[] = [
  ...CONSULTATIONS.map((c): ActivityItem => ({
    id: c.id,
    kind: "consultation",
    animal: c.animal,
    owner: c.owner,
    vet: c.vet,
    date: c.date,
    summary: c.diagnostic,
    status: c.status,
  })),
  ...PRESCRIPTIONS.map((p): ActivityItem => ({
    id: p.id,
    kind: "prescription",
    animal: p.animal,
    owner: p.owner,
    vet: p.vet,
    date: p.date,
    summary: p.medications,
  })),
].sort((a, b) => b.date.localeCompare(a.date));

export function RecentActivity() {
  const recent = items.slice(0, 6);

  return (
    <Card className="rounded-none shadow-none ring-0">
      <CardHeader>
        <CardTitle className="text-base font-bold text-foreground">Activité récente</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
        {recent.map((item) => (
          <div
            key={`${item.kind}-${item.id}`}
            className={`flex items-start gap-3 rounded-md border-l-4 py-3 pr-4 pl-3.5 ${
              item.kind === "consultation" ? "border-primary bg-secondary/40" : ""
            }`}
            style={
              item.kind === "prescription"
                ? { borderLeftColor: PRESCRIPTION_ACCENT, backgroundColor: `color-mix(in srgb, ${PRESCRIPTION_ACCENT} 10%, white)` }
                : undefined
            }
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-card shadow-sm">
              {item.kind === "consultation" ? (
                <StethoscopeIcon className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} />
              ) : (
                <HugeiconsIcon icon={PillIconData} className="h-3.5 w-3.5" style={{ color: PRESCRIPTION_ACCENT }} strokeWidth={2.2} />
              )}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-foreground">
                {item.animal} <span className="font-normal text-muted-foreground">— {item.owner}</span>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.summary}</p>
              <div className="mt-1.5 flex items-center gap-2">
                {item.status && (
                  <Badge className={`${STATUS_META[item.status as keyof typeof STATUS_META].bg} ${STATUS_META[item.status as keyof typeof STATUS_META].text}`}>
                    {item.status}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {item.vet} · {formatDate(item.date)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

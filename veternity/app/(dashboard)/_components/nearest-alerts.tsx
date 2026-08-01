import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { AlertCircleIcon, Clock01Icon, Invoice01Icon, Medicine02Icon, Package01Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ALERTS, type AlertSeverity, type AlertType } from "./alerts-data";

const TYPE_ICON: Record<AlertType, IconSvgElement> = {
  stock: Package01Icon,
  vaccination: Medicine02Icon,
  rdv: Clock01Icon,
  facture: Invoice01Icon,
};

const SEVERITY_STYLE: Record<AlertSeverity, { border: string; bg: string; icon: string; badge: "danger" | "warning" | "info" }> = {
  high: { border: "border-status-danger", bg: "bg-status-danger-bg", icon: "text-status-danger", badge: "danger" },
  medium: { border: "border-status-warning", bg: "bg-status-warning-bg", icon: "text-status-warning", badge: "warning" },
  low: { border: "border-status-info", bg: "bg-status-info-bg", icon: "text-status-info", badge: "info" },
};

const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  high: "Urgent",
  medium: "À traiter",
  low: "À surveiller",
};

function formatDueDate(date: string) {
  const label = new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function NearestAlerts() {
  const nearest = [...ALERTS]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  return (
    <Card className="rounded-none shadow-none ring-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
          <HugeiconsIcon icon={AlertCircleIcon} className="h-4.5 w-4.5 text-status-danger" strokeWidth={2.2} />
          Alertes les plus proches
          <Badge variant="danger" className="ml-auto">
            {nearest.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        {nearest.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">Aucune alerte à signaler.</p>
        )}
        {nearest.map((alert) => {
          const style = SEVERITY_STYLE[alert.severity];
          return (
            <div
              key={alert.id}
              className={`flex items-center justify-between gap-3 rounded-md border-l-4 py-3 pr-4 pl-3.5 ${style.border} ${style.bg}`}
            >
              <div className="flex items-center gap-3">
                <HugeiconsIcon icon={TYPE_ICON[alert.type]} className={`h-4 w-4 shrink-0 ${style.icon}`} strokeWidth={2.2} />
                <div>
                  <div className="text-sm font-semibold text-foreground">{alert.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {alert.detail} · {formatDueDate(alert.dueDate)}
                  </div>
                </div>
              </div>
              <Badge variant={style.badge} className="shrink-0">
                {SEVERITY_LABEL[alert.severity]}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

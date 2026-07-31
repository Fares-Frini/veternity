import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, PawIcon, PillIcon, ReceiptIcon, StethoscopeIcon } from "@/components/layout/icons";

const ACTIVITY = [
  {
    icon: StethoscopeIcon,
    iconBg: "bg-secondary",
    iconColor: "text-secondary-foreground",
    title: "Luna (Chat persan) — Otite externe",
    subtitle: "09:00 · Consultation · Dr. Kadiri",
  },
  {
    icon: CalendarIcon,
    iconBg: "bg-status-info-bg",
    iconColor: "text-status-info",
    title: "Rex (Labrador) — RDV confirmé",
    subtitle: "10:30 · Rendez-vous · Dr. Benkirane",
  },
  {
    icon: PillIcon,
    iconBg: "bg-status-danger-bg",
    iconColor: "text-status-danger",
    title: "Prescription — Apoquel 16mg pour Bella",
    subtitle: "11:15 · Prescription · Dr. Kadiri",
  },
  {
    icon: PawIcon,
    iconBg: "bg-status-purple-bg",
    iconColor: "text-status-purple",
    title: "Nouvel animal — Mango (Perroquet) enregistré",
    subtitle: "14:00 · Nouvel animal · Secrétariat",
  },
  {
    icon: ReceiptIcon,
    iconBg: "bg-status-warning-bg",
    iconColor: "text-status-warning",
    title: "Facture #F004 payée — Sara El Fassi (150 MAD)",
    subtitle: "15:30 · Paiement · Secrétariat",
  },
] as const;

export function RecentActivity() {
  return (
    <Card className="rounded-lg border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold text-foreground">Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute top-2 bottom-2 left-5 w-px bg-border" />
          <ul className="relative flex flex-col gap-5">
            {ACTIVITY.map(({ icon: Icon, iconBg, iconColor, title, subtitle }) => (
              <li key={title} className="flex items-start gap-3">
                <span
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}
                >
                  <Icon className={`h-[18px] w-[18px] ${iconColor}`} strokeWidth={2.2} />
                </span>
                <div className="pt-1.5">
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

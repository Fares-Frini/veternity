import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, PawIcon, PillIcon, ReceiptIcon, StethoscopeIcon } from "@/components/layout/icons";

const ACTIVITY = [
  {
    icon: StethoscopeIcon,
    iconBg: "bg-[#e3f5f2]",
    iconColor: "text-[#00998e]",
    title: "Luna (Chat persan) — Otite externe",
    subtitle: "09:00 · Consultation · Dr. Kadiri",
  },
  {
    icon: CalendarIcon,
    iconBg: "bg-[#e8f1ff]",
    iconColor: "text-[#3b82f6]",
    title: "Rex (Labrador) — RDV confirmé",
    subtitle: "10:30 · Rendez-vous · Dr. Benkirane",
  },
  {
    icon: PillIcon,
    iconBg: "bg-[#fde8ea]",
    iconColor: "text-[#e11d48]",
    title: "Prescription — Apoquel 16mg pour Bella",
    subtitle: "11:15 · Prescription · Dr. Kadiri",
  },
  {
    icon: PawIcon,
    iconBg: "bg-[#f1eafe]",
    iconColor: "text-[#7c5cf0]",
    title: "Nouvel animal — Mango (Perroquet) enregistré",
    subtitle: "14:00 · Nouvel animal · Secrétariat",
  },
  {
    icon: ReceiptIcon,
    iconBg: "bg-[#fff1e0]",
    iconColor: "text-[#f5920a]",
    title: "Facture #F004 payée — Sara El Fassi (150 MAD)",
    subtitle: "15:30 · Paiement · Secrétariat",
  },
] as const;

export function RecentActivity() {
  return (
    <Card className="rounded-lg border-[#eef0f5] shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold text-[#1e2a4a]">Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute top-2 bottom-2 left-5 w-px bg-[#eef0f5]" />
          <ul className="relative flex flex-col gap-5">
            {ACTIVITY.map(({ icon: Icon, iconBg, iconColor, title, subtitle }) => (
              <li key={title} className="flex items-start gap-3">
                <span
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}
                >
                  <Icon className={`h-[18px] w-[18px] ${iconColor}`} strokeWidth={2.2} />
                </span>
                <div className="pt-1.5">
                  <p className="text-sm font-semibold text-[#1e2a4a]">{title}</p>
                  <p className="mt-0.5 text-xs text-[#7b88a8]">{subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BoxIcon, CalendarIcon, PawIcon, UsersIcon } from "@/components/layout/icons";

const ACTIONS = [
  {
    href: "/animaux",
    label: "Ajouter un animal",
    icon: PawIcon,
    iconBg: "bg-secondary",
    iconColor: "text-secondary-foreground",
  },
  {
    href: "/clients",
    label: "Ajouter un client",
    icon: UsersIcon,
    iconBg: "bg-status-purple-bg",
    iconColor: "text-status-purple",
  },
  {
    href: "/appointments",
    label: "Planifier un rendez-vous",
    icon: CalendarIcon,
    iconBg: "bg-status-info-bg",
    iconColor: "text-status-info",
  },
  {
    href: "/inventory",
    label: "Gérer l'inventaire",
    icon: BoxIcon,
    iconBg: "bg-status-warning-bg",
    iconColor: "text-status-warning",
  },
] as const;

export function QuickActions() {
  return (
    <Card className="rounded-none shadow-none ring-0">
      <CardHeader>
        <CardTitle className="text-base font-bold text-foreground">Accès rapides</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {ACTIONS.map(({ href, label, icon: Icon, iconBg, iconColor }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-muted"
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${iconBg}`}>
              <Icon className={`h-[18px] w-[18px] ${iconColor}`} strokeWidth={2.2} />
            </span>
            <span className="flex-1 text-sm font-semibold text-foreground">{label}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Clock01Icon, Invoice01Icon, Medicine02Icon, Package01Icon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ALERTS, type AlertSeverity, type AlertType } from "@/app/(dashboard)/_components/alerts-data";
import { BellIcon, ChevronDownIcon, LogOutIcon, SearchIcon } from "./icons";

const TYPE_ICON: Record<AlertType, IconSvgElement> = {
  stock: Package01Icon,
  vaccination: Medicine02Icon,
  rdv: Clock01Icon,
  facture: Invoice01Icon,
};

const SEVERITY_STYLE: Record<AlertSeverity, { icon: string; bg: string }> = {
  high: { icon: "text-status-danger", bg: "bg-status-danger-bg" },
  medium: { icon: "text-status-warning", bg: "bg-status-warning-bg" },
  low: { icon: "text-status-info", bg: "bg-status-info-bg" },
};

function formatDueDate(date: string) {
  const label = new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const nearestAlerts = [...ALERTS].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);

  return (
    <header className="flex h-16 w-full shrink-0 items-center gap-6 border-b border-border bg-card px-8">
      <div className="flex shrink-0 items-center gap-2.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent">
          <Image src="/logos/logo_color.png" alt="Veternity" width={32} height={32} className="rounded-sm" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-foreground">Veternity</span>
      </div>

      <div className="flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-border bg-muted px-4">
        <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un animal, un client..."
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <BellIcon className="h-5 w-5" />
              {nearestAlerts.length > 0 && (
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-status-danger ring-2 ring-card" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b border-border px-4 py-3">
              <span className="text-sm font-bold text-foreground">Alertes</span>
            </div>
            <div className="flex max-h-96 flex-col gap-1 overflow-y-auto p-2">
              {nearestAlerts.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">Aucune alerte.</p>
              )}
              {nearestAlerts.map((alert) => {
                const style = SEVERITY_STYLE[alert.severity];
                return (
                  <div key={alert.id} className="flex items-start gap-2.5 rounded-md p-2 hover:bg-muted">
                    <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${style.bg}`}>
                      <HugeiconsIcon icon={TYPE_ICON[alert.type]} className={`h-3.5 w-3.5 ${style.icon}`} strokeWidth={2.2} />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-foreground">{alert.title}</div>
                      <div className="mt-0.5 truncate text-xs text-muted-foreground">
                        {alert.detail} · {formatDueDate(alert.dueDate)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-8 w-px bg-border" />

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-accent"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary font-bold text-primary-foreground transition-colors duration-300 ease-out">
                NK
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-foreground">Dr. Kadiri</span>
              <span className="text-xs text-muted-foreground">Vétérinaire</span>
            </div>
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>

          {menuOpen && (
            <div className="absolute top-full right-0 z-30 mt-2 w-48 overflow-hidden rounded-md border border-border bg-card py-1 shadow-lg">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-status-danger-bg hover:text-status-danger"
              >
                <LogOutIcon className="h-4 w-4" />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

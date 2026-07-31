"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BoxIcon,
  CalendarIcon,
  ChartIcon,
  HomeIcon,
  LogOutIcon,
  PawIcon,
  ReceiptIcon,
  SettingsIcon,
  SidebarIcon,
  StethoscopeIcon,
  UsersIcon,
} from "./icons";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: HomeIcon },
  { href: "/animaux", label: "Animaux", icon: PawIcon },
  { href: "/appointments", label: "Rendez-vous", icon: CalendarIcon },
  { href: "/consultations", label: "Consultations", icon: StethoscopeIcon },
  { href: "/clients", label: "Clients", icon: UsersIcon },
  { href: "/inventory", label: "Inventaire", icon: BoxIcon },
  { href: "/billing", label: "Billing", icon: ReceiptIcon },
  { href: "/reports", label: "Reports", icon: ChartIcon },
] as const;

const ICON_STROKE_WIDTH = 2.4;

function NavIconBadge({
  icon: Icon,
  isActive,
}: {
  icon: (props: { className?: string; strokeWidth?: number }) => React.ReactElement;
  isActive: boolean;
}) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
        isActive ? "bg-sidebar-primary" : ""
      }`}
    >
      <Icon
        className={`h-5 w-5 ${isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground"}`}
        strokeWidth={ICON_STROKE_WIDTH}
      />
    </span>
  );
}

export default function SideNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex h-full shrink-0 flex-col bg-sidebar transition-[width] duration-200 ${
        collapsed ? "w-18" : "w-64"
      }`}
    >
      {/* Collapse toggle */}
      <div className={`flex items-center px-3 pt-4 ${collapsed ? "justify-center" : "justify-end"}`}>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
        >
          <SidebarIcon className="h-5 w-5" strokeWidth={ICON_STROKE_WIDTH} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 pt-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 rounded-md py-1.5 pr-3 text-sm font-medium text-sidebar-foreground transition-colors ${
                collapsed ? "justify-center pl-1.5" : "pl-1.5 hover:bg-sidebar-accent"
              }`}
            >
              <NavIconBadge icon={Icon} isActive={isActive} />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* Settings + sign out */}
      <div className="flex flex-col gap-1 border-t border-sidebar-border px-3 py-4">
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className={`flex items-center gap-3 rounded-md py-1.5 pr-3 text-sm font-medium text-sidebar-foreground transition-colors ${
            collapsed ? "justify-center pl-1.5" : "pl-1.5 hover:bg-sidebar-accent"
          }`}
        >
          <NavIconBadge icon={SettingsIcon} isActive={pathname.startsWith("/settings")} />
          {!collapsed && "Settings"}
        </Link>
        <button
          type="button"
          title={collapsed ? "Sign out" : undefined}
          className={`flex items-center gap-3 rounded-md py-1.5 pr-3 text-left text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent ${
            collapsed ? "justify-center pl-1.5" : "pl-1.5"
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
            <LogOutIcon className="h-5 w-5 text-sidebar-foreground" strokeWidth={ICON_STROKE_WIDTH} />
          </span>
          {!collapsed && "Sign out"}
        </button>
      </div>
    </aside>
  );
}

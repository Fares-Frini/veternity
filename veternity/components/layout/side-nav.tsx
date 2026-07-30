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
  UsersIcon,
} from "./icons";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: HomeIcon },
  { href: "/animaux", label: "Animaux", icon: PawIcon },
  { href: "/appointments", label: "Appointments", icon: CalendarIcon },
  { href: "/clients", label: "Clients", icon: UsersIcon },
  { href: "/inventory", label: "Inventory", icon: BoxIcon },
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
        isActive ? "bg-white" : ""
      }`}
    >
      <Icon
        className={`h-5 w-5 ${isActive ? "text-[#00998e]" : "text-white"}`}
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
      className={`flex h-full shrink-0 flex-col bg-[#00998e] transition-[width] duration-200 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Collapse toggle */}
      <div className={`flex items-center px-3 pt-4 ${collapsed ? "justify-center" : "justify-end"}`}>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10"
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
              className={`flex items-center gap-3 rounded-md py-1.5 pr-3 text-sm font-medium text-white transition-colors ${
                collapsed ? "justify-center pl-1.5" : "pl-1.5 hover:bg-white/10"
              }`}
            >
              <NavIconBadge icon={Icon} isActive={isActive} />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* Settings + sign out */}
      <div className="flex flex-col gap-1 border-t border-white/15 px-3 py-4">
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className={`flex items-center gap-3 rounded-md py-1.5 pr-3 text-sm font-medium text-white transition-colors ${
            collapsed ? "justify-center pl-1.5" : "pl-1.5 hover:bg-white/10"
          }`}
        >
          <NavIconBadge icon={SettingsIcon} isActive={pathname.startsWith("/settings")} />
          {!collapsed && "Settings"}
        </Link>
        <button
          type="button"
          title={collapsed ? "Sign out" : undefined}
          className={`flex items-center gap-3 rounded-md py-1.5 pr-3 text-left text-sm font-medium text-white transition-colors hover:bg-white/10 ${
            collapsed ? "justify-center pl-1.5" : "pl-1.5"
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
            <LogOutIcon className="h-5 w-5 text-white" strokeWidth={ICON_STROKE_WIDTH} />
          </span>
          {!collapsed && "Sign out"}
        </button>
      </div>
    </aside>
  );
}

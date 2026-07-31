"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BoxIcon,
  CalendarIcon,
  HomeIcon,
  LogOutIcon,
  PawIcon,
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
] as const;

const ICON_STROKE_WIDTH = 2.4;

/** Label that fades + widens in, instead of popping in/out with the collapsed state. */
function NavLabel({ collapsed, children }: { collapsed: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`overflow-hidden whitespace-nowrap transition-[opacity,max-width] duration-300 ease-out ${
        collapsed ? "max-w-0 opacity-0" : "max-w-40 opacity-100"
      }`}
    >
      {children}
    </span>
  );
}

function NavIconBadge({
  icon: Icon,
  isActive,
}: {
  icon: (props: { className?: string; strokeWidth?: number }) => React.ReactElement;
  isActive: boolean;
}) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors duration-300 ease-out ${
        isActive ? "bg-sidebar-primary" : "bg-transparent"
      }`}
    >
      <Icon
        className={`h-5 w-5 transition-colors duration-300 ease-out ${
          isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground"
        }`}
        strokeWidth={ICON_STROKE_WIDTH}
      />
    </span>
  );
}

export default function SideNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const asideRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [indicator, setIndicator] = useState<{ top: number; left: number; width: number; height: number } | null>(
    null
  );

  const activeHref =
    NAV_ITEMS.find((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)))?.href ?? null;

  // Click anywhere inside the sidebar to expand it; click anywhere outside to collapse it back.
  useEffect(() => {
    if (collapsed) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (asideRef.current && !asideRef.current.contains(e.target as Node)) {
        setCollapsed(true);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [collapsed]);

  useEffect(() => {
    const navEl = navRef.current;
    const activeEl = activeHref ? itemRefs.current.get(activeHref) : null;
    if (!navEl || !activeEl) {
      setIndicator(null);
      return;
    }

    const measure = () => {
      const navRect = navEl.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setIndicator({
        top: elRect.top - navRect.top + navEl.scrollTop,
        left: elRect.left - navRect.left,
        width: elRect.width,
        height: elRect.height,
      });
    };

    measure();

    // The sidebar's width animates via CSS (the collapse transition), so the
    // active item's box keeps changing for the duration of that transition —
    // keep re-measuring every frame it does instead of only once up front.
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(navEl);
    resizeObserver.observe(activeEl);

    return () => resizeObserver.disconnect();
  }, [activeHref, collapsed]);

  return (
    <aside
      ref={asideRef}
      onClick={() => {
        if (collapsed) setCollapsed(false);
      }}
      className={`flex h-full shrink-0 flex-col bg-sidebar transition-[width] duration-300 ease-out ${
        collapsed ? "w-18" : "w-64"
      }`}
    >
      {/* Collapse toggle */}
      <div className={`flex items-center px-3 pt-4 ${collapsed ? "justify-center" : "justify-end"}`}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setCollapsed((v) => !v);
          }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sidebar-foreground transition-colors duration-300 ease-out hover:bg-sidebar-accent"
        >
          <SidebarIcon className="h-5 w-5" strokeWidth={ICON_STROKE_WIDTH} />
        </button>
      </div>

      {/* Nav links */}
      <nav ref={navRef} className="relative flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 pt-2">
        {/* Sliding highlight that follows the active item */}
        <span
          aria-hidden
          className="pointer-events-none absolute rounded-md bg-sidebar-primary shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_1px_rgba(255,255,255,0.5)] transition-[top,left,width,height,opacity] duration-300 ease-out"
          style={{
            top: indicator?.top ?? 0,
            left: indicator?.left ?? 0,
            width: indicator?.width ?? 0,
            height: indicator?.height ?? 0,
            opacity: indicator ? 1 : 0,
          }}
        />

        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === activeHref;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              ref={(el) => {
                if (el) itemRefs.current.set(href, el);
                else itemRefs.current.delete(href);
              }}
              className={`relative z-10 flex items-center gap-3 rounded-md py-1.5 pr-3 text-sm font-medium transition-colors duration-300 ease-out ${
                isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground"
              } ${collapsed ? "justify-center pl-1.5" : "pl-1.5 hover:bg-sidebar-accent"}`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
                <Icon className="h-5 w-5" strokeWidth={ICON_STROKE_WIDTH} />
              </span>
              <NavLabel collapsed={collapsed}>{label}</NavLabel>
            </Link>
          );
        })}
      </nav>

      {/* Settings + sign out */}
      <div className="flex flex-col gap-1 border-t border-sidebar-border px-3 py-4">
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className={`flex items-center gap-3 rounded-md py-1.5 pr-3 text-sm font-medium text-sidebar-foreground transition-colors duration-300 ease-out ${
            collapsed ? "justify-center pl-1.5" : "pl-1.5 hover:bg-sidebar-accent"
          }`}
        >
          <NavIconBadge icon={SettingsIcon} isActive={pathname.startsWith("/settings")} />
          <NavLabel collapsed={collapsed}>Settings</NavLabel>
        </Link>
        <button
          type="button"
          title={collapsed ? "Sign out" : undefined}
          className={`flex items-center gap-3 rounded-md py-1.5 pr-3 text-left text-sm font-medium text-sidebar-foreground transition-colors duration-300 ease-out hover:bg-sidebar-accent ${
            collapsed ? "justify-center pl-1.5" : "pl-1.5"
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
            <LogOutIcon className="h-5 w-5 text-sidebar-foreground" strokeWidth={ICON_STROKE_WIDTH} />
          </span>
          <NavLabel collapsed={collapsed}>Sign out</NavLabel>
        </button>
      </div>
    </aside>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getPageTheme } from "./page-theme";

const THEME_VARS = [
  "--primary",
  "--primary-foreground",
  "--ring",
  "--sidebar-primary",
  "--sidebar-primary-foreground",
  "--sidebar-accent",
  "--sidebar-ring",
] as const;

export function PageThemeEffect() {
  const pathname = usePathname();

  useEffect(() => {
    const theme = getPageTheme(pathname);
    const root = document.documentElement;

    root.style.setProperty("--primary", theme.accent);
    root.style.setProperty("--primary-foreground", theme.onAccent);
    root.style.setProperty("--ring", theme.accent);

    // The sidebar surface stays neutral (white / card). Only the active item
    // and hover state take on the current page's accent colour.
    root.style.setProperty("--sidebar-primary", theme.accent);
    root.style.setProperty("--sidebar-primary-foreground", theme.onAccent);
    root.style.setProperty("--sidebar-accent", `color-mix(in srgb, ${theme.accent} 12%, transparent)`);
    root.style.setProperty("--sidebar-ring", theme.accent);

    return () => {
      THEME_VARS.forEach((v) => root.style.removeProperty(v));
    };
  }, [pathname]);

  return null;
}

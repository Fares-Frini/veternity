"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getPageTheme } from "./page-theme";

const THEME_VARS = [
  "--primary",
  "--primary-foreground",
  "--ring",
  "--sidebar",
  "--sidebar-foreground",
  "--sidebar-primary-foreground",
  "--sidebar-accent",
  "--sidebar-border",
  "--sidebar-ring",
] as const;

export function PageThemeEffect() {
  const pathname = usePathname();

  useEffect(() => {
    const theme = getPageTheme(pathname);
    const root = document.documentElement;
    const isLight = theme.onAccent === "#ffffff";

    root.style.setProperty("--primary", theme.accent);
    root.style.setProperty("--primary-foreground", theme.onAccent);
    root.style.setProperty("--ring", theme.accent);
    root.style.setProperty("--sidebar", theme.accent);
    root.style.setProperty("--sidebar-foreground", theme.onAccent);
    root.style.setProperty("--sidebar-primary-foreground", `color-mix(in srgb, ${theme.accent} 65%, black)`);
    root.style.setProperty("--sidebar-accent", isLight ? "rgb(255 255 255 / 0.14)" : "rgb(0 0 0 / 0.08)");
    root.style.setProperty("--sidebar-border", isLight ? "rgb(255 255 255 / 0.2)" : "rgb(0 0 0 / 0.12)");
    root.style.setProperty("--sidebar-ring", theme.onAccent);

    return () => {
      THEME_VARS.forEach((v) => root.style.removeProperty(v));
    };
  }, [pathname]);

  return null;
}

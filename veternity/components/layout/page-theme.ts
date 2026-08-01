export type PageThemeKey = "dashboard" | "animaux" | "appointments" | "consultations" | "clients" | "inventory";

export interface PageTheme {
  accent: string;
  onAccent: string;
}
export const PAGE_THEMES: Record<PageThemeKey, PageTheme> = {
  dashboard: { accent: "#0065e4", onAccent: "#ffffff" },
  animaux: { accent: "#77b254", onAccent: "#1e2a4a" },
  appointments: { accent: "#3188d5", onAccent: "#ffffff" },
  consultations: { accent: "#49b333", onAccent: "#1e2a4a" },
  clients: { accent: "#f2c916", onAccent: "#1e2a4a" },
  inventory: { accent: "#f57a34", onAccent: "#1e2a4a" },
};

const ROUTE_PREFIXES: [prefix: string, key: PageThemeKey][] = [
  ["/animaux", "animaux"],
  ["/appointments", "appointments"],
  ["/consultations", "consultations"],
  ["/clients", "clients"],
  ["/inventory", "inventory"],
];

export function getPageTheme(pathname: string): PageTheme {
  if (pathname === "/") return PAGE_THEMES.dashboard;
  const match = ROUTE_PREFIXES.find(([prefix]) => pathname.startsWith(prefix));
  return match ? PAGE_THEMES[match[1]] : PAGE_THEMES.dashboard;
}

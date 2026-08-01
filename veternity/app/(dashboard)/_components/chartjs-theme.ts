import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
export const CHART_COLORS = {
  chart1: "#0065e4",
  chart2: "#3b82f6",
  chart3: "#f5920a",
} as const;

export const STATUS_COLORS = {
  success: "#16a34a",
  warning: "#f5920a",
  info: "#3b82f6",
  danger: "#e35d6a",
} as const;

export const CHART_GRID_COLOR = "#eef0f5";
export const CHART_TEXT_COLOR = "#5b6479";

ChartJS.defaults.font.family =
  "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif";
ChartJS.defaults.font.size = 12;
ChartJS.defaults.color = CHART_TEXT_COLOR;
ChartJS.defaults.plugins.tooltip.backgroundColor = "#1e2a4a";
ChartJS.defaults.plugins.tooltip.padding = 10;
ChartJS.defaults.plugins.tooltip.cornerRadius = 8;
ChartJS.defaults.plugins.tooltip.titleFont = { weight: "bold" };
ChartJS.defaults.plugins.tooltip.displayColors = false;

import type { CSSProperties, ReactElement } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Calendar03Icon,
  ChartBarLineIcon,
  Home01Icon,
  Invoice01Icon,
  Logout01Icon,
  Notification03Icon,
  Package01Icon,
  PillIcon as PillIconData,
  PlusSignIcon,
  Search01Icon,
  Settings01Icon,
  SidebarLeft01Icon,
  StethoscopeIcon as StethoscopeIconData,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

export type IconProps = { className?: string; strokeWidth?: number; style?: CSSProperties };
export type IconComponent = (props: IconProps) => ReactElement;

export function HomeIcon({ className, strokeWidth, style }: IconProps) {
  return <HugeiconsIcon icon={Home01Icon} className={className} strokeWidth={strokeWidth} style={style} />;
}

export function PawIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 512 512" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path d="M442.8,361.82C434,336.72,413.49,324,393.69,311.7c-17.23-10.71-33.5-20.83-44.14-39C320.22,222.37,304.11,192,256.06,192s-64.21,30.38-93.61,80.69c-10.65,18.21-27,28.35-44.25,39.08-19.8,12.31-40.27,25-49.1,50.05A78.06,78.06,0,0,0,64,390.11C64,430.85,96.45,464,132.4,464s83.31-18.13,123.76-18.13S343.31,464,379.71,464,448,430.85,448,390.11A78.3,78.3,0,0,0,442.8,361.82Z" />
      <ellipse cx="72" cy="216" rx="56" ry="72" />
      <ellipse cx="184" cy="120" rx="56" ry="72" />
      <ellipse cx="328" cy="120" rx="56" ry="72" />
      <ellipse cx="440" cy="216" rx="56" ry="72" />
    </svg>
  );
}

export function CalendarIcon({ className, strokeWidth, style }: IconProps) {
  return <HugeiconsIcon icon={Calendar03Icon} className={className} strokeWidth={strokeWidth} style={style} />;
}

export function UsersIcon({ className, strokeWidth, style }: IconProps) {
  return <HugeiconsIcon icon={UserGroupIcon} className={className} strokeWidth={strokeWidth} style={style} />;
}

export function BoxIcon({ className, strokeWidth, style }: IconProps) {
  return <HugeiconsIcon icon={Package01Icon} className={className} strokeWidth={strokeWidth} style={style} />;
}

export function ReceiptIcon({ className, strokeWidth, style }: IconProps) {
  return <HugeiconsIcon icon={Invoice01Icon} className={className} strokeWidth={strokeWidth} style={style} />;
}

export function ChartIcon({ className, strokeWidth, style }: IconProps) {
  return <HugeiconsIcon icon={ChartBarLineIcon} className={className} strokeWidth={strokeWidth} style={style} />;
}

export function SettingsIcon({ className, strokeWidth, style }: IconProps) {
  return <HugeiconsIcon icon={Settings01Icon} className={className} strokeWidth={strokeWidth} style={style} />;
}

export function SearchIcon({ className, strokeWidth, style }: IconProps) {
  return <HugeiconsIcon icon={Search01Icon} className={className} strokeWidth={strokeWidth} style={style} />;
}

export function BellIcon({ className, strokeWidth, style }: IconProps) {
  return <HugeiconsIcon icon={Notification03Icon} className={className} strokeWidth={strokeWidth} style={style} />;
}

export function ChevronDownIcon({ className, strokeWidth, style }: IconProps) {
  return <HugeiconsIcon icon={ArrowDown01Icon} className={className} strokeWidth={strokeWidth} style={style} />;
}

export function LogOutIcon({ className, strokeWidth, style }: IconProps) {
  return <HugeiconsIcon icon={Logout01Icon} className={className} strokeWidth={strokeWidth} style={style} />;
}

export function PlusIcon({ className, strokeWidth, style }: IconProps) {
  return <HugeiconsIcon icon={PlusSignIcon} className={className} strokeWidth={strokeWidth} style={style} />;
}

export function SidebarIcon({ className, strokeWidth, style }: IconProps) {
  return <HugeiconsIcon icon={SidebarLeft01Icon} className={className} strokeWidth={strokeWidth} style={style} />;
}

export function StethoscopeIcon({ className, strokeWidth, style }: IconProps) {
  return <HugeiconsIcon icon={StethoscopeIconData} className={className} strokeWidth={strokeWidth} style={style} />;
}

export function PillIcon({ className, strokeWidth, style }: IconProps) {
  return <HugeiconsIcon icon={PillIconData} className={className} strokeWidth={strokeWidth} style={style} />;
}

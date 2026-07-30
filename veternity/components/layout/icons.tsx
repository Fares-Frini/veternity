import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Bone02Icon,
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

type IconProps = { className?: string; strokeWidth?: number };

export function HomeIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={Home01Icon} className={className} strokeWidth={strokeWidth} />;
}

/** Stands in for "patients" — the free icon set has no paw print. */
export function PawIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={Bone02Icon} className={className} strokeWidth={strokeWidth} />;
}

export function CalendarIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={Calendar03Icon} className={className} strokeWidth={strokeWidth} />;
}

export function UsersIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={UserGroupIcon} className={className} strokeWidth={strokeWidth} />;
}

export function BoxIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={Package01Icon} className={className} strokeWidth={strokeWidth} />;
}

export function ReceiptIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={Invoice01Icon} className={className} strokeWidth={strokeWidth} />;
}

export function ChartIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={ChartBarLineIcon} className={className} strokeWidth={strokeWidth} />;
}

export function SettingsIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={Settings01Icon} className={className} strokeWidth={strokeWidth} />;
}

export function SearchIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={Search01Icon} className={className} strokeWidth={strokeWidth} />;
}

export function BellIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={Notification03Icon} className={className} strokeWidth={strokeWidth} />;
}

export function ChevronDownIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={ArrowDown01Icon} className={className} strokeWidth={strokeWidth} />;
}

export function LogOutIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={Logout01Icon} className={className} strokeWidth={strokeWidth} />;
}

export function PlusIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={PlusSignIcon} className={className} strokeWidth={strokeWidth} />;
}

export function SidebarIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={SidebarLeft01Icon} className={className} strokeWidth={strokeWidth} />;
}

export function StethoscopeIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={StethoscopeIconData} className={className} strokeWidth={strokeWidth} />;
}

export function PillIcon({ className, strokeWidth }: IconProps) {
  return <HugeiconsIcon icon={PillIconData} className={className} strokeWidth={strokeWidth} />;
}

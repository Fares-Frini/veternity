import type { ReactNode } from "react";
import SideNav from "@/components/layout/side-nav";
import Header from "@/components/layout/header";
import { PageThemeEffect } from "@/components/layout/page-theme-effect";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <PageThemeEffect />
      <Header />
      <div className="flex min-h-0 flex-1">
        <SideNav />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

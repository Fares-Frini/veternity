import type { ReactNode } from "react";
import SideNav from "@/components/layout/side-nav";
import Header from "@/components/layout/header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <Header />
      <div className="flex min-h-0 flex-1">
        <SideNav />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}

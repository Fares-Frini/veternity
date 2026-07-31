import { DashboardBanner } from "./_components/dashboard-banner";
import { StatsRow } from "./_components/stats-row";
import { AppointmentsStatusChart } from "./_components/appointments-status-chart";
import { SpeciesChart } from "./_components/species-chart";
import { UpcomingAppointments } from "./_components/upcoming-appointments";
import { QuickActions } from "./_components/quick-actions";

export default function DashboardHome() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <DashboardBanner />
      <StatsRow />
      <div className="grid grid-cols-1 divide-y divide-border border-b border-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <AppointmentsStatusChart />
        <SpeciesChart />
      </div>
      <div className="grid grid-cols-1 divide-y divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <UpcomingAppointments />
        <QuickActions />
      </div>
    </div>
  );
}

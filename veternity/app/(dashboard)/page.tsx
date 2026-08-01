import { DashboardBanner } from "./_components/dashboard-banner";
import { StatsRow } from "./_components/stats-row";
import { TodayAppointments } from "./_components/today-appointments";
import { NearestAlerts } from "./_components/nearest-alerts";
import { AppointmentsStatusChart } from "./_components/appointments-status-chart";
import { SpeciesChart } from "./_components/species-chart";
import { UpcomingAppointments } from "./_components/upcoming-appointments";
import { VetWorkloadChart } from "./_components/vet-workload-chart";
import { RecentActivity } from "./_components/recent-activity";

export default function DashboardHome() {
  return (
    <div className="overflow-hidden border border-border bg-card shadow-sm">
      <DashboardBanner />
      <StatsRow />
      <div className="grid grid-cols-1 divide-y divide-border border-b border-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <TodayAppointments />
        <NearestAlerts />
      </div>
      <div className="grid grid-cols-1 divide-y divide-border border-b border-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <AppointmentsStatusChart />
        <SpeciesChart />
      </div>
      <div className="grid grid-cols-1 divide-y divide-border border-b border-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <UpcomingAppointments />
        <VetWorkloadChart />
      </div>
      <RecentActivity />
    </div>
  );
}

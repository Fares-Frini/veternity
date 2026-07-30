import { DashboardBanner } from "./_components/dashboard-banner";
import { StatsRow } from "./_components/stats-row";
import { ConsultationsChart } from "./_components/consultations-chart";
import { RevenueChart } from "./_components/revenue-chart";
import { UpcomingReminders } from "./_components/upcoming-reminders";
import { RecentActivity } from "./_components/recent-activity";

export default function DashboardHome() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardBanner />
      <StatsRow />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ConsultationsChart />
        <RevenueChart />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UpcomingReminders />
        <RecentActivity />
      </div>
    </div>
  );
}

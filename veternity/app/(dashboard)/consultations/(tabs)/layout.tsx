import type { ReactNode } from "react";
import { ConsultationsBanner } from "./_components/consultations-banner";
import { ConsultationsTabs } from "./_components/consultations-tabs";

export default function ConsultationsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden border border-border bg-card shadow-sm">
      <ConsultationsBanner />
      <ConsultationsTabs />
      <div className="p-6">{children}</div>
    </div>
  );
}

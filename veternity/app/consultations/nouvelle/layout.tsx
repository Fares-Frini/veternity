import { PageThemeEffect } from "@/components/layout/page-theme-effect";
import type { ReactNode } from "react";
import { ConsultationShell } from "./_components/consultation-shell";
import { ConsultationDraftProvider } from "./_components/draft-context";

/** Le brouillon vit dans le layout : il survit à la navigation Consultation → Ordonnance → Facture. */
export default function NouvelleConsultationLayout({ children }: { children: ReactNode }) {
  return (
    <ConsultationDraftProvider>
      <PageThemeEffect />
      <ConsultationShell>{children}</ConsultationShell>
    </ConsultationDraftProvider>
  );
}

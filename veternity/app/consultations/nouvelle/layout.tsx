import type { ReactNode } from "react";
import { PageThemeEffect } from "@/components/layout/page-theme-effect";

export default function NouvelleConsultationLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageThemeEffect />
      {children}
    </>
  );
}

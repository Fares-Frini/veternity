import { PageThemeEffect } from "@/components/layout/page-theme-effect";
import type { ReactNode } from "react";

export default function NouvelleConsultationLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageThemeEffect />
      {children}
    </>
  );
}

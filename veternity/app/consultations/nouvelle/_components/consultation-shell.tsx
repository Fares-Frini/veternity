"use client";

import type { ReactNode } from "react";
import { AiChat } from "./ai-chat";
import { ConsultationStepper } from "./consultation-stepper";
import { useConsultationDraft } from "./draft-context";
import { EditorTopbar } from "./editor-topbar";

export function ConsultationShell({ children }: { children: ReactNode }) {
  const { animal } = useConsultationDraft();

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      <EditorTopbar
        title="Nouvelle consultation"
        subtitle={animal ? `${animal.name} · ${animal.owner}` : "Aucun patient sélectionné"}
        backHref="/consultations/liste"
        center={<ConsultationStepper />}
      />
      {children}
      <AiChat animal={animal} />
    </div>
  );
}

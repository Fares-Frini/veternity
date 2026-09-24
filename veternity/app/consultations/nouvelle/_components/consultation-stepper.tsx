"use client";

import { cn } from "@/lib/utils";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConsultationDraft } from "./draft-context";

export const STEP_HREFS = {
  consultation: "/consultations/nouvelle",
  ordonnance: "/consultations/nouvelle/prescription",
  facture: "/consultations/nouvelle/facture",
} as const;

const STEPS = [
  { href: STEP_HREFS.consultation, label: "Consultation" },
  { href: STEP_HREFS.ordonnance, label: "Ordonnance" },
  { href: STEP_HREFS.facture, label: "Facture" },
];

export function ConsultationStepper() {
  const pathname = usePathname();
  const { draft } = useConsultationDraft();

  const current = Math.max(0, STEPS.findIndex((s) => s.href === pathname));
  const done = [draft.consultationId !== null, draft.prescriptionStepDone, draft.invoiceId !== null];
  const reachable = [true, done[0], done[0] && done[1]];
  const locked = draft.invoiceId !== null;

  return (
    <nav aria-label="Étapes de la consultation" className="hidden md:block">
      <ol className="flex items-center gap-1.5">
        {STEPS.map((step, i) => {
          const isCurrent = i === current && !locked;
          const isDone = done[i] && !isCurrent;
          const canNavigate = reachable[i] && !isCurrent && !locked;

          const content = (
            <>
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                  isCurrent && "bg-primary-foreground text-primary",
                  isDone && "bg-primary-foreground/15",
                  !isCurrent && !isDone && "border border-primary-foreground/35 text-primary-foreground/65",
                )}
              >
                {isDone ? <HugeiconsIcon icon={Tick02Icon} className="h-3.5 w-3.5" strokeWidth={2.6} /> : i + 1}
              </span>
              <span
                className={cn("text-xs font-semibold", !isCurrent && !isDone && "text-primary-foreground/65")}
              >
                {step.label}
              </span>
            </>
          );

          return (
            <li key={step.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden className="h-px w-6 bg-primary-foreground/30 lg:w-10" />}
              {canNavigate ? (
                <Link
                  href={step.href}
                  className="flex items-center gap-2 rounded-full py-1 pr-3 pl-1 transition-colors hover:bg-primary-foreground/10"
                >
                  {content}
                </Link>
              ) : (
                <span aria-current={isCurrent ? "step" : undefined} className="flex items-center gap-2 py-1 pr-3 pl-1">
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

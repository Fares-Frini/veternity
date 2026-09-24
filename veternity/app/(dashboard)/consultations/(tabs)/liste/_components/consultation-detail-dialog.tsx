"use client";

import { ANIMALS } from "@/app/(dashboard)/animaux/_components/data";
import { SPECIES_COLOR } from "@/app/(dashboard)/animaux/_components/utils";
import { findInvoice } from "@/app/(dashboard)/inventory/_components/invoices-data";
import { InvoiceDocument } from "@/app/(dashboard)/consultations/_print/invoice-document";
import { PrescriptionDocument } from "@/app/(dashboard)/consultations/_print/prescription-document";
import { usePrint } from "@/app/(dashboard)/consultations/_print/use-print";
import { formatNumber } from "@/app/consultations/nouvelle/_components/catalog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Cancel01Icon, PrinterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import { ConsultationRecord, findPrescriptionFor } from "./consultation-record";
import type { Consultation } from "./data";
import { STATUS_META } from "./utils";

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
      <span className="truncate text-sm font-semibold text-foreground">{children}</span>
    </div>
  );
}

interface ConsultationDetailDialogProps {
  consultation: Consultation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConsultationDetailDialog({ consultation, open, onOpenChange }: ConsultationDetailDialogProps) {
  const { print, portal } = usePrint();
  const animal = consultation ? ANIMALS.find((a) => a.name === consultation.animal) : undefined;
  const invoice = findInvoice(consultation?.invoiceId);
  const prescription = consultation ? findPrescriptionFor(consultation) : undefined;
  const status = consultation ? STATUS_META[consultation.status] : null;
  const longDate = consultation
    ? new Date(consultation.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-2xl"
          showCloseButton={false}
        >
          {consultation && status && (
            <>
              <div className="relative flex shrink-0 items-center gap-3 bg-primary py-4 pr-14 pl-6 text-primary-foreground">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`text-sm font-bold ${SPECIES_COLOR[consultation.species] ?? "bg-card"}`}>
                    {consultation.animal.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <DialogHeader className="min-w-0 flex-1 gap-0.5">
                  <DialogTitle className="truncate text-sm font-bold text-primary-foreground">
                    {consultation.animal} · consultation du {longDate}
                  </DialogTitle>
                  <DialogDescription className="truncate text-xs text-primary-foreground/75">
                    #{consultation.id} · {consultation.owner}
                  </DialogDescription>
                </DialogHeader>
                <Badge className={`shrink-0 ${status.bg} ${status.text}`}>{consultation.status}</Badge>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="absolute top-1/2 right-4 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-primary-foreground/15 transition-colors hover:bg-primary-foreground/25"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="h-3.5 w-3.5" strokeWidth={2.4} />
                  <span className="sr-only">Fermer</span>
                </button>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
                <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted p-4 sm:grid-cols-4">
                  <Fact label="Propriétaire">{consultation.owner}</Fact>
                  <Fact label="Vétérinaire">{consultation.vet}</Fact>
                  <Fact label="Espèce">{animal ? `${consultation.species} · ${animal.breed}` : consultation.species}</Fact>
                  <Fact label="Poids">{formatNumber(consultation.weightKg, 2)} kg</Fact>
                </div>
                <ConsultationRecord consultation={consultation} wide />
              </div>

              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/50 px-6 py-4">
                <span className="text-sm text-muted-foreground">
                  {invoice ? (
                    <>
                      Facture <span className="font-mono text-foreground">{invoice.id}</span>
                      <Badge variant={invoice.status === "Payée" ? "success" : "warning"} className="ml-2">
                        {invoice.status === "Payée" ? "Payée" : "À régler"}
                      </Badge>
                    </>
                  ) : (
                    "Aucune facture émise"
                  )}
                </span>
                <div className="flex items-center gap-2">
                  {prescription && (
                    <Button type="button" variant="outline" onClick={() => print(<PrescriptionDocument prescription={prescription} />)}>
                      <HugeiconsIcon icon={PrinterIcon} strokeWidth={2.2} />
                      Imprimer l&apos;ordonnance
                    </Button>
                  )}
                  {invoice && (
                    <Button type="button" onClick={() => print(<InvoiceDocument invoice={invoice} />)}>
                      <HugeiconsIcon icon={PrinterIcon} strokeWidth={2.2} />
                      Imprimer la facture
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {portal}
    </>
  );
}

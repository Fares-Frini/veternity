"use client";

import { CLIENTS } from "@/app/(dashboard)/clients/_components/data";
import { InvoiceDocument } from "@/app/(dashboard)/consultations/_print/invoice-document";
import { PrescriptionDocument } from "@/app/(dashboard)/consultations/_print/prescription-document";
import { usePrint } from "@/app/(dashboard)/consultations/_print/use-print";
import { formatDate } from "@/app/(dashboard)/consultations/(tabs)/liste/_components/utils";
import { PRESCRIPTIONS, type Prescription } from "@/app/(dashboard)/consultations/(tabs)/prescriptions/_components/data";
import {
  PAYMENT_METHODS,
  nextInvoiceNumber,
  type Invoice,
  type PaymentMethod,
} from "@/app/(dashboard)/inventory/_components/invoices-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  PlusSignIcon,
  PrinterIcon,
  Undo02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { formatPrice } from "../_components/catalog";
import { STEP_HREFS } from "../_components/consultation-stepper";
import {
  computeTotals,
  parseAmount,
  uid,
  useConsultationDraft,
  type CustomInvoiceLine,
  type InvoiceLine,
} from "../_components/draft-context";
import { DataLabel } from "../_components/form-section";
import { MissingDraft } from "../_components/missing-draft";
import { PatientCard } from "../_components/patient-card";
import { saveInvoice } from "../_components/persist";
import { StockImpact } from "../_components/stock-impact";
import { RailHeading, RailSection, RailTotal, SummaryRail, Workspace } from "../_components/workspace";

function AmountInput({
  value,
  onChange,
  label,
  suffix = "DH",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative w-28", className)}>
      <Input
        type="number"
        inputMode="decimal"
        min="0"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="h-8 border-transparent bg-muted pr-9 text-right tabular-nums hover:border-input focus-visible:bg-card"
      />
      <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-muted-foreground">
        {suffix}
      </span>
    </div>
  );
}

function GeneratedRow({ line }: { line: InvoiceLine }) {
  const { draft, update } = useConsultationDraft();
  const override = draft.priceOverrides[line.key];
  const price = parseAmount(override) ?? line.catalogPrice;
  const modified = override !== undefined && price !== line.catalogPrice;
  const nested = line.kind === "product";

  const setOverride = (value: string) =>
    update((d) => ({ priceOverrides: { ...d.priceOverrides, [line.key]: value } }));
  const resetOverride = () =>
    update((d) => {
      const priceOverrides = { ...d.priceOverrides };
      delete priceOverrides[line.key];
      return { priceOverrides };
    });

  return (
    <TableRow className="hover:bg-transparent">
      <TableCell className="py-2.5 whitespace-normal">
        <div className={cn("flex flex-col leading-tight", nested && "ml-1 border-l-2 border-border pl-3")}>
          <span className={cn("text-sm text-foreground", nested ? "font-normal" : "font-medium")}>{line.label}</span>
          {modified ? (
            <span className="text-xs text-status-warning">Tarif catalogue : {formatPrice(line.catalogPrice)}</span>
          ) : (
            line.detail && <span className="text-xs text-muted-foreground">{line.detail}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right text-muted-foreground tabular-nums">{line.quantity}</TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          {modified && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={resetOverride}
              aria-label={`Rétablir le tarif catalogue de ${formatPrice(line.catalogPrice)}`}
              title="Rétablir le tarif catalogue"
            >
              <HugeiconsIcon icon={Undo02Icon} strokeWidth={2.2} />
            </Button>
          )}
          <AmountInput
            value={override ?? String(line.catalogPrice)}
            onChange={setOverride}
            label={`Prix unitaire : ${line.label}`}
          />
        </div>
      </TableCell>
      <TableCell className="text-right font-semibold text-foreground tabular-nums">
        {formatPrice(price * line.quantity)}
      </TableCell>
      <TableCell />
    </TableRow>
  );
}

function CustomRow({ line }: { line: CustomInvoiceLine }) {
  const { update } = useConsultationDraft();
  const set = (patch: Partial<CustomInvoiceLine>) =>
    update((d) => ({ customLines: d.customLines.map((l) => (l.uid === line.uid ? { ...l, ...patch } : l)) }));
  const amount = (parseAmount(line.quantity) ?? 0) * (parseAmount(line.unitPrice) ?? 0);

  return (
    <TableRow className="hover:bg-transparent">
      <TableCell className="py-2.5">
        <Input
          autoFocus={line.label === ""}
          value={line.label}
          onChange={(e) => set({ label: e.target.value })}
          placeholder="Désignation — ex : Collerette"
          aria-label="Désignation de la ligne"
          className="h-8 bg-muted"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          inputMode="numeric"
          min="0"
          value={line.quantity}
          onChange={(e) => set({ quantity: e.target.value })}
          aria-label="Quantité"
          className="ml-auto h-8 w-14 bg-muted text-right tabular-nums"
        />
      </TableCell>
      <TableCell>
        <AmountInput
          value={line.unitPrice}
          onChange={(unitPrice) => set({ unitPrice })}
          label="Prix unitaire"
          className="ml-auto"
        />
      </TableCell>
      <TableCell className="text-right font-semibold text-foreground tabular-nums">{formatPrice(amount)}</TableCell>
      <TableCell className="w-8 pr-0">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => update((d) => ({ customLines: d.customLines.filter((l) => l.uid !== line.uid) }))}
          aria-label="Supprimer la ligne"
        >
          <HugeiconsIcon icon={Delete02Icon} className="text-muted-foreground" strokeWidth={2} />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{children}</dd>
    </div>
  );
}

interface IssuedConsultation {
  invoice: Invoice;
  prescription?: Prescription;
  stockCount: number;
}

function InvoiceDone({ invoice, prescription, stockCount }: IssuedConsultation) {
  const router = useRouter();
  const { reset } = useConsultationDraft();
  const { print, portal } = usePrint();
  const medCount = prescription?.lines?.length ?? 0;

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto bg-muted p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-xl bg-card p-8 text-center shadow-2xl">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-status-success-bg text-status-success">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-7 w-7" strokeWidth={2} />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-extrabold text-foreground">Consultation clôturée</h2>
          <p className="text-sm text-muted-foreground">Le dossier de {invoice.animal} est à jour.</p>
        </div>

        <dl className="w-full divide-y divide-border rounded-lg border border-border text-left text-sm">
          <SummaryRow label="Facture">
            <span className="font-mono">{invoice.id}</span>
          </SummaryRow>
          <SummaryRow label="Montant">
            <span className="font-bold tabular-nums">{formatPrice(invoice.total)}</span>
          </SummaryRow>
          <SummaryRow label="Règlement">
            {invoice.status === "Payée" ? `Encaissée · ${invoice.paymentMethod}` : "À régler"}
          </SummaryRow>
          <SummaryRow label="Ordonnance">
            {prescription ? `${medCount} médicament${medCount > 1 ? "s" : ""}` : "Aucune"}
          </SummaryRow>
          <SummaryRow label="Stock">
            {stockCount > 0 ? `${stockCount} produit${stockCount > 1 ? "s" : ""} déduit${stockCount > 1 ? "s" : ""}` : "Inchangé"}
          </SummaryRow>
        </dl>

        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Button type="button" size="lg" className="h-10 flex-1" onClick={() => print(<InvoiceDocument invoice={invoice} />)}>
            <HugeiconsIcon icon={PrinterIcon} strokeWidth={2.2} data-icon="inline-start" />
            Imprimer la facture
          </Button>
          {prescription && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-10 flex-1"
              onClick={() => print(<PrescriptionDocument prescription={prescription} />)}
            >
              <HugeiconsIcon icon={PrinterIcon} strokeWidth={2.2} data-icon="inline-start" />
              Imprimer l&apos;ordonnance
            </Button>
          )}
        </div>

        <div className="flex w-full items-center justify-between gap-2 border-t border-border pt-4">
          <Button asChild variant="ghost" className="text-muted-foreground">
            <Link href="/consultations/liste">Voir les consultations</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              router.push(STEP_HREFS.consultation);
            }}
          >
            Nouvelle consultation
          </Button>
        </div>
      </div>
      {portal}
    </div>
  );
}

export default function FacturePage() {
  const { draft, animal, update } = useConsultationDraft();
  const [issued, setIssued] = useState<IssuedConsultation | null>(null);

  if (issued) return <InvoiceDone {...issued} />;
  if (!draft.consultationId || !animal) return <MissingDraft step="facture" />;

  const { lines, subtotal, discountPct, discount, total } = computeTotals(draft);
  const client = CLIENTS.find((c) => c.name === animal.owner);
  const stockMoves = Object.entries(draft.committedStock).filter(([, qty]) => qty > 0);
  const issueDate = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const addCustomLine = () =>
    update((d) => ({ customLines: [...d.customLines, { uid: uid("line"), label: "", quantity: "1", unitPrice: "" }] }));

  const modifiedCount = lines.filter(
    (l) => draft.priceOverrides[l.key] !== undefined && parseAmount(draft.priceOverrides[l.key]) !== l.catalogPrice,
  ).length;

  const handleValidate = () => {
    const invoice = saveInvoice(draft, animal);
    update({ invoiceId: invoice.id });
    setIssued({
      invoice,
      prescription: PRESCRIPTIONS.find((p) => p.id === draft.prescriptionId),
      stockCount: stockMoves.length,
    });
  };

  return (
    <Workspace
      left={
        <>
          <div className="border-b border-border p-4">
            <PatientCard animal={animal} asOfDate={draft.date} />
          </div>
          {client && (
            <div className="flex flex-col gap-2 border-b border-border p-4">
              <RailHeading>Client</RailHeading>
              <div className="flex flex-col gap-0.5 text-sm">
                <span className="font-semibold text-foreground">{client.name}</span>
                <span className="text-muted-foreground">{client.phone}</span>
                <span className="truncate text-muted-foreground">{client.email}</span>
                <span className="text-muted-foreground">{client.address}</span>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3 p-4">
            <RailHeading aside={<span className="text-xs text-muted-foreground">Déjà déduites</span>}>
              Sorties de stock
            </RailHeading>
            <StockImpact emptyText="Aucun produit consommé pendant cette consultation." />
          </div>
        </>
      }
      right={
        <SummaryRail
          title="Paiement"
          footer={
            <>
              <RailTotal label="Total à payer" value={formatPrice(total)} detail={draft.paid ? "Encaissée" : "À régler"} />
              <Button type="button" size="lg" onClick={handleValidate} className="h-10 w-full">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2.2} data-icon="inline-start" />
                Valider la facture
              </Button>
              <Button asChild variant="ghost" className="w-full text-muted-foreground">
                <Link href={STEP_HREFS.ordonnance}>
                  <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2.2} data-icon="inline-start" />
                  Retour à l&apos;ordonnance
                </Link>
              </Button>
            </>
          }
        >
          <RailSection label="Statut">
            <ToggleGroup
              type="single"
              variant="outline"
              spacing={0}
              value={draft.paid ? "paid" : "due"}
              onValueChange={(v) => v && update({ paid: v === "paid" })}
              className="w-full"
              aria-label="Statut du paiement"
            >
              <ToggleGroupItem value="paid" className="h-10 flex-1 data-[state=on]:bg-primary/12 data-[state=on]:font-semibold">
                Encaissée
              </ToggleGroupItem>
              <ToggleGroupItem value="due" className="h-10 flex-1 data-[state=on]:bg-primary/12 data-[state=on]:font-semibold">
                À régler
              </ToggleGroupItem>
            </ToggleGroup>
          </RailSection>
          <RailSection label={draft.paid ? "Mode de règlement" : "Mode de règlement prévu"}>
            <Select value={draft.paymentMethod} onValueChange={(v) => update({ paymentMethod: v as PaymentMethod })}>
              <SelectTrigger aria-label="Mode de règlement" className="h-10! w-full bg-muted">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </RailSection>
          {modifiedCount > 0 && (
            <p className="rounded-lg bg-status-warning-bg px-3 py-2 text-xs font-medium text-status-warning">
              {modifiedCount} tarif{modifiedCount > 1 ? "s" : ""} modifié{modifiedCount > 1 ? "s" : ""} par rapport au
              catalogue
            </p>
          )}
        </SummaryRail>
      }
    >
    <article className="flex flex-col gap-8 rounded-xl border border-border bg-card p-6 shadow-sm lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <DataLabel>Facture</DataLabel>
          <span className="font-mono text-2xl font-bold tracking-tight text-foreground">{nextInvoiceNumber()}</span>
        </div>
        <div className="flex flex-col text-right text-sm leading-snug">
          <span className="text-foreground">Émise le {issueDate}</span>
          <span className="text-muted-foreground">
            Consultation #{draft.consultationId} · {draft.vet}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl bg-muted p-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <DataLabel>Facturé à</DataLabel>
          <span className="text-sm font-semibold text-foreground">{animal.owner}</span>
          {client && <span className="text-sm text-muted-foreground">{client.phone}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <DataLabel>Patient</DataLabel>
          <span className="text-sm font-semibold text-foreground">{animal.name}</span>
          <span className="text-sm text-muted-foreground">
            {animal.species} · consultation du {formatDate(draft.date)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-0 text-xs text-muted-foreground">Désignation</TableHead>
              <TableHead className="w-14 text-right text-xs text-muted-foreground">Qté</TableHead>
              <TableHead className="w-40 text-right text-xs text-muted-foreground">Prix unitaire</TableHead>
              <TableHead className="w-28 text-right text-xs text-muted-foreground">Montant</TableHead>
              <TableHead className="w-8 pr-0" />
            </TableRow>
          </TableHeader>
          <TableBody className="[&_td:first-child]:pl-0">
            {lines.map((line) => (
              <GeneratedRow key={line.key} line={line} />
            ))}
            {draft.customLines.map((line) => (
              <CustomRow key={line.uid} line={line} />
            ))}
          </TableBody>
        </Table>
        <Button type="button" variant="ghost" size="sm" onClick={addCustomLine} className="w-fit">
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2.4} />
          Ajouter une ligne
        </Button>
      </div>

      <dl className="ml-auto flex w-full max-w-xs flex-col gap-2.5 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Sous-total</dt>
          <dd className="text-foreground tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt>
            <Label htmlFor="invoice-discount" className="font-normal text-muted-foreground">
              Remise
            </Label>
          </dt>
          <dd className="flex items-center gap-3">
            <div className="relative w-20">
              <Input
                id="invoice-discount"
                type="number"
                inputMode="decimal"
                min="0"
                max="100"
                value={draft.discountPct}
                onChange={(e) => update({ discountPct: e.target.value })}
                placeholder="0"
                className="h-8 border-transparent bg-muted pr-7 text-right tabular-nums hover:border-input focus-visible:bg-card"
              />
              <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-muted-foreground">
                %
              </span>
            </div>
            <span className="w-24 text-right text-foreground tabular-nums">
              {discountPct > 0 ? `−${formatPrice(discount)}` : "—"}
            </span>
          </dd>
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-border pt-3">
          <dt className="font-semibold text-foreground">Total à payer</dt>
          <dd className="text-xl font-extrabold text-foreground tabular-nums">{formatPrice(total)}</dd>
        </div>
      </dl>
      </article>
    </Workspace>
  );
}

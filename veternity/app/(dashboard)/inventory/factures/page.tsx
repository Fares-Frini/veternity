"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { Camera01Icon, CloudUploadIcon, Image01Icon, Pdf01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef, useState, type DragEvent } from "react";
import { useInventoryVersion } from "../_components/inventory-store";
import { formatAmount, formatShortDate } from "../_components/inventory-ui";
import {
  SUPPLIER_INVOICES,
  importInvoiceFile,
  isLineResolved,
  type OcrStatus,
  type SupplierInvoice,
} from "../_components/supplier-invoices-data";
import { findSupplier } from "../_components/suppliers-data";
import { ReviewDialog } from "./_components/review-dialog";

const ACCEPTED = "application/pdf,image/jpeg,image/png,image/heic";

const STATUS_BADGE: Record<OcrStatus, { variant: "info" | "warning" | "success" | "danger"; label: string }> = {
  Analyse: { variant: "info", label: "Lecture en cours" },
  "À vérifier": { variant: "warning", label: "À vérifier" },
  Intégrée: { variant: "success", label: "Intégrée au stock" },
  Échec: { variant: "danger", label: "Échec de lecture" },
};

const FILTERS: { value: OcrStatus | "all"; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "À vérifier", label: "À vérifier" },
  { value: "Analyse", label: "En lecture" },
  { value: "Intégrée", label: "Intégrées" },
  { value: "Échec", label: "Échecs" },
];

function UploadZone() {
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const importFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((f) => importInvoiceFile(f));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    importFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "flex flex-col items-center gap-4 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
        dragging ? "border-primary bg-primary/8" : "border-border bg-muted/40",
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 text-foreground">
        <HugeiconsIcon icon={CloudUploadIcon} className="h-6 w-6" strokeWidth={2} />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">Déposez vos factures fournisseurs ici</p>
        <p className="max-w-lg text-sm text-muted-foreground">
          PDF, JPG ou PNG, plusieurs fichiers à la fois. La lecture automatique relève le fournisseur, les produits, les lots,
          les péremptions, les quantités et les prix.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" size="lg" onClick={() => fileInput.current?.click()} className="px-4">
          Choisir des fichiers
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => cameraInput.current?.click()} className="bg-card px-4">
          <HugeiconsIcon icon={Camera01Icon} strokeWidth={2.2} data-icon="inline-start" />
          Prendre une photo
        </Button>
      </div>
      <ol className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        {["Import", "Lecture automatique", "Vous vérifiez", "Entrée en stock"].map((step, i) => (
          <li key={step} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>→</span>}
            <span>
              <span className="font-semibold text-foreground tabular-nums">{i + 1}.</span> {step}
            </span>
          </li>
        ))}
      </ol>
      <input
        ref={fileInput}
        type="file"
        accept={ACCEPTED}
        multiple
        hidden
        onChange={(e) => {
          importFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={cameraInput}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => {
          importFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function ReadingCell({ invoice }: { invoice: SupplierInvoice }) {
  if (invoice.status === "Analyse") {
    return (
      <div className="flex w-32 flex-col gap-1">
        <span className="text-xs text-muted-foreground tabular-nums">Lecture… {invoice.progress} %</span>
        <div className="h-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-status-info transition-all duration-300" style={{ width: `${invoice.progress}%` }} />
        </div>
      </div>
    );
  }
  if (invoice.status === "Échec") return <span className="text-xs text-status-danger">Illisible</span>;
  const pct = Math.round((invoice.confidence ?? 0) * 100);
  const pending = invoice.lines.filter((l) => !isLineResolved(l) || l.uncertain.length > 0).length;
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-sm text-foreground tabular-nums">{pct} %</span>
      {invoice.status === "À vérifier" && pending > 0 && (
        <span className="text-xs text-status-warning">
          {pending} ligne{pending > 1 ? "s" : ""} à revoir
        </span>
      )}
    </div>
  );
}

export default function FacturesPage() {
  useInventoryVersion();
  const [filter, setFilter] = useState<OcrStatus | "all">("all");
  const [reviewing, setReviewing] = useState<SupplierInvoice | null>(null);

  const counts = Object.fromEntries(FILTERS.map((f) => [f.value, f.value === "all" ? SUPPLIER_INVOICES.length : SUPPLIER_INVOICES.filter((i) => i.status === f.value).length]));
  const shown = filter === "all" ? SUPPLIER_INVOICES : SUPPLIER_INVOICES.filter((i) => i.status === filter);

  return (
    <div className="flex flex-col gap-5">
      <UploadZone />

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            spacing={0}
            value={filter}
            onValueChange={(v) => v && setFilter(v as OcrStatus | "all")}
            aria-label="Statut"
            className="flex-wrap"
          >
            {FILTERS.map((f) => (
              <ToggleGroupItem key={f.value} value={f.value} className="px-3 data-[state=on]:bg-primary/12 data-[state=on]:font-semibold">
                {f.label} <span className="text-muted-foreground tabular-nums">{counts[f.value]}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <span className="text-xs text-muted-foreground">Rien n&apos;entre en stock sans votre validation.</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="pl-5 text-muted-foreground">Document</TableHead>
              <TableHead className="text-muted-foreground">Fournisseur</TableHead>
              <TableHead className="text-muted-foreground">Facture</TableHead>
              <TableHead className="text-right text-muted-foreground">Montant HT</TableHead>
              <TableHead className="text-muted-foreground">Lecture</TableHead>
              <TableHead className="text-muted-foreground">Statut</TableHead>
              <TableHead className="pr-5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((inv) => {
              const status = STATUS_BADGE[inv.status];
              const supplier = findSupplier(inv.supplierId);
              const openable = inv.status !== "Analyse";
              return (
                <TableRow
                  key={inv.id}
                  tabIndex={openable ? 0 : undefined}
                  onClick={() => openable && setReviewing(inv)}
                  onKeyDown={(e) => {
                    if (openable && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      setReviewing(inv);
                    }
                  }}
                  className={cn("border-border", openable && "cursor-pointer outline-none focus-visible:bg-muted")}
                >
                  <TableCell className="py-3 pl-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <HugeiconsIcon icon={inv.fileType === "pdf" ? Pdf01Icon : Image01Icon} className="h-4.5 w-4.5" strokeWidth={2} />
                      </span>
                      <div className="flex min-w-0 flex-col leading-tight">
                        <span className="max-w-64 truncate font-medium text-foreground">{inv.fileName}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {inv.id} · importée le {formatShortDate(inv.uploadedAt)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {supplier?.name ?? <span className="text-muted-foreground">{inv.status === "Analyse" ? "…" : "Non détecté"}</span>}
                  </TableCell>
                  <TableCell>
                    {inv.number ? (
                      <div className="flex flex-col leading-tight">
                        <span className="font-mono text-xs text-foreground">{inv.number}</span>
                        {inv.date && <span className="text-xs text-muted-foreground tabular-nums">{formatShortDate(inv.date)}</span>}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground tabular-nums">
                    {inv.totalRead !== undefined ? formatAmount(inv.totalRead) : "—"}
                  </TableCell>
                  <TableCell>
                    <ReadingCell invoice={inv} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    {inv.status === "À vérifier" && (
                      <Button type="button" size="sm" onClick={() => setReviewing(inv)}>
                        Vérifier
                      </Button>
                    )}
                    {(inv.status === "Intégrée" || inv.status === "Échec") && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => setReviewing(inv)}>
                        {inv.status === "Échec" ? "Détails" : "Voir"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {shown.length === 0 && (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  Aucune facture dans cette catégorie.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ReviewDialog invoice={reviewing} onClose={() => setReviewing(null)} />
    </div>
  );
}

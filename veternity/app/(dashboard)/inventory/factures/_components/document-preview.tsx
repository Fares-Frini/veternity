import { formatAmount, formatShortDate } from "../../_components/inventory-ui";
import { ocrLinesTotal, type SupplierInvoice } from "../../_components/supplier-invoices-data";

/**
 * Aperçu du document. Un fichier importé pendant la session est affiché tel quel ;
 * les factures de démonstration n'ont pas de fichier, on reconstitue donc une page à partir de la lecture.
 */
export function DocumentPreview({ invoice }: { invoice: SupplierInvoice }) {
  if (invoice.fileUrl && invoice.fileType === "pdf") {
    return <iframe src={invoice.fileUrl} title={invoice.fileName} className="h-full min-h-[480px] w-full rounded-md bg-card" />;
  }
  if (invoice.fileUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- fichier local (blob:), non optimisable par next/image
    return <img src={invoice.fileUrl} alt={invoice.fileName} className="mx-auto max-w-full rounded-md shadow-md" />;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="mx-auto flex aspect-[1/1.414] w-full max-w-[520px] flex-col gap-5 rounded-sm bg-white p-8 font-mono text-[11px] leading-relaxed text-neutral-700 shadow-md">
        {invoice.status === "Échec" ? (
          <div className="flex flex-1 flex-col gap-3 blur-[2px]">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="h-2.5 rounded bg-neutral-300" style={{ width: `${40 + ((i * 37) % 55)}%` }} />
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-neutral-900">{invoice.supplierNameRead}</span>
                <span>Distribution de produits vétérinaires</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="font-bold text-neutral-900">FACTURE</span>
                <span>N° {invoice.number}</span>
                {invoice.date && <span>Date : {formatShortDate(invoice.date)}</span>}
              </div>
            </div>
            <div className="border-y border-neutral-300 py-2">
              <span>Client : CLINIQUE VETERINAIRE VETERNITY</span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-300 text-left">
                  <th className="py-1 font-bold">Désignation</th>
                  <th className="py-1 font-bold">Lot</th>
                  <th className="py-1 font-bold">Pér.</th>
                  <th className="py-1 text-right font-bold">Qté</th>
                  <th className="py-1 text-right font-bold">P.U.</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lines.map((l) => (
                  <tr key={l.id} className="align-top">
                    <td className="py-1 pr-2">{l.rawText}</td>
                    <td className="py-1 pr-2">{l.lot}</td>
                    <td className="py-1 pr-2">{l.expiry.slice(2, 7).split("-").reverse().join("/")}</td>
                    <td className="py-1 text-right">{l.quantity}</td>
                    <td className="py-1 text-right">{l.unitPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-auto flex justify-end border-t border-neutral-300 pt-2">
              <span className="font-bold text-neutral-900">
                TOTAL HT {formatAmount(invoice.totalRead ?? ocrLinesTotal(invoice.lines))}
              </span>
            </div>
          </>
        )}
      </div>
      <p className="text-center text-xs text-muted-foreground">Aperçu reconstitué · facture de démonstration sans fichier joint</p>
    </div>
  );
}

import { ANIMALS } from "@/app/(dashboard)/animaux/_components/data";
import { CLIENTS } from "@/app/(dashboard)/clients/_components/data";
import { CONSULTATIONS } from "@/app/(dashboard)/consultations/(tabs)/liste/_components/data";
import type { Invoice } from "@/app/(dashboard)/inventory/_components/invoices-data";
import { formatPrice } from "@/app/consultations/nouvelle/_components/catalog";
import { DocFooter, DocHeader, DocLabel, DocParty, DocSheet, formatDocDate } from "./document-parts";

export function InvoiceDocument({ invoice }: { invoice: Invoice }) {
  const client = CLIENTS.find((c) => c.name === invoice.client);
  const animal = ANIMALS.find((a) => a.name === invoice.animal);
  const consultation = CONSULTATIONS.find((c) => c.id === invoice.consultationId);
  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discount = (subtotal * invoice.discountPct) / 100;

  return (
    <DocSheet>
      <DocHeader title="Facture" reference={invoice.id} date={invoice.date} />

      <section className="grid grid-cols-3 gap-6">
        <DocParty label="Facturé à" name={invoice.client} lines={[client?.phone, client?.address]} />
        <DocParty
          label="Patient"
          name={invoice.animal}
          lines={[animal ? `${animal.species} · ${animal.breed}` : undefined]}
        />
        {consultation && (
          <DocParty
            label="Consultation"
            name={`#${consultation.id}`}
            lines={[`${formatDocDate(consultation.date)}`, consultation.vet]}
          />
        )}
      </section>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-y border-border bg-muted text-left">
            <th className="py-2 pl-3 font-normal"><DocLabel>Désignation</DocLabel></th>
            <th className="w-14 py-2 text-right font-normal"><DocLabel>Qté</DocLabel></th>
            <th className="w-28 py-2 text-right font-normal"><DocLabel>Prix unitaire</DocLabel></th>
            <th className="w-28 py-2 pr-3 text-right font-normal"><DocLabel>Montant</DocLabel></th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i} className="border-b border-border">
              <td className="py-2.5 pl-3">{item.label}</td>
              <td className="py-2.5 text-right tabular-nums">{item.quantity}</td>
              <td className="py-2.5 text-right tabular-nums">{formatPrice(item.unitPrice)}</td>
              <td className="py-2.5 pr-3 text-right font-semibold tabular-nums">{formatPrice(item.quantity * item.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="flex items-start justify-between gap-8">
        <div className="flex max-w-[45%] flex-col gap-1">
          <DocLabel>Règlement</DocLabel>
          <span className="mt-1 font-semibold">{invoice.status === "Payée" ? "Acquittée" : "À régler"}</span>
          <span className="text-muted-foreground">
            {invoice.status === "Payée"
              ? `Réglée le ${formatDocDate(invoice.date)} · ${invoice.paymentMethod}`
              : `Mode de règlement prévu : ${invoice.paymentMethod}`}
          </span>
        </div>
        <dl className="flex w-64 flex-col gap-1.5">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Sous-total</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          {invoice.discountPct > 0 && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Remise {invoice.discountPct} %</dt>
              <dd className="tabular-nums">−{formatPrice(discount)}</dd>
            </div>
          )}
          <div className="mt-1 flex items-baseline justify-between gap-4 border-t-2 border-foreground pt-2">
            <dt className="font-semibold">Total</dt>
            <dd className="text-lg font-extrabold tabular-nums">{formatPrice(invoice.total)}</dd>
          </div>
        </dl>
      </section>

      <DocFooter>Veternity · Clinique vétérinaire · Facture {invoice.id} · Merci de votre confiance.</DocFooter>
    </DocSheet>
  );
}

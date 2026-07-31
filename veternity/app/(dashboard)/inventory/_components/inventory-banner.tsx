import { BoxIcon } from "@/components/layout/icons";

export function InventoryBanner() {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-[#00b3a4] via-[#00998e] to-[#00706a] px-8 py-9 text-white">
      <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

      <div className="relative z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
          <BoxIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
          Gestion de stock
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Inventaire</h1>
        <p className="mt-1.5 max-w-md text-sm text-white/80">
          Stock, achats, ventes, factures et fournisseurs de la clinique.
        </p>
      </div>
    </div>
  );
}

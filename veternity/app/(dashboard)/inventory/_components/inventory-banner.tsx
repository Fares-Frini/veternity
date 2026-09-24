import AnimatedCharacters from "@/components/animated-characters/AnimatedCharacters";
import { BoxIcon } from "@/components/layout/icons";
import { Upload04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export function InventoryBanner() {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-[color-mix(in_srgb,var(--primary)_78%,white)] via-primary to-[color-mix(in_srgb,var(--primary)_65%,black)] px-8 py-9 text-primary-foreground transition-colors duration-300 ease-out">
      <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-primary-foreground/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-primary-foreground/10 blur-2xl" />

      <div className="pointer-events-none absolute right-8 bottom-0 z-0 hidden origin-bottom-right scale-[0.32] lg:block">
        <AnimatedCharacters entrance mirrored characters={["horse"]} />
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Link
          href="/inventory/factures"
          aria-label="Importer une facture fournisseur"
          title="Importer une facture fournisseur"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15 backdrop-blur-sm transition-colors hover:bg-primary-foreground/25"
        >
          <HugeiconsIcon icon={Upload04Icon} className="h-4 w-4" strokeWidth={2.4} />
        </Link>
      </div>

      <div className="relative z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
          <BoxIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
          Gestion de stock
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Inventaire</h1>
        <p className="mt-1.5 max-w-md text-sm text-primary-foreground/80">
          Stock de médicaments, ventes et achats, factures fournisseurs et fournisseurs de la clinique.
        </p>
      </div>
    </div>
  );
}

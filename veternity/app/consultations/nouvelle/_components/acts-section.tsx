"use client";

import type { Animal } from "@/app/(dashboard)/animaux/_components/data";
import { formatMoney } from "@/app/(dashboard)/_components/bilan-data";
import { STOCK, findStockItem, formatQuantity } from "@/app/(dashboard)/inventory/_components/stock-data";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Delete02Icon,
  FirstAidKitIcon,
  PlusSignIcon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, type ReactNode } from "react";
import { ACTS, ACT_GROUPS, getAct, type ActDefinition } from "./catalog";
import {
  actAmount,
  availableStock,
  stockUsage,
  uid,
  useConsultationDraft,
  type PerformedAct,
} from "./draft-context";
import { FormSection } from "./form-section";
import { QuantityStepper } from "./quantity-stepper";
import { StockProjection } from "./stock-projection";

function PickerRow({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left outline-none hover:bg-muted focus-visible:bg-muted disabled:pointer-events-none disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function ActPicker({ animal, onPick }: { animal: Animal | null; onPick: (act: ActDefinition, productId?: string) => void }) {
  const { draft } = useConsultationDraft();
  const [query, setQuery] = useState("");
  const [productAct, setProductAct] = useState<ActDefinition | null>(null);
  const usage = stockUsage(draft);

  if (productAct) {
    const species = animal?.species;
    const products = STOCK.filter((s) => s.category === productAct.productCategory);
    const groups = species
      ? [
          { title: `Indiqués pour : ${species.toLowerCase()}`, items: products.filter((p) => p.species.includes(species)) },
          { title: "Autres espèces", items: products.filter((p) => !p.species.includes(species)) },
        ]
      : [{ title: "En stock", items: products }];

    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2 border-b border-border px-2 py-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setProductAct(null)}
            aria-label="Retour à la liste des actes"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2.2} />
          </Button>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground">{productAct.label}</span>
            <span className="text-xs text-muted-foreground">
              {productAct.productPrompt} · acte {formatMoney(productAct.price)} + produit
            </span>
          </div>
        </div>
        <div className="flex max-h-80 flex-col overflow-y-auto p-1">
          {groups.map((group) =>
            group.items.length === 0 ? null : (
              <div key={group.title} className="flex flex-col gap-0.5 pb-1">
                <span className="px-2.5 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {group.title}
                </span>
                {group.items.map((product) => {
                  const remaining = availableStock(product.id, draft) - (usage[product.id] ?? 0);
                  const low = remaining <= product.alertThreshold;
                  return (
                    <PickerRow key={product.id} onClick={() => onPick(productAct, product.id)} disabled={remaining <= 0}>
                      <span className="flex min-w-0 flex-1 flex-col leading-tight">
                        <span className="truncate text-sm font-medium text-foreground">{product.name}</span>
                        <span className="truncate text-xs text-muted-foreground">{product.species.join(", ")}</span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end leading-tight">
                        <span className="text-sm text-foreground tabular-nums">{formatMoney(product.unitPrice)}</span>
                        <span
                          className={cn(
                            "text-xs tabular-nums",
                            remaining <= 0 ? "text-status-danger" : low ? "text-status-warning" : "text-muted-foreground",
                          )}
                        >
                          {remaining <= 0 ? "Rupture" : `${formatQuantity(product, remaining)} en stock`}
                        </span>
                      </span>
                    </PickerRow>
                  );
                })}
              </div>
            ),
          )}
        </div>
      </div>
    );
  }

  const q = query.trim().toLowerCase();
  const matches = ACTS.filter((a) => !q || `${a.label} ${a.hint}`.toLowerCase().includes(q));

  return (
    <div className="flex flex-col">
      <div className="relative border-b border-border">
        <HugeiconsIcon
          icon={Search01Icon}
          className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={2}
        />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un acte…"
          aria-label="Rechercher un acte"
          className="h-11 w-full bg-transparent pr-3 pl-10 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex max-h-80 flex-col overflow-y-auto p-1">
        {matches.length === 0 && <p className="px-2.5 py-6 text-center text-sm text-muted-foreground">Aucun acte trouvé</p>}
        {ACT_GROUPS.map((group) => {
          const acts = matches.filter((a) => a.group === group);
          if (acts.length === 0) return null;
          return (
            <div key={group} className="flex flex-col gap-0.5 pb-1">
              <span className="px-2.5 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                {group}
              </span>
              {acts.map((act) => {
                const alreadyAdded = !act.productCategory && draft.acts.some((a) => a.actId === act.id);
                return (
                  <PickerRow
                    key={act.id}
                    disabled={alreadyAdded}
                    onClick={() => (act.productCategory ? setProductAct(act) : onPick(act))}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
                      <HugeiconsIcon icon={act.icon} className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col leading-tight">
                      <span className="truncate text-sm font-medium text-foreground">{act.label}</span>
                      <span className="truncate text-xs text-muted-foreground">{act.hint}</span>
                    </span>
                    {alreadyAdded ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <HugeiconsIcon icon={Tick02Icon} className="h-3.5 w-3.5" strokeWidth={2.4} />
                        Ajouté
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {act.productCategory ? `${formatMoney(act.price)} + produit` : formatMoney(act.price)}
                      </span>
                    )}
                    {act.productCategory && (
                      <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                    )}
                  </PickerRow>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActRow({ act, onRemove }: { act: PerformedAct; onRemove: () => void }) {
  const { draft, update } = useConsultationDraft();
  const def = getAct(act.actId);
  const product = findStockItem(act.productId);

  // Stock disponible pour cette ligne, une fois les autres consommations du brouillon déduites.
  const usage = stockUsage(draft);
  const before = product ? availableStock(product.id, draft) - ((usage[product.id] ?? 0) - act.quantity) : 0;

  const setQuantity = (quantity: number) =>
    update((d) => ({ acts: d.acts.map((a) => (a.uid === act.uid ? { ...a, quantity } : a)) }));

  return (
    <li className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <HugeiconsIcon icon={def.icon} className="h-4.5 w-4.5" strokeWidth={2} />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="truncate text-sm font-semibold text-foreground">
          {def.label}
          {product && <span className="font-normal text-muted-foreground"> · {product.name}</span>}
        </span>
        {product ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <QuantityStepper
              value={act.quantity}
              max={before}
              onChange={setQuantity}
              label={`Quantité de ${product.name}`}
            />
            <StockProjection item={product} before={before} after={before - act.quantity} />
          </div>
        ) : (
          <span className="truncate text-xs text-muted-foreground">{def.hint}</span>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end leading-tight">
        <span className="text-sm font-semibold text-foreground tabular-nums">{formatMoney(actAmount(act))}</span>
        {product && (
          <span className="text-xs text-muted-foreground tabular-nums">
            acte {def.price} + produit {product.unitPrice * act.quantity}
          </span>
        )}
      </div>

      <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove} aria-label={`Retirer ${def.label}`}>
        <HugeiconsIcon icon={Delete02Icon} className="text-muted-foreground" strokeWidth={2} />
      </Button>
    </li>
  );
}

export function ActsSection({ animal }: { animal: Animal | null }) {
  const { draft, update } = useConsultationDraft();
  const [open, setOpen] = useState(false);
  const [pickerKey, setPickerKey] = useState(0);

  const subtotal = draft.acts.reduce((sum, a) => sum + actAmount(a), 0);

  const addAct = (def: ActDefinition, productId?: string) => {
    let quantity = 1;
    if (productId && animal?.kind === "troupeau") {
      const remaining = availableStock(productId, draft) - (stockUsage(draft)[productId] ?? 0);
      quantity = Math.max(1, Math.min(animal.count, remaining));
    }
    update((d) => ({ acts: [...d.acts, { uid: uid("act"), actId: def.id, productId, quantity }] }));
    setOpen(false);
  };

  return (
    <FormSection
      icon={FirstAidKitIcon}
      title="Actes réalisés"
      hint="Chaque acte est reporté sur la facture"
      action={
        <Popover
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (next) setPickerKey((k) => k + 1);
          }}
        >
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2.4} />
              Ajouter un acte
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 p-0">
            <ActPicker key={pickerKey} animal={animal} onPick={addAct} />
          </PopoverContent>
        </Popover>
      }
    >
      {draft.acts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          Aucun acte. Ajoutez au moins un acte pour pouvoir facturer la consultation.
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {draft.acts.map((act) => (
              <ActRow
                key={act.uid}
                act={act}
                onRemove={() => update((d) => ({ acts: d.acts.filter((a) => a.uid !== act.uid) }))}
              />
            ))}
          </ul>
          <div className="flex items-baseline justify-between px-1">
            <span className="text-sm text-muted-foreground">
              Sous-total · {draft.acts.length} acte{draft.acts.length > 1 ? "s" : ""}
            </span>
            <span className="text-sm font-bold text-foreground tabular-nums">{formatMoney(subtotal)}</span>
          </div>
        </>
      )}
    </FormSection>
  );
}

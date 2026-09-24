import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  label,
}: {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
}) {
  const clamp = (n: number) => Math.min(Math.max(n, min), Math.max(min, max));

  return (
    <div role="group" aria-label={label} className="inline-flex h-7 items-center rounded-md border border-input bg-card">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Diminuer la quantité"
        className="flex h-full w-7 items-center justify-center rounded-l-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
      >
        <HugeiconsIcon icon={MinusSignIcon} className="h-3 w-3" strokeWidth={2.4} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const next = Number.parseInt(e.target.value, 10);
          if (!Number.isNaN(next)) onChange(clamp(next));
        }}
        aria-label={label}
        className="h-full w-11 [appearance:textfield] border-x border-input bg-transparent text-center text-sm font-medium tabular-nums outline-none focus-visible:bg-muted [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Augmenter la quantité"
        className="flex h-full w-7 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
      >
        <HugeiconsIcon icon={PlusSignIcon} className="h-3 w-3" strokeWidth={2.4} />
      </button>
    </div>
  );
}

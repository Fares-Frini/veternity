import { useSyncExternalStore } from "react";

/**
 * Les données d'inventaire sont des tableaux en mémoire (comme le reste de l'application).
 * Chaque mutation appelle `notifyInventory()` pour que toutes les vues ouvertes se mettent à jour.
 */
let version = 0;
const listeners = new Set<() => void>();

export function notifyInventory() {
  version += 1;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useInventoryVersion() {
  return useSyncExternalStore(
    subscribe,
    () => version,
    () => 0,
  );
}

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Imprime un document React : il est rendu dans `.print-root` (masqué à l'écran, seul visible à l'impression),
 * puis la boîte de dialogue d'impression du navigateur s'ouvre une fois les images chargées.
 */
export function usePrint() {
  const [doc, setDoc] = useState<ReactNode>(null);

  useEffect(() => {
    if (!doc) return;
    let cancelled = false;
    const clear = () => setDoc(null);
    window.addEventListener("afterprint", clear);

    const images = Array.from(document.querySelectorAll<HTMLImageElement>(".print-root img"));
    Promise.all(images.map((img) => img.decode().catch(() => undefined))).then(() => {
      if (!cancelled) window.print();
    });

    return () => {
      cancelled = true;
      window.removeEventListener("afterprint", clear);
    };
  }, [doc]);

  const portal = doc ? createPortal(<div className="print-root">{doc}</div>, document.body) : null;
  return { print: (node: ReactNode) => setDoc(node), portal };
}

import { STOCK, daysUntil } from "../../_components/stock-data";
import { PURCHASES, tradeTotal } from "../../_components/trade-data";

export function supplierMetrics(supplierId: string) {
  const purchases = PURCHASES.filter((p) => p.supplierId === supplierId);
  const products = STOCK.filter((s) => s.supplierId === supplierId);
  return {
    productCount: products.length,
    toReorder: products.filter((p) => p.quantity <= p.alertThreshold).length,
    lastOrder: purchases.map((p) => p.date).sort().at(-1),
    openOrders: purchases.filter((p) => p.status !== "Reçue").length,
    yearTotal: purchases.filter((p) => -daysUntil(p.date) <= 365).reduce((sum, p) => sum + tradeTotal(p.lines), 0),
    // Seul ce qui a été livré est dû.
    due: purchases
      .filter((p) => !p.paid)
      .flatMap((p) => p.lines)
      .reduce((sum, l) => sum + (l.receivedQuantity ?? 0) * l.unitPrice, 0),
  };
}

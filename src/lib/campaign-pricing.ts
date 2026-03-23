import type { CartItem } from "@/types";
import type { CampaignOffer } from "@/types/campaign";

export interface AppliedCampaignLine {
  productId: string;
  quantity: number;
  baseUnitPrice: number;
  unitPrice: number;
  lineBaseTotal: number;
  lineTotal: number;
  offer?: CampaignOffer;
}

export function pickBestOffer(
  quantity: number,
  offers: CampaignOffer[] | undefined
): CampaignOffer | undefined {
  if (!offers || offers.length === 0) return undefined;
  const applicable = offers.filter(
    (o) => quantity >= o.minQuantity && Number.isFinite(o.discountedPrice)
  );
  if (applicable.length === 0) return undefined;
  return applicable.reduce((best, cur) =>
    cur.discountedPrice < best.discountedPrice ? cur : best
  );
}

export function calculateCartPricing(
  items: CartItem[],
  offersByProduct: Record<string, CampaignOffer[]>
) {
  const lines: AppliedCampaignLine[] = items.map((item) => {
    const baseUnitPrice = item.product.price;
    const offer = pickBestOffer(item.quantity, offersByProduct[item.product.id]);
    const unitPrice = offer ? Math.min(baseUnitPrice, offer.discountedPrice) : baseUnitPrice;
    const lineBaseTotal = baseUnitPrice * item.quantity;
    const lineTotal = unitPrice * item.quantity;
    return {
      productId: item.product.id,
      quantity: item.quantity,
      baseUnitPrice,
      unitPrice,
      lineBaseTotal,
      lineTotal,
      offer,
    };
  });

  const totalBasePrice = lines.reduce((acc, l) => acc + l.lineBaseTotal, 0);
  const totalPrice = lines.reduce((acc, l) => acc + l.lineTotal, 0);
  const totalDiscount = totalBasePrice - totalPrice;

  return { lines, totalBasePrice, totalPrice, totalDiscount };
}

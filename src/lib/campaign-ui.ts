import type { Product } from "@/types";
import type { CampaignOffer } from "@/types/campaign";

export function resolveOfferDisplay(
  offer: CampaignOffer,
  productById: Record<string, Product>,
  productsLoading: boolean
): { name: string; imageSrc: string | null; namePending: boolean } {
  const p = productById[offer.productId];
  const name =
    (offer.productName?.trim() && offer.productName) ||
    p?.name?.trim() ||
    "";
  const imageSrc =
    (offer.imageUrl?.trim() && offer.imageUrl) ||
    (p?.image?.trim() && p.image) ||
    null;

  const namePending = !name && productsLoading && !offer.productName?.trim();

  return {
    name,
    imageSrc,
    namePending,
  };
}

export interface CampaignOffer {
  productId: string;
  productName?: string;
  imageUrl?: string;
  minQuantity: number;
  discountedPrice: number;
  fromPrice?: number;
}

export interface Campaign {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAtMs: number;
  offers: CampaignOffer[];
}

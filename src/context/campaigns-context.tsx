"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Campaign, CampaignOffer } from "@/types/campaign";

interface CampaignsContextValue {
  campaigns: Campaign[];
  offersByProduct: Record<string, CampaignOffer[]>;
}

const CampaignsContext = createContext<CampaignsContextValue | null>(null);

function parseCreatedAtMs(data: Record<string, unknown>): number {
  const v = data.createdAt as
    | { toMillis?: () => number; seconds?: number }
    | number
    | undefined;
  if (typeof v === "number") return v;
  if (v && typeof v === "object") {
    if (typeof v.toMillis === "function") return v.toMillis();
    if (typeof v.seconds === "number") return v.seconds * 1000;
  }
  return 0;
}

function toOffer(raw: unknown): CampaignOffer | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const productId =
    typeof d.productId === "string"
      ? d.productId
      : Array.isArray(d.productIds) && typeof d.productIds[0] === "string"
        ? (d.productIds[0] as string)
        : "";
  const minQuantityRaw = d.minQuantity;
  const discountedPriceRaw =
    d.discountedPrice ?? d.toPrice ?? d.priceTo ?? d.campaignPrice;
  const minQuantity =
    typeof minQuantityRaw === "number"
      ? minQuantityRaw
      : Number(minQuantityRaw ?? 0);
  const discountedPrice =
    typeof discountedPriceRaw === "number"
      ? discountedPriceRaw
      : Number(discountedPriceRaw ?? NaN);

  if (!productId || !Number.isFinite(minQuantity) || !Number.isFinite(discountedPrice)) {
    return null;
  }
  if (minQuantity <= 0 || discountedPrice <= 0) return null;

  return {
    productId,
    productName: typeof d.productName === "string" ? d.productName : undefined,
    imageUrl:
      typeof d.imageUrl === "string"
        ? d.imageUrl
        : typeof d.image === "string"
          ? d.image
          : undefined,
    minQuantity,
    discountedPrice,
    fromPrice:
      typeof d.fromPrice === "number"
        ? d.fromPrice
        : typeof d.priceFrom === "number"
          ? d.priceFrom
          : Number(d.fromPrice ?? d.priceFrom ?? NaN),
  };
}

function parseCampaign(id: string, data: Record<string, unknown>): Campaign | null {
  const enabled = data.enabled;
  const isActive = data.isActive;
  const active = data.active;
  if (enabled === false || isActive === false || active === false) return null;

  const title =
    typeof data.title === "string"
      ? data.title.trim()
      : typeof data.name === "string"
        ? data.name.trim()
        : "";
  const content =
    typeof data.content === "string"
      ? data.content.trim()
      : typeof data.description === "string"
        ? data.description.trim()
        : "";

  let offers: CampaignOffer[] = [];
  if (Array.isArray(data.offers)) {
    offers = data.offers.map(toOffer).filter(Boolean) as CampaignOffer[];
  } else {
    const productIds = Array.isArray(data.productIds)
      ? data.productIds.filter((x): x is string => typeof x === "string")
      : [];

    if (productIds.length > 0) {
      const minQuantityRaw = data.minQuantity;
      const minQuantity =
        typeof minQuantityRaw === "number"
          ? minQuantityRaw
          : Number(minQuantityRaw ?? 0);
      const discountedPriceRaw =
        data.discountedPrice ?? data.toPrice ?? data.priceTo;
      const discountedPrice =
        typeof discountedPriceRaw === "number"
          ? discountedPriceRaw
          : Number(discountedPriceRaw ?? NaN);
      const fromPriceRaw = data.fromPrice ?? data.priceFrom;
      const fromPrice =
        typeof fromPriceRaw === "number"
          ? fromPriceRaw
          : Number(fromPriceRaw ?? NaN);

      if (minQuantity > 0 && Number.isFinite(discountedPrice) && discountedPrice > 0) {
        offers = productIds.map((pid) => ({
          productId: pid,
          productName: typeof data.productName === "string" ? data.productName : undefined,
          imageUrl:
            typeof data.imageUrl === "string"
              ? data.imageUrl
              : typeof data.image === "string"
                ? data.image
                : undefined,
          minQuantity,
          discountedPrice,
          fromPrice: Number.isFinite(fromPrice) ? fromPrice : undefined,
        }));
      }
    } else {
      const one = toOffer(data);
      if (one) offers = [one];
    }
  }

  if (!title && !content && offers.length === 0) return null;

  const imageUrl =
    typeof data.imageUrl === "string"
      ? data.imageUrl
      : typeof data.image === "string"
        ? data.image
        : undefined;

  return {
    id,
    title: title || "Kampanya",
    content,
    imageUrl: imageUrl?.trim() || undefined,
    createdAtMs: parseCreatedAtMs(data),
    offers,
  };
}

export function CampaignsProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const ref = collection(db, "campaigns");
    return onSnapshot(
      ref,
      (snap) => {
        const list: Campaign[] = [];
        for (const d of snap.docs) {
          const parsed = parseCampaign(d.id, d.data() as Record<string, unknown>);
          if (parsed) list.push(parsed);
        }
        list.sort((a, b) => b.createdAtMs - a.createdAtMs);
        setCampaigns(list);
      },
      () => setCampaigns([])
    );
  }, []);

  const offersByProduct = useMemo(() => {
    const map: Record<string, CampaignOffer[]> = {};
    for (const campaign of campaigns) {
      for (const offer of campaign.offers) {
        if (!map[offer.productId]) map[offer.productId] = [];
        map[offer.productId]!.push(offer);
      }
    }
    return map;
  }, [campaigns]);

  const value = useMemo(
    () => ({ campaigns, offersByProduct }),
    [campaigns, offersByProduct]
  );

  return (
    <CampaignsContext.Provider value={value}>
      {children}
    </CampaignsContext.Provider>
  );
}

export function useCampaigns() {
  const ctx = useContext(CampaignsContext);
  if (!ctx) {
    throw new Error("useCampaigns must be used within CampaignsProvider");
  }
  return ctx;
}

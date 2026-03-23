"use client";

import Image from "next/image";
import { BadgePercent, Package } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { resolveOfferDisplay } from "@/lib/campaign-ui";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import type { Campaign } from "@/types/campaign";

interface CampaignBlockProps {
  campaign: Campaign;
  productById: Record<string, Product>;
  productsLoading: boolean;
  className?: string;
}

export function CampaignBlock({
  campaign,
  productById,
  productsLoading,
  className,
}: CampaignBlockProps) {
  return (
    <article className={cn("text-left", className)}>
      <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
        <BadgePercent className="h-3.5 w-3.5" aria-hidden />
        Kampanya
      </p>
      <h3 className="pr-2 text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
        {campaign.title}
      </h3>
      {campaign.content ? (
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          {campaign.content}
        </p>
      ) : null}

      {campaign.imageUrl ? (
        <div className="relative mt-4 h-36 w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 sm:h-40">
          <Image src={campaign.imageUrl} alt="" fill className="object-cover" unoptimized />
        </div>
      ) : null}

      {campaign.offers.length > 0 ? (
        <div className="mt-4 space-y-3">
          {campaign.offers.map((offer, idx) => {
            const { name, imageSrc, namePending } = resolveOfferDisplay(
              offer,
              productById,
              productsLoading
            );
            return (
              <div
                key={`${offer.productId}-${idx}`}
                className="flex gap-3.5 rounded-2xl border border-neutral-200/90 bg-gradient-to-b from-white to-neutral-50/80 p-3.5 shadow-sm"
              >
                <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-100 shadow-inner">
                  {imageSrc ? (
                    <ProductImage
                      src={imageSrc}
                      alt={name ? name : "Ürün görseli"}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200/80 text-neutral-400">
                      <Package className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 py-0.5">
                  {namePending ? (
                    <div className="mb-2 h-4 max-w-[14rem] animate-pulse rounded-md bg-neutral-200/90" />
                  ) : (
                    <p className="text-[15px] font-semibold leading-snug tracking-tight text-neutral-900 sm:text-base">
                      {name || "Ürün"}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-neutral-600">
                    <span className="inline-flex items-center rounded-md bg-neutral-900/[0.06] px-2 py-0.5 text-[11px] font-semibold text-neutral-700">
                      {offer.minQuantity}+ adet
                    </span>
                    {Number.isFinite(offer.fromPrice ?? NaN) ? (
                      <span className="text-neutral-500 line-through decoration-neutral-400">
                        ₺{(offer.fromPrice as number).toLocaleString("tr-TR")}
                      </span>
                    ) : null}
                    <span className="font-semibold text-emerald-700">
                      ₺{offer.discountedPrice.toLocaleString("tr-TR")}
                    </span>
                    {Number.isFinite(offer.fromPrice ?? NaN) ? (
                      <span className="text-[11px] font-medium text-emerald-700/90">kampanya fiyatı</span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </article>
  );
}

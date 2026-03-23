"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCampaigns } from "@/context/campaigns-context";
import { useProducts } from "@/hooks/useProducts";
import { CampaignBlock } from "@/components/CampaignBlock";
import type { Product } from "@/types";

const STORAGE_KEY = "campaigns_seen_ids_v1";

function readSeenIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function pushSeenId(id: string) {
  if (typeof window === "undefined") return;
  const prev = readSeenIds();
  if (prev.includes(id)) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...prev, id]));
}

export function CampaignPopup() {
  const { campaigns } = useCampaigns();
  const { products, loading: productsLoading } = useProducts(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);

  const productById = useMemo(() => {
    const map: Record<string, Product> = {};
    for (const p of products) map[p.id] = p;
    return map;
  }, [products]);

  const campaign = useMemo(
    () => campaigns.find((c) => c.id === campaignId) ?? null,
    [campaigns, campaignId]
  );

  useEffect(() => {
    if (campaignId) return;
    const seen = new Set(readSeenIds());
    const firstUnseen = campaigns.find((c) => !seen.has(c.id));
    if (!firstUnseen) return;
    pushSeenId(firstUnseen.id);
    setCampaignId(firstUnseen.id);
  }, [campaigns, campaignId]);

  return (
    <AnimatePresence>
      {campaign ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[12100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Kampanya bildirimi"
        >
          <motion.div
            initial={{ y: 18, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.5)] sm:p-6"
          >
            <button
              type="button"
              onClick={() => setCampaignId(null)}
              className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition-colors hover:text-neutral-900"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>

            <CampaignBlock
              campaign={campaign}
              productById={productById}
              productsLoading={productsLoading}
            />

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setCampaignId(null)}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Anladım
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

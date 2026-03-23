"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCampaigns } from "@/context/campaigns-context";
import { useProducts } from "@/hooks/useProducts";
import { CampaignBlock } from "@/components/CampaignBlock";
import type { Product } from "@/types";

interface CampaignsBrowseModalProps {
  open: boolean;
  onClose: () => void;
}

export function CampaignsBrowseModal({ open, onClose }: CampaignsBrowseModalProps) {
  const [mounted, setMounted] = useState(false);
  const { campaigns } = useCampaigns();
  const { products, loading: productsLoading } = useProducts(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const productById = useMemo(() => {
    const map: Record<string, Product> = {};
    for (const p of products) map[p.id] = p;
    return map;
  }, [products]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[12150] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Kampanyalar"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-h-[min(90vh,720px)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_30px_80px_-24px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-4 py-3 sm:px-5">
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Kampanyalar</h2>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition-colors hover:text-neutral-900"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5">
              {campaigns.length === 0 ? (
                <p className="text-center text-sm text-neutral-500">
                  Şu an görüntülenecek aktif kampanya bulunmuyor.
                </p>
              ) : (
                <div className="space-y-8">
                  {campaigns.map((c, i) => (
                    <CampaignBlock
                      key={c.id}
                      campaign={c}
                      productById={productById}
                      productsLoading={productsLoading}
                      className={i > 0 ? "border-t border-neutral-100 pt-8" : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="shrink-0 border-t border-neutral-100 px-4 py-3 sm:px-5">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
              >
                Kapat
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

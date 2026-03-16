"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProductImage } from "./ProductImage";
import { PriceBadge } from "./PriceBadge";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import { useCart } from "@/store/cart-store";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.02, ease: [0.22, 1, 0.36, 1] }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
    >
      <Link href={`/product/${product.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-neutral-50/50">
        {product.image ? (
          <ProductImage
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-300 text-xs font-medium">
            Görsel yok
          </div>
        )}
        {/* Sepete eklendi geri bildirimi */}
        <AnimatePresence>
          {justAdded && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0 z-10 flex items-center justify-center rounded-t-xl bg-black/40 backdrop-blur-[2px]"
            >
              <motion.span
                initial={{ y: 4, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.2 }}
                className="flex flex-col items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 shadow-lg"
              >
                <Check className="h-5 w-5 text-emerald-600" strokeWidth={2.5} />
                <span className="text-xs font-semibold text-neutral-800">Eklendi</span>
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
        {/* İnce dekoratif ayırıcı */}
        <div
          className="h-px w-full shrink-0 px-3 sm:px-4"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 0.05) 15%, rgb(0 0 0 / 0.07) 50%, rgb(0 0 0 / 0.05) 85%, transparent 100%)",
          }}
        />

        <div className="flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug tracking-tight text-neutral-900 sm:text-sm">
            {product.name}
          </h3>
          <div className="mt-auto flex items-center justify-between gap-2 pt-3 sm:pt-4">
            <PriceBadge price={product.price} size="sm" />
            <Button
              onClick={handleAddToCart}
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5 rounded-lg border-neutral-200/80 text-xs font-medium"
            >
              <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2} />
              Sepete Ekle
            </Button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

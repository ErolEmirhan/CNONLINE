"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { PriceBadge } from "./PriceBadge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import { useCart } from "@/store/cart-store";

interface ProductCardProps {
  product: Product;
  index?: number;
}

function stopCardNav(e: React.MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const qty = items.find((i) => i.product.id === product.id)?.quantity ?? 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    stopCardNav(e);
    addItem(product);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    stopCardNav(e);
    updateQuantity(product.id, qty - 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    stopCardNav(e);
    addItem(product);
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
            <div className="flex h-full items-center justify-center text-xs font-medium text-neutral-300">
              Görsel yok
            </div>
          )}
        </div>
        <div
          className="h-px w-full shrink-0 px-3 sm:px-4"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 0.05) 15%, rgb(0 0 0 / 0.07) 50%, rgb(0 0 0 / 0.05) 85%, transparent 100%)",
          }}
        />

        <div className="flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug tracking-tight text-neutral-900 sm:text-sm">
            {product.name}
          </h3>
          <div className="mt-auto flex items-center justify-between gap-2.5 pt-3 sm:gap-2 sm:pt-4">
            <div className="min-w-0 flex-1">
              <PriceBadge price={product.price} size="sm" />
            </div>
            {qty > 0 ? (
              <div
                role="group"
                aria-label="Sepet miktarı"
                className="flex shrink-0 items-stretch overflow-hidden rounded-md border border-neutral-200/90 bg-neutral-50/60 sm:gap-0.5 sm:rounded-lg sm:border-neutral-200 sm:bg-white sm:p-0.5 sm:shadow-sm"
                onClick={stopCardNav}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="h-8 min-h-8 min-w-8 rounded-none px-0 text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-900 sm:h-7 sm:min-h-0 sm:min-w-0 sm:rounded-md sm:hover:bg-neutral-100"
                  onClick={handleDecrement}
                  aria-label="Azalt"
                >
                  <Minus className="size-3.5" strokeWidth={2} />
                </Button>
                <span className="flex min-w-[1.5rem] select-none items-center justify-center px-0.5 text-center text-xs font-semibold tabular-nums text-neutral-800 sm:min-w-[1.5rem] sm:text-xs">
                  {qty}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="h-8 min-h-8 min-w-8 rounded-none px-0 text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-900 sm:h-7 sm:min-h-0 sm:min-w-0 sm:rounded-md sm:hover:bg-neutral-100"
                  onClick={handleIncrement}
                  aria-label="Artır"
                >
                  <Plus className="size-3.5" strokeWidth={2} />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={handleAddToCart}
                variant="outline"
                size="sm"
                className="h-8 max-w-full shrink-0 rounded-md border-neutral-200/90 bg-neutral-50/40 px-2 text-[11px] font-medium leading-none tracking-tight text-neutral-700 shadow-none hover:bg-neutral-100/80 sm:h-7 sm:max-w-none sm:gap-1.5 sm:rounded-lg sm:border-neutral-200 sm:bg-background sm:px-2.5 sm:text-[0.8rem] sm:shadow-sm"
              >
                <ShoppingCart
                  className="hidden size-3.5 shrink-0 sm:inline"
                  strokeWidth={2}
                />
                <span className="truncate">Sepete Ekle</span>
              </Button>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

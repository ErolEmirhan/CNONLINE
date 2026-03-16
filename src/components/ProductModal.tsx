"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ProductImage } from "./ProductImage";
import { PriceBadge } from "./PriceBadge";
import { ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import { useCart } from "@/store/cart-store";

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductModal({
  product,
  open,
  onOpenChange,
}: ProductModalProps) {
  const { addItem } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0 sm:max-w-xl">
        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
            {product.image ? (
              <ProductImage
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-400">
                Görsel yok
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {product.name}
              </DialogTitle>
            </DialogHeader>
            <p className="mt-2 flex-1 text-sm text-neutral-500">
              {product.description || "Açıklama bulunmuyor."}
            </p>
            <div className="mt-4">
              <PriceBadge price={product.price} size="md" />
            </div>
            <Button
              onClick={handleAddToCart}
              className="mt-6 w-full gap-2"
              size="lg"
            >
              <ShoppingCart className="h-4 w-4" />
              Sepete Ekle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

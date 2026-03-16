"use client";

import Link from "next/link";
import { ProductImage } from "./ProductImage";
import { PriceBadge } from "./PriceBadge";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart-store";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  trigger: React.ReactNode;
}

export function CartDrawer({ trigger }: CartDrawerProps) {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } =
    useCart();

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        className="h-full max-h-none w-full border-l sm:max-w-md"
      >
        <div className="flex h-full flex-col">
          <DrawerHeader className="border-b">
            <DrawerTitle className="text-xl font-semibold">
              Sepetim ({totalItems} ürün)
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <p className="py-12 text-center text-neutral-500">
                Sepetiniz boş. Ürün ekleyerek başlayın.
              </p>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.product.id}
                    className="flex gap-4 rounded-xl border border-neutral-200 bg-neutral-50/50 p-3"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-200">
                      {item.product.image ? (
                        <ProductImage
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-neutral-900">
                        {item.product.name}
                      </p>
                      <PriceBadge price={item.product.price} size="sm" />
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-neutral-200 bg-white">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                Math.max(0, item.quantity - 1)
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="h-7 w-7 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-lg font-semibold text-neutral-900">Toplam</span>
                <PriceBadge price={totalPrice} size="md" />
              </div>
              <Link href="/checkout" className="block">
                <Button
                  size="lg"
                  className="group w-full gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 px-6 py-6 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-indigo-600 hover:via-violet-600 hover:to-purple-700 hover:shadow-violet-500/30 focus-visible:ring-violet-400/50"
                >
                  <span>Siparişi Tamamla</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

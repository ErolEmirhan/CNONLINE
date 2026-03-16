"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ProductImage } from "@/components/ProductImage";
import { PriceBadge } from "@/components/PriceBadge";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProduct";
import { useCart } from "@/store/cart-store";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { product, loading, error } = useProduct(productId);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (product) addItem(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center pt-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
          <p className="mt-4 text-sm text-neutral-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-20">
          <p className="text-center text-neutral-600">
            {error || "Ürün bulunamadı."}
          </p>
          <Link href="/">
            <Button variant="outline" className="mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="px-4 pt-20 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Ürünlere Dön
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-10 lg:grid-cols-2 lg:gap-16"
          >
            {/* Sol - Büyük ürün görseli */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-50 lg:aspect-[4/5]">
              {product.image ? (
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-neutral-400">
                  Görsel yok
                </div>
              )}
            </div>

            {/* Sağ - Ürün bilgileri */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>

              <div className="mt-6">
                <PriceBadge price={product.price} size="lg" />
              </div>

              {product.description && (
                <div className="mt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                    Açıklama
                  </h2>
                  <p className="mt-3 text-neutral-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {product.stock !== undefined && (
                <p className="mt-4 text-sm text-neutral-500">
                  Stok: {product.stock} adet
                </p>
              )}

              <div className="mt-auto pt-10">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="group w-full gap-3 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-indigo-600 hover:via-violet-600 hover:to-purple-700 hover:shadow-violet-500/30 focus-visible:ring-violet-400/50 sm:w-auto sm:min-w-[240px]"
                >
                  <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span>Sepete Ekle</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

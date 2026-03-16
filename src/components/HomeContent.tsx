"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

interface HomeContentProps {
  selectedCategoryId: string | null;
  searchQuery: string;
}

export function HomeContent({ selectedCategoryId, searchQuery }: HomeContentProps) {
  const { categories } = useCategories();
  const effectiveCategoryId = searchQuery.trim() ? null : selectedCategoryId;
  const { products, loading, error } = useProducts(effectiveCategoryId);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (selectedCategoryId) {
      list = list.filter((p) => p.categoryId === selectedCategoryId);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const cat = categories.find((c) => c.id === p.categoryId);
        const catName = cat?.name ?? "";
        return (
          p.name.toLowerCase().includes(q) || catName.toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [products, selectedCategoryId, searchQuery, categories]);

  const selectedCategory = selectedCategoryId
    ? categories.find((c) => c.id === selectedCategoryId)
    : null;

  return (
    <>
      <section className="w-full px-4 pt-6 pb-16 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 text-lg font-semibold tracking-tight text-neutral-900 sm:mb-6 sm:text-xl"
        >
          {selectedCategory ? (
            <>
              <span className="text-neutral-500">Kategori:</span>{" "}
              {selectedCategory.name}
            </>
          ) : (
            "Tüm Ürünler"
          )}
        </motion.h2>

        {error ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
            <p className="font-medium">Ürünler yüklenemedi</p>
            <p className="mt-1 text-sm opacity-90">{error}</p>
            <p className="mt-3 text-xs">
              Firebase Console → Firestore → Kurallar bölümünden okuma iznini kontrol edin.
            </p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-xl bg-neutral-100"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="py-16 text-center text-sm text-neutral-500">
            {searchQuery.trim()
              ? "Aramanızla eşleşen ürün veya kategori bulunamadı."
              : "Bu kategoride henüz ürün bulunmuyor."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

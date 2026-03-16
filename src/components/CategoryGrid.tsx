"use client";

import { motion } from "framer-motion";
import { ProductImage } from "./ProductImage";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";

interface CategoryGridProps {
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

export function CategoryGrid({
  selectedCategoryId,
  onSelectCategory,
}: CategoryGridProps) {
  const { categories, loading, error } = useCategories();

  if (error) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
        <p className="font-medium">Kategoriler yüklenemedi</p>
        <p className="mt-1 text-sm opacity-90">{error}</p>
        <p className="mt-3 text-xs">
          Firebase Console → Firestore → Kurallar bölümünden okuma iznini kontrol edin.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-2xl bg-neutral-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => onSelectCategory(null)}
        className={cn(
          "group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300",
          !selectedCategoryId
            ? "border-neutral-900 bg-neutral-900 text-white"
            : "border-neutral-200 bg-white/80 text-neutral-700 hover:border-neutral-300 hover:shadow-lg"
        )}
      >
        <span className="text-lg font-medium">Tümü</span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </motion.button>

      {categories.map((cat, i) => (
        <motion.button
          key={cat.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          onClick={() => onSelectCategory(cat.id)}
          className={cn(
            "group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300",
            selectedCategoryId === cat.id
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-200 bg-white/80 text-neutral-700 hover:border-neutral-300 hover:shadow-lg"
          )}
        >
          {cat.image && (
            <div className="absolute inset-0">
              <ProductImage
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          )}
          <span className="relative z-10 text-lg font-medium">{cat.name}</span>
        </motion.button>
      ))}
    </div>
  );
}

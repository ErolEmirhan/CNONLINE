"use client";

import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import type { Product } from "@/types";
import type { HomeFilter } from "@/types/home-filter";

interface HomeContentProps {
  homeFilter: HomeFilter;
  searchQuery: string;
  onSeeAllCategory?: (categoryId: string) => void;
  onShowAllProducts?: () => void;
}

function groupProductsByCategory(
  products: Product[],
  categories: { id: string; name: string }[]
): { categoryId: string; title: string; products: Product[] }[] {
  const map = new Map<string, Product[]>();
  for (const p of products) {
    const cid = p.categoryId || "_uncategorized";
    if (!map.has(cid)) map.set(cid, []);
    map.get(cid)!.push(p);
  }

  const sections: { categoryId: string; title: string; products: Product[] }[] =
    [];

  for (const cat of categories) {
    const prods = map.get(cat.id);
    if (prods?.length) {
      sections.push({
        categoryId: cat.id,
        title: cat.name,
        products: prods,
      });
    }
  }

  for (const [cid, prods] of map.entries()) {
    if (!categories.some((c) => c.id === cid)) {
      sections.push({
        categoryId: cid,
        title: "Diğer",
        products: prods,
      });
    }
  }

  return sections;
}

export function HomeContent({
  homeFilter,
  searchQuery,
  onSeeAllCategory,
  onShowAllProducts,
}: HomeContentProps) {
  const { categories } = useCategories();
  const effectiveCategoryId =
    searchQuery.trim() ||
    (homeFilter.mode !== "category" && homeFilter.mode !== "category-grid")
      ? null
      : homeFilter.id;
  const { products, loading, error } = useProducts(effectiveCategoryId);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (
      searchQuery.trim() &&
      (homeFilter.mode === "category" || homeFilter.mode === "category-grid")
    ) {
      list = list.filter((p) => p.categoryId === homeFilter.id);
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
  }, [products, homeFilter, searchQuery, categories]);

  const categorySections = useMemo(
    () => groupProductsByCategory(filteredProducts, categories),
    [filteredProducts, categories]
  );

  const selectedCategory =
    homeFilter.mode === "category" || homeFilter.mode === "category-grid"
      ? categories.find((c) => c.id === homeFilter.id)
      : null;

  /** Grid: tümü, arama veya kategori-grid. Yatay şerit: explore + category */
  const useCarousel =
    (homeFilter.mode === "explore" || homeFilter.mode === "category") &&
    !searchQuery.trim();

  const showSeeAllButtons = Boolean(onSeeAllCategory);

  return (
    <>
      <section
        id="urunler"
        className="scroll-mt-20 w-full px-4 pt-6 pb-16 sm:scroll-mt-24 sm:px-6 sm:pt-8 lg:px-8"
      >
        <div className="mb-6 flex items-center justify-between gap-3 sm:mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-w-0 text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl"
          >
            {selectedCategory ? (
              <>
                <span className="text-neutral-500">Kategori:</span>{" "}
                {selectedCategory.name}
              </>
            ) : searchQuery.trim() ? (
              "Arama sonuçları"
            ) : homeFilter.mode === "all" ? (
              "Tüm ürünler"
            ) : homeFilter.mode === "explore" ? (
              "Ürünler"
            ) : (
              "Ürünler"
            )}
          </motion.h2>

          {selectedCategory && onShowAllProducts ? (
            <button
              type="button"
              onClick={onShowAllProducts}
              className="shrink-0 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-900 sm:text-sm"
            >
              Tümü &gt;
            </button>
          ) : null}
        </div>

        {error ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
            <p className="font-medium">Ürünler yüklenemedi</p>
            <p className="mt-1 text-sm opacity-90">{error}</p>
            <p className="mt-3 text-xs">
              Firebase Console → Firestore → Kurallar bölümünden okuma iznini kontrol edin.
            </p>
          </div>
        ) : loading ? (
          <div className="space-y-10">
            {[1, 2].map((row) => (
              <div
                key={row}
                className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-50/80 p-4 shadow-sm"
              >
                <div className="mb-4 h-7 w-48 animate-pulse rounded-md bg-neutral-200/80" />
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square animate-pulse rounded-xl bg-neutral-200/60"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="py-16 text-center text-sm text-neutral-500">
            {searchQuery.trim()
              ? "Aramanızla eşleşen ürün veya kategori bulunamadı."
              : "Bu kategoride henüz ürün bulunmuyor."}
          </p>
        ) : (
          <div className="space-y-8 sm:space-y-10">
            {categorySections.map((section, sectionIdx) => {
              const indexOffset = categorySections
                .slice(0, sectionIdx)
                .reduce((sum, s) => sum + s.products.length, 0);
              const canSeeAll =
                showSeeAllButtons &&
                section.categoryId !== "_uncategorized" &&
                onSeeAllCategory;

              return (
                <div
                  key={section.categoryId}
                  className="overflow-hidden rounded-2xl border border-neutral-200/70 bg-gradient-to-br from-neutral-50/95 via-white to-neutral-100/90 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-black/[0.03]"
                >
                  <div className="relative flex min-h-[3.25rem] items-stretch border-b border-neutral-200/60 bg-white/55 backdrop-blur-[2px]">
                    <h3 className="flex min-w-0 flex-1 items-center py-3 pl-4 pr-3 text-left text-base font-semibold tracking-tight text-neutral-900 sm:py-3.5 sm:pl-5 sm:text-lg sm:pr-4">
                      <span className="truncate">{section.title}</span>
                    </h3>
                    {canSeeAll ? (
                      <button
                        type="button"
                        onClick={() => onSeeAllCategory?.(section.categoryId)}
                        className="group flex shrink-0 items-center gap-1 border-l border-neutral-200/80 bg-gradient-to-b from-white to-neutral-50/95 px-3 py-2.5 text-[13px] font-semibold tracking-tight text-neutral-800 shadow-[inset_1px_0_0_rgba(255,255,255,0.75)] transition-colors hover:bg-white hover:text-neutral-950 sm:rounded-none sm:px-5 sm:py-3 sm:text-sm"
                      >
                        <span className="hidden sm:inline">Tümünü gör</span>
                        <span className="sm:hidden">Tümü</span>
                        <ChevronRight
                          className="size-4 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5"
                          strokeWidth={2}
                        />
                      </button>
                    ) : null}
                  </div>

                  {useCarousel ? (
                    <div
                      className="-mx-0 overflow-x-auto overflow-y-visible overscroll-x-contain px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3 [scrollbar-gutter:stable]"
                      style={{ WebkitOverflowScrolling: "touch" }}
                    >
                      <div
                        role="list"
                        className="flex w-max gap-3 snap-x snap-mandatory sm:gap-4"
                      >
                        {section.products.map((product, pi) => (
                          <div
                            key={product.id}
                            role="listitem"
                            className="w-[min(46vw,200px)] min-w-[150px] shrink-0 snap-start sm:w-[200px] sm:min-w-[180px]"
                          >
                            <ProductCard
                              product={product}
                              index={indexOffset + pi}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
                      <div
                        role="list"
                        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                      >
                        {section.products.map((product, pi) => (
                          <div
                            key={product.id}
                            role="listitem"
                            className="min-w-0"
                          >
                            <ProductCard
                              product={product}
                              index={indexOffset + pi}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

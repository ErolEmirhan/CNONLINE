"use client";

import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";
import type { HomeFilter } from "@/types/home-filter";

interface CategoryChipsProps {
  homeFilter: HomeFilter;
  onHomeFilterChange: (f: HomeFilter) => void;
}

export function CategoryChips({
  homeFilter,
  onHomeFilterChange,
}: CategoryChipsProps) {
  const { categories, loading } = useCategories();

  const tumuActive = homeFilter.mode === "all";
  const isCategoryActive = (id: string) =>
    (homeFilter.mode === "category" || homeFilter.mode === "category-grid") &&
    homeFilter.id === id;

  /** «Tümü» yalnızca mode===all iken dolu; keşif/kategori seçiliyken çerçeveli ghost — seçilmiş gibi görünmesin */
  const pillTumu = cn(
    "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium tracking-tight transition-colors sm:px-3.5 sm:py-2 sm:text-[13px]",
    tumuActive
      ? "bg-neutral-900 text-white shadow-sm"
      : "border border-neutral-200/90 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-900"
  );

  const pillCategory = (active: boolean) =>
    cn(
      "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium tracking-tight transition-colors sm:px-3.5 sm:py-2 sm:text-[13px]",
      active
        ? "bg-neutral-900 text-white shadow-sm"
        : "border border-transparent bg-neutral-100/90 text-neutral-600 hover:bg-neutral-200/90 hover:text-neutral-900"
    );

  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-3.5 lg:px-8">
        <div className="flex min-h-[2.25rem] items-center gap-0 sm:min-h-[2.5rem]">
          {/* Sol: Tümü — çok kategori varken kaybolmasın */}
          <div className="flex shrink-0 items-center pr-2 sm:pr-3">
            <button
              type="button"
              aria-pressed={tumuActive}
              onClick={() => onHomeFilterChange({ mode: "all" })}
              className={pillTumu}
            >
              Tümü
            </button>
          </div>

          {/* Sağ: kategoriler — yatay kaydırma */}
          <div
            className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {loading ? (
              <div className="flex w-max gap-2 pr-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-neutral-100 sm:h-9 sm:w-24"
                  />
                ))}
              </div>
            ) : (
              <div
                role="tablist"
                aria-label="Kategoriler"
                className="flex w-max items-center gap-2 pr-1"
              >
                {categories.map((cat) => {
                  const active = isCategoryActive(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() =>
                        onHomeFilterChange({ mode: "category", id: cat.id })
                      }
                      className={pillCategory(active)}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";
import type { HomeFilter } from "@/types/home-filter";

interface CategorySidebarProps {
  homeFilter: HomeFilter;
  onHomeFilterChange: (f: HomeFilter) => void;
}

export function CategorySidebar({
  homeFilter,
  onHomeFilterChange,
}: CategorySidebarProps) {
  const { categories, loading } = useCategories();

  const tumuActive = homeFilter.mode === "all";
  const isCategoryActive = (id: string) =>
    (homeFilter.mode === "category" || homeFilter.mode === "category-grid") &&
    homeFilter.id === id;

  return (
    <aside className="hidden w-52 shrink-0 border-r border-neutral-100 bg-neutral-50/30 md:block lg:w-56">
      <div className="sticky top-16 flex flex-col py-6 pl-6 pr-4">
        <nav className="flex flex-col gap-0.5">
          <button
            onClick={() => onHomeFilterChange({ mode: "all" })}
            className={cn(
              "rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200",
              tumuActive
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            Tümü
          </button>
          {loading ? (
            <div className="space-y-0.5 pt-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-9 animate-pulse rounded-lg bg-neutral-100"
                />
              ))}
            </div>
          ) : (
            categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                onClick={() =>
                  onHomeFilterChange({ mode: "category", id: cat.id })
                }
                className={cn(
                  "rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200",
                  isCategoryActive(cat.id)
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                {cat.name}
              </motion.button>
            ))
          )}
        </nav>
      </div>
    </aside>
  );
}

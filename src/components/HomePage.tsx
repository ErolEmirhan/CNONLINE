"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";
import { SearchBar } from "./SearchBar";
import { CategoryChips } from "./CategoryChips";
import { HomeContent } from "./HomeContent";
import { Hero } from "./Hero";
import type { HomeFilter } from "@/types/home-filter";

export function HomePage() {
  const [homeFilter, setHomeFilter] = useState<HomeFilter>({ mode: "explore" });
  const [searchQuery, setSearchQuery] = useState("");

  const handleSeeAllCategory = (categoryId: string) => {
    setSearchQuery("");
    setHomeFilter({ mode: "category-grid", id: categoryId });
    requestAnimationFrame(() => {
      document.getElementById("urunler")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const handleShowAllProducts = () => {
    setSearchQuery("");
    setHomeFilter({ mode: "all" });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar homeFilter={homeFilter} onHomeFilterChange={setHomeFilter} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="shrink-0">
          <Hero />
        </div>
        {/* Arama + kategori şeridi: kayınca üstte sabit kalsın */}
        <div className="sticky top-14 z-30 w-full shrink-0 border-b border-neutral-100 bg-white/95 backdrop-blur-md sm:top-16">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryChips
            homeFilter={homeFilter}
            onHomeFilterChange={setHomeFilter}
          />
        </div>
        <main className="min-w-0 flex-1">
          <HomeContent
            homeFilter={homeFilter}
            searchQuery={searchQuery}
            onSeeAllCategory={handleSeeAllCategory}
            onShowAllProducts={handleShowAllProducts}
          />
        </main>
      </div>
    </div>
  );
}

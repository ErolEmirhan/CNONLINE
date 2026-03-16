"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";
import { SearchBar } from "./SearchBar";
import { CategorySidebar } from "./CategorySidebar";
import { HomeContent } from "./HomeContent";

export function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />
      <div className="flex pt-14 sm:pt-16">
        <CategorySidebar
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <main className="min-w-0 flex-1">
            <HomeContent
              selectedCategoryId={selectedCategoryId}
              searchQuery={searchQuery}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

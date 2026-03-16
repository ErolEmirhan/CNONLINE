"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full border-b border-neutral-100 bg-white px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="relative mx-auto max-w-4xl">
        <label htmlFor="main-search" className="sr-only">
          Ürün veya kategori ara
        </label>
        <div className="relative flex items-center rounded-full bg-neutral-50/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-neutral-200/60 transition-all duration-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900/10 focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <Search
            className="absolute left-5 h-5 w-5 shrink-0 text-neutral-400"
            strokeWidth={1.8}
          />
          <input
            id="main-search"
            type="search"
            placeholder="Ürün veya kategori ara..."
            autoComplete="off"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 w-full rounded-full bg-transparent py-3 pl-12 pr-5 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none sm:h-14 sm:pl-14 sm:pr-6 sm:text-base"
          />
        </div>
      </div>
    </div>
  );
}

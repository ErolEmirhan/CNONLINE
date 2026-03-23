"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full border-b border-neutral-100/80 bg-white px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="relative mx-auto max-w-5xl">
        <label htmlFor="main-search" className="sr-only">
          Ürün veya kategori ara
        </label>
        <div className="group relative flex items-center overflow-hidden rounded-[1.1rem] border border-transparent bg-[linear-gradient(white,white)_padding-box,linear-gradient(115deg,rgba(243,226,160,0.82)_0%,rgba(212,175,55,0.96)_38%,rgba(255,240,180,0.9)_56%,rgba(184,134,11,0.94)_82%,rgba(243,226,160,0.78)_100%)_border-box] shadow-[0_8px_28px_-14px_rgba(0,0,0,0.35),0_0_0_1px_rgba(212,175,55,0.14)] transition-[box-shadow,transform] duration-300 focus-within:shadow-[0_14px_40px_-16px_rgba(0,0,0,0.42),0_0_0_1px_rgba(212,175,55,0.32)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(212,175,55,0.10),transparent_65%)] opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />
          <div className="absolute left-4 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100/90 text-neutral-500 ring-1 ring-neutral-200/90 sm:left-5 sm:h-9 sm:w-9">
            <Search className="h-4 w-4 shrink-0 sm:h-[17px] sm:w-[17px]" strokeWidth={2} />
          </div>
          <input
            id="main-search"
            type="search"
            placeholder="Ürün veya kategori ara..."
            autoComplete="off"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="relative h-12 w-full bg-transparent py-3 pl-14 pr-24 text-sm font-semibold tracking-tight text-neutral-900 placeholder:font-medium placeholder:text-neutral-400 focus:outline-none sm:h-14 sm:pl-[4.1rem] sm:pr-28 sm:text-base"
          />
          <span className="pointer-events-none absolute right-3 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 sm:right-4 sm:text-[11px]">
            Ara
          </span>
        </div>
      </div>
    </div>
  );
}

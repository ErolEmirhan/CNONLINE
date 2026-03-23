"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BadgePercent, Building2, ChevronDown, Mail, Menu, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart-store";
import { useCategories } from "@/hooks/useCategories";
import { CartDrawer } from "./CartDrawer";
import { CampaignsBrowseModal } from "./CampaignsBrowseModal";
import { cn } from "@/lib/utils";
import type { HomeFilter } from "@/types/home-filter";

interface NavbarProps {
  homeFilter?: HomeFilter;
  onHomeFilterChange?: (f: HomeFilter) => void;
}

export function Navbar({ homeFilter, onHomeFilterChange }: NavbarProps) {
  const showCategories = typeof onHomeFilterChange === "function";
  const { totalItems } = useCart();
  const { categories, loading } = useCategories();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [campaignsModalOpen, setCampaignsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const displayCategories = showCategories ? categories : [];
  const displayLoading = showCategories ? loading : false;

  const handleSelectCategory = (id: string | null) => {
    if (!onHomeFilterChange) return;
    onHomeFilterChange(id === null ? { mode: "all" } : { mode: "category", id });
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => setIsAtTop(window.scrollY <= 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const desktopNavButton =
    "group relative inline-flex h-10 items-center gap-1.5 rounded-md px-3.5 text-[13px] font-semibold tracking-tight text-white/90 transition-colors hover:text-white";
  const desktopUnderline =
    "pointer-events-none absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent transition-all duration-200 group-hover:w-[78%]";

  return (
    <>
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-colors duration-300",
        isAtTop ? "border-b border-transparent bg-transparent" : "border-b border-white/10 bg-black/95"
      )}
    >
      <nav className="relative flex h-14 w-full items-center gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        {/* Mobil: sol hamburger + logo */}
        <div className="flex min-w-0 flex-1 items-center gap-3 md:hidden">
          {showCategories ? (
            <Button
              variant="ghost"
              size="icon"
              className="-ml-2 text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/30"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menüyü aç"
            >
              <Menu className="h-5 w-5 text-white" />
            </Button>
          ) : null}
          <Link href="/" className="flex min-w-0 items-center gap-2 text-xl font-bold tracking-tight text-white">
            <Image src="/logo.png" alt="CN Toptan Gıda" width={36} height={36} unoptimized className="shrink-0" />
            <span className="truncate bg-gradient-to-r from-[#f3e2a0] via-[#d4af37] to-[#b8860b] bg-clip-text text-transparent">
              CN Toptan Gıda
            </span>
          </Link>
        </div>

        {/* Desktop: solda logo */}
        <Link
          href="/"
          className="hidden min-w-0 items-center gap-2.5 md:flex md:flex-1"
        >
          <Image src="/logo.png" alt="CN Toptan Gıda" width={40} height={40} unoptimized className="shrink-0" />
          <span className="truncate bg-gradient-to-r from-[#f3e2a0] via-[#d4af37] to-[#b8860b] bg-clip-text text-[1.45rem] font-bold tracking-tight text-transparent">
            CN Toptan Gıda
          </span>
        </Link>

        {/* Desktop: ortada kurumsal menüler */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2 py-1">
            <Link href="/hakkimizda" className={desktopNavButton}>
              Hakkımızda
              <span className={desktopUnderline} />
            </Link>

            <Link href="/iletisim" className={desktopNavButton}>
              İletişim
              <span className={desktopUnderline} />
            </Link>

            {showCategories ? (
              <div className="group relative">
                <button type="button" className={desktopNavButton}>
                  Kategoriler
                  <ChevronDown className="h-3.5 w-3.5 opacity-80 transition-transform group-hover:translate-y-0.5" />
                  <span className={desktopUnderline} />
                </button>
                <div className="pointer-events-none absolute left-1/2 top-[calc(100%+0.45rem)] z-50 w-56 -translate-x-1/2 rounded-xl border border-neutral-200 bg-white p-2 opacity-0 shadow-[0_12px_36px_-10px_rgba(0,0,0,0.25)] transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                  <button
                    onClick={() => onHomeFilterChange?.({ mode: "all" })}
                    className="mb-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                  >
                    Tümü
                  </button>
                  {displayCategories.slice(0, 8).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onHomeFilterChange?.({ mode: "category", id: cat.id })}
                      className="mb-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <CartDrawer
              trigger={
                <button type="button" className={desktopNavButton} aria-label="Sepetim">
                  Sepetim
                  {totalItems > 0 ? (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d4af37] px-1.5 text-[11px] font-bold text-black">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  ) : null}
                  <span className={desktopUnderline} />
                </button>
              }
            />
          </div>
        </div>

        {/* Mobil: sağda sepet */}
        <div className="flex items-center justify-end md:hidden">
          <CartDrawer
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/95 hover:bg-white/10"
                aria-label="Sepet"
              >
                <ShoppingCart className="h-5 w-5" strokeWidth={2} />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d4af37] px-1 text-[11px] font-bold text-black">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Button>
            }
          />
        </div>
      </nav>

      {/* Mobil kategori drawer */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {showCategories && mobileMenuOpen && (
              <div key="mobile-menu" className="fixed inset-0 z-[100] md:hidden" aria-modal="true" role="dialog">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute left-0 top-0 z-10 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-2xl"
                >
                  <div className="flex h-14 items-center justify-between border-b px-4">
                    <span className="font-semibold text-neutral-900">Kategoriler</span>
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Kapat">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 overflow-y-auto p-4">
                      <button
                        onClick={() => handleSelectCategory(null)}
                        className={cn(
                          "mb-1 flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                          homeFilter?.mode === "all" ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-100"
                        )}
                      >
                        Tümü
                      </button>
                      {displayLoading ? (
                        <div className="space-y-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 animate-pulse rounded-xl bg-neutral-100" />
                          ))}
                        </div>
                      ) : (
                        displayCategories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleSelectCategory(cat.id)}
                            className={cn(
                              "mb-1 flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                              (homeFilter?.mode === "category" || homeFilter?.mode === "category-grid") && homeFilter.id === cat.id
                                ? "bg-neutral-900 text-white"
                                : "text-neutral-700 hover:bg-neutral-100"
                            )}
                          >
                            {cat.name}
                          </button>
                        ))
                      )}
                    </div>

                    <div className="border-t border-neutral-200 bg-neutral-50/85 p-3">
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCampaignsModalOpen(true);
                            setMobileMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl border border-amber-200/90 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50/80 px-4 py-3 text-left text-sm font-semibold text-amber-950 shadow-[0_1px_10px_-3px_rgba(180,83,9,0.28)] transition-colors hover:from-amber-100 hover:via-yellow-50 hover:to-amber-100/90"
                        >
                          <BadgePercent className="h-4 w-4 shrink-0" strokeWidth={1.9} />
                          Kampanyalar
                        </button>
                        <Link
                          href="/hakkimizda"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 text-left text-sm font-semibold text-blue-800 shadow-[0_1px_8px_-2px_rgba(37,99,235,0.25)] transition-colors hover:from-blue-100 hover:to-indigo-100"
                        >
                          <Building2 className="h-4 w-4" strokeWidth={1.9} />
                          Hakkımızda
                        </Link>
                        <Link
                          href="/iletisim"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 text-left text-sm font-semibold text-emerald-800 shadow-[0_1px_8px_-2px_rgba(5,150,105,0.25)] transition-colors hover:from-emerald-100 hover:to-teal-100"
                        >
                          <Mail className="h-4 w-4" strokeWidth={1.9} />
                          İletişim
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </motion.header>
    <CampaignsBrowseModal open={campaignsModalOpen} onClose={() => setCampaignsModalOpen(false)} />
    </>
  );
}

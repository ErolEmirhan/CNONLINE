"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart-store";
import { useCategories } from "@/hooks/useCategories";
import { CartDrawer } from "./CartDrawer";
import { cn } from "@/lib/utils";

interface NavbarProps {
  selectedCategoryId?: string | null;
  onSelectCategory?: (id: string | null) => void;
}

export function Navbar({
  selectedCategoryId = null,
  onSelectCategory,
}: NavbarProps) {
  const showCategories = typeof onSelectCategory === "function";
  const { totalItems } = useCart();
  const { categories, loading } = useCategories();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Checkout sayfasında kategorileri fetch etme
  const displayCategories = showCategories ? categories : [];
  const displayLoading = showCategories ? loading : false;

  const handleSelectCategory = (id: string | null) => {
    onSelectCategory?.(id);
    setMobileMenuOpen(false);
  };

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

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur-xl"
    >
      <nav className="relative flex h-14 w-full items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        {/* Mobil: Hamburger + Logo */}
        <div className="flex items-center gap-3 md:hidden">
          {showCategories ? (
            <Button
              variant="ghost"
              size="icon"
              className="-ml-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menüyü aç"
            >
              <Menu className="h-5 w-5" />
            </Button>
          ) : null}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900"
          >
            <Image
              src="/logo.png"
              alt="CN Toptan Gıda"
              width={36}
              height={36}
              className="shrink-0"
            />
            <span>CN Toptan Gıda</span>
          </Link>
        </div>

        {/* Desktop: Sol - Kategoriler */}
        <div className="hidden min-w-0 flex-1 items-center md:flex">
          {showCategories && (
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Kategoriler
            </span>
          )}
        </div>

        {/* Desktop: Orta - Logo + yazı tam ortada */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 flex hidden -translate-x-1/2 -translate-y-1/2 items-center gap-3 text-2xl font-bold tracking-tight text-neutral-900 transition-colors hover:text-neutral-700 md:flex md:text-3xl xl:text-4xl"
        >
          <Image
            src="/logo.png"
            alt="CN Toptan Gıda"
            width={44}
            height={44}
            className="shrink-0 xl:h-12 xl:w-12"
          />
          <span>CN Toptan Gıda</span>
        </Link>

        {/* Sağ - Sepet */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
          <CartDrawer
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-neutral-200 bg-neutral-50/80 text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-100 sm:h-14 sm:w-14"
                aria-label="Sepet"
              >
                <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white shadow-md">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Button>
            }
          />
        </div>
      </nav>

      {/* Mobil Kategori Drawer - Portal ile body'e render, z-index sorununu önler */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {showCategories && mobileMenuOpen && (
              <div
                key="mobile-menu"
                className="fixed inset-0 z-[100] md:hidden"
                aria-modal="true"
                role="dialog"
              >
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Kapat"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <button
                  onClick={() => handleSelectCategory(null)}
                  className={cn(
                    "mb-1 flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                    !selectedCategoryId
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-700 hover:bg-neutral-100"
                  )}
                >
                  Tümü
                </button>
                {displayLoading ? (
                  <div className="space-y-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-12 animate-pulse rounded-xl bg-neutral-100"
                      />
                    ))}
                  </div>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className={cn(
                        "mb-1 flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                        selectedCategoryId === cat.id
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-700 hover:bg-neutral-100"
                      )}
                    >
                      {cat.name}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
          document.body
        )}
    </motion.header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ProductImage";
import { useProducts } from "@/hooks/useProducts";

const HERO_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1604719314766-9042ebbb02c5?auto=format&fit=crop&w=2400&q=82";

function pickRandomProductImage(products: { image: string }[]): string | null {
  const withImage = products.filter((p) => p.image?.trim());
  if (withImage.length === 0) return null;
  return withImage[Math.floor(Math.random() * withImage.length)]!.image;
}

const TRUST_LINE = [
  "Güvenli işlem",
  "Şeffaf süreç",
  "Kurumsal kalite",
] as const;

export function Hero() {
  const { products, loading, error } = useProducts(null);
  const [bgSrc, setBgSrc] = useState<string>(HERO_FALLBACK_IMAGE);

  useEffect(() => {
    if (loading) return;
    if (error) {
      setBgSrc(HERO_FALLBACK_IMAGE);
      return;
    }
    const chosen = pickRandomProductImage(products);
    setBgSrc(chosen ?? HERO_FALLBACK_IMAGE);
  }, [loading, error, products]);

  const goToCatalog = () => {
    document.getElementById("urunler")?.scrollIntoView({ behavior: "smooth" });
  };

  const focusSearch = () => {
    document.getElementById("main-search")?.focus({ preventScroll: false });
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] min-h-[calc(100dvh-3.5rem)] w-full shrink-0 flex-col overflow-hidden bg-zinc-900 sm:h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-4rem)]"
    >
      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <ProductImage
            src={bgSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-black/85" aria-hidden />
      </div>

      <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col px-5 pb-[4.25rem] pt-10 sm:px-10 sm:pb-24 sm:pt-14 lg:px-14 lg:pb-28">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center">
          <div className="mx-auto w-full max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs font-medium tracking-[0.2em] text-white/45 sm:text-[13px] sm:tracking-[0.24em]"
            >
              Toptan tedarik
            </motion.p>
            <div className="mt-4 h-px w-10 bg-white/25 sm:mt-5 sm:w-12" aria-hidden />

            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 text-balance text-[1.875rem] font-semibold leading-[1.07] tracking-[-0.03em] text-white sm:mt-8 sm:text-4xl md:text-5xl lg:text-[3.125rem]"
            >
              Kurumsal kalitede toptan çözümler
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-5 max-w-md text-pretty text-[15px] leading-[1.55] text-white/60 sm:mt-6 sm:text-base sm:leading-relaxed"
            >
              İhtiyacınız olan ürünleri tek yerden seçin, güvenle sipariş verin.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.16,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-9 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-3"
            >
              <Button
                size="lg"
                onClick={goToCatalog}
                className="relative h-12 w-full overflow-hidden rounded-full border border-white/30 bg-gradient-to-b from-white via-white to-neutral-100 px-8 text-sm font-semibold tracking-[-0.01em] text-neutral-900 shadow-[0_1px_0_0_rgba(255,255,255,0.55)_inset,0_10px_28px_-8px_rgba(0,0,0,0.45)] transition-[transform,box-shadow,background-color] duration-300 hover:border-white/50 hover:from-neutral-50 hover:via-white hover:to-neutral-50 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.65)_inset,0_14px_36px_-10px_rgba(0,0,0,0.5)] active:scale-[0.98] sm:h-11 sm:w-auto"
              >
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/25 to-white/0 opacity-0 transition-opacity duration-300 group-hover/button:opacity-100"
                  aria-hidden
                />
                <span className="relative">Ürünleri incele</span>
                <ArrowRight
                  className="relative ml-1.5 size-4 opacity-60 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:opacity-90"
                  strokeWidth={2}
                />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={focusSearch}
                className="h-12 w-full rounded-full border border-amber-200/25 bg-[linear-gradient(135deg,rgba(212,175,55,0.14)_0%,rgba(255,248,220,0.07)_40%,rgba(180,134,11,0.12)_100%)] px-8 text-sm font-medium tracking-[-0.01em] text-white/95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-[8px] transition-[transform,box-shadow,border-color,filter] duration-300 hover:border-amber-200/40 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),0_6px_24px_-12px_rgba(0,0,0,0.35)] hover:!bg-[linear-gradient(135deg,rgba(212,175,55,0.22)_0%,rgba(255,248,220,0.11)_42%,rgba(160,120,30,0.18)_100%)] hover:!text-white focus-visible:border-amber-200/45 focus-visible:ring-amber-200/20 active:scale-[0.98] sm:h-11 sm:w-auto"
              >
                Ürün ara
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="shrink-0 pt-8 text-center text-[13px] font-normal tracking-[-0.01em] text-white/38 sm:pt-10 sm:text-sm sm:text-white/32"
        >
          {TRUST_LINE.join("  ·  ")}
        </motion.p>
      </div>

      <button
        type="button"
        onClick={goToCatalog}
        className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-white/35 transition-colors hover:text-white/60 focus:outline-none focus-visible:text-white/80 focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent [@media(max-height:460px)]:hidden sm:bottom-7"
        aria-label="Ürün listesine kaydır"
      >
        <ChevronDown className="size-5" strokeWidth={1.25} />
      </button>
    </section>
  );
}

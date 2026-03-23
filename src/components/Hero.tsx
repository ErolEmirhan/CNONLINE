"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Box, Eye, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ProductImage";
import { useProducts } from "@/hooks/useProducts";
import { AnimatePresence, motion } from "framer-motion";

const HERO_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1604719314766-9042ebbb02c5?auto=format&fit=crop&w=2400&q=82";

function pickHeroImages(products: { image: string }[], count = 3): string[] {
  const unique = Array.from(
    new Set(products.map((p) => p.image?.trim()).filter(Boolean))
  ) as string[];
  if (unique.length === 0) return [HERO_FALLBACK_IMAGE];

  for (let i = unique.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [unique[i], unique[j]] = [unique[j]!, unique[i]!];
  }

  return unique.slice(0, Math.min(count, unique.length));
}

const TRUST_LINE = [
  "Güvenli işlem",
  "Şeffaf süreç",
  "Kurumsal kalite",
] as const;

const SYMBOLS = [
  {
    Icon: Box,
    label: "Tedarik",
    circleClass:
      "border-amber-400/45 bg-amber-500/[0.12] shadow-[0_0_28px_-6px_rgba(251,191,36,0.4),inset_0_1px_0_rgba(255,255,255,0.12)]",
    iconClass:
      "text-amber-100 drop-shadow-[0_0_14px_rgba(252,211,77,0.55)]",
    captionClass: "text-amber-100/75",
  },
  {
    Icon: Shield,
    label: "Güven",
    circleClass:
      "border-emerald-400/40 bg-emerald-500/[0.1] shadow-[0_0_28px_-6px_rgba(52,211,153,0.38),inset_0_1px_0_rgba(255,255,255,0.1)]",
    iconClass:
      "text-emerald-200 drop-shadow-[0_0_14px_rgba(110,231,183,0.5)]",
    captionClass: "text-emerald-100/75",
  },
  {
    Icon: Eye,
    label: "Şeffaflık",
    circleClass:
      "border-sky-400/40 bg-sky-500/[0.1] shadow-[0_0_28px_-6px_rgba(56,189,248,0.38),inset_0_1px_0_rgba(255,255,255,0.1)]",
    iconClass:
      "text-sky-100 drop-shadow-[0_0_14px_rgba(125,211,252,0.55)]",
    captionClass: "text-sky-100/80",
  },
] as const;

export function Hero() {
  const { products, loading, error } = useProducts(null);
  const [bgImages, setBgImages] = useState<string[]>([HERO_FALLBACK_IMAGE]);
  const [activeBgIndex, setActiveBgIndex] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (error) {
      setBgImages([HERO_FALLBACK_IMAGE]);
      setActiveBgIndex(0);
      return;
    }
    const chosen = pickHeroImages(products, 3);
    setBgImages(chosen);
    setActiveBgIndex(0);
  }, [loading, error, products]);

  useEffect(() => {
    if (bgImages.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, [bgImages]);

  const goToCatalog = () => {
    document.getElementById("urunler")?.scrollIntoView({ behavior: "smooth" });
  };

  const focusSearch = () => {
    document.getElementById("main-search")?.focus({ preventScroll: false });
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] w-full shrink-0 flex-col overflow-hidden bg-neutral-950"
    >
      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <AnimatePresence initial={false}>
            <motion.div
              key={`${bgImages[activeBgIndex]}-${activeBgIndex}`}
              className="absolute inset-0"
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductImage
                src={bgImages[activeBgIndex] ?? HERO_FALLBACK_IMAGE}
                alt=""
                fill
                priority={activeBgIndex === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/92 via-black/78 to-black/94"
          aria-hidden
        />
        {/* Merkezde hafif ışık halkası — derinlik */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_42%,rgba(255,255,255,0.06),transparent_72%)]"
          aria-hidden
        />
      </div>

      {/* Sembolik arka plan öğeleri */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(10rem,32vw,22rem)] font-extralight leading-none tracking-[0.02em] text-white/[0.045]">
          CN
        </div>
        <div className="absolute inset-x-6 inset-y-10 border border-white/[0.07] sm:inset-x-10 sm:inset-y-12 lg:inset-x-16" />
        <div className="absolute left-1/2 top-1/2 h-[min(75vh,640px)] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-white/[0.07] to-transparent" />
        <div className="absolute left-8 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent sm:block lg:left-14" />
        <div className="absolute right-8 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent sm:block lg:right-14" />
      </div>

      <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col items-center justify-center px-6 pb-20 pt-10 sm:px-10 sm:pb-24 sm:pt-12 lg:px-16">
        <div className="flex w-full max-w-4xl flex-col items-center text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-white/50 sm:text-xs">
            Toptan tedarik
          </p>

          <div
            className="my-5 flex items-center justify-center gap-4 sm:my-6"
            aria-hidden
          >
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/35 sm:w-14" />
            <span className="text-[10px] text-white/35 sm:text-xs">◆</span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/35 sm:w-14" />
          </div>

          <h1
            id="hero-heading"
            className="text-balance text-[1.85rem] font-light leading-[1.1] tracking-[-0.035em] text-white sm:text-5xl md:text-6xl md:leading-[1.06] lg:text-[3.5rem]"
          >
            Kurumsal kalitede
            <span className="mt-1 block font-normal tracking-[-0.03em] text-white/95 sm:mt-1.5">
              toptan çözümler
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-lg text-pretty text-[15px] leading-relaxed text-white/50 sm:mt-8 sm:text-base">
            İşletmeniz için tek platform, güvenilir tedarik ve şeffaf süreç.
          </p>

          <div className="mt-9 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={goToCatalog}
              className="h-12 w-full rounded-sm border border-white/30 bg-white px-10 text-[13px] font-semibold tracking-wide text-neutral-950 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-[transform,background-color] hover:bg-neutral-100 sm:h-12 sm:w-auto sm:min-w-[200px]"
            >
              Ürünleri incele
              <ArrowRight className="ml-2 size-4 opacity-80" strokeWidth={2} />
            </Button>
            <button
              type="button"
              onClick={focusSearch}
              className="h-12 w-full rounded-sm border border-white/20 bg-transparent px-10 text-[13px] font-medium tracking-wide text-white/90 transition-colors hover:border-white/35 hover:bg-white/[0.06] sm:h-12 sm:w-auto sm:min-w-[200px]"
            >
              Ürün ara
            </button>
          </div>

          <ul
            className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:mt-16 sm:gap-x-14"
            aria-label="Öne çıkan değerler"
          >
            {SYMBOLS.map(
              ({ Icon, label, circleClass, iconClass, captionClass }) => (
                <li
                  key={label}
                  className="flex flex-col items-center gap-2.5 text-center"
                >
                  <span
                    className={`flex size-11 items-center justify-center rounded-full border ${circleClass}`}
                  >
                    <Icon
                      className={`size-5 ${iconClass}`}
                      strokeWidth={1.25}
                      aria-hidden
                    />
                  </span>
                  <span
                    className={`text-[11px] font-medium uppercase tracking-[0.28em] ${captionClass}`}
                  >
                    {label}
                  </span>
                </li>
              )
            )}
          </ul>

          <p className="mt-12 max-w-md text-[12px] font-normal leading-relaxed tracking-wide text-white/32 sm:mt-14 sm:text-[13px]">
            {TRUST_LINE.join("  ·  ")}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={goToCatalog}
        className="absolute bottom-5 left-1/2 z-10 flex min-h-11 min-w-11 -translate-x-1/2 items-end justify-center pb-1 text-white/35 transition-colors hover:text-white/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent [@media(max-height:460px)]:hidden sm:bottom-7"
        aria-label="Ürün listesine kaydır"
      >
        <span className="block h-10 w-px bg-gradient-to-b from-white/50 to-transparent" />
      </button>
    </section>
  );
}

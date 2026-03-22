"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const TOTAL_MS = 2500;
const FADE_START_MS = 2200;

export function SplashScreen() {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setShow(true);
    setFadeOut(false);
    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(() => setFadeOut(true), FADE_START_MS);
    const hideTimer = window.setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, TOTAL_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
      document.body.style.overflow = "";
    };
  }, [pathname]);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white transition-opacity duration-300 ease-out",
        fadeOut ? "pointer-events-none opacity-0" : "opacity-100"
      )}
      aria-hidden
    >
      <div
        key={pathname}
        className="flex flex-col items-center"
      >
        {/* Tek katman: orijinal logo — altın filtre / clip-path kutu oluşturmaz */}
        <Image
          src="/logo.png"
          alt=""
          width={360}
          height={360}
          priority
          unoptimized
          className="h-auto w-[min(72vw,280px)] max-w-[360px] select-none object-contain sm:w-[min(70vw,320px)]"
        />

        <div className="mt-8 grid [grid-template-areas:'stack'] place-items-center px-6 text-center sm:mt-10">
          <span
            className="col-start-1 row-start-1 bg-[linear-gradient(105deg,#7a5c10_0%,#b8860b_18%,#e8d48b_38%,#d4af37_55%,#9a7318_78%,#6b4f0a_100%)] bg-clip-text text-[clamp(2.7rem,9vw,4.7rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-transparent [grid-area:stack] [-webkit-background-clip:text]"
          >
            CN Toptan Gıda
          </span>
          <span
            className="animate-splash-gold-mask col-start-1 row-start-1 text-[clamp(2.7rem,9vw,4.7rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-neutral-900 [grid-area:stack]"
          >
            CN Toptan Gıda
          </span>
        </div>
      </div>
    </div>
  );
}

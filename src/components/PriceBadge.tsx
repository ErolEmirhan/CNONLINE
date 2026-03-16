"use client";

import { cn } from "@/lib/utils";

interface PriceBadgeProps {
  price: number;
  className?: string;
  /** sm: kartlar, md: detay/modal, lg: vurgu alanları */
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs font-semibold rounded-xl",
  md: "px-4 py-2 text-base font-semibold rounded-2xl",
  lg: "px-5 py-3 text-xl font-semibold rounded-2xl",
};

export function PriceBadge({ price, className, size = "sm" }: PriceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center tracking-tight text-white/95",
        "bg-gradient-to-br from-emerald-400 via-teal-400 to-green-500",
        "backdrop-blur-sm",
        sizeStyles[size],
        className
      )}
      style={{
        boxShadow: "0 4px 14px rgba(52, 211, 153, 0.3)",
      }}
    >
      ₺{price.toLocaleString("tr-TR")}
    </span>
  );
}

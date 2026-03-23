"use client";

import { AlertCircle, Package, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTryWhole } from "@/lib/store-settings-doc";
import type { StoreSettings } from "@/types";

interface CartOrderThresholdsProps {
  totalPrice: number;
  settings: StoreSettings;
  isLoading: boolean;
  className?: string;
}

export function CartOrderThresholds({
  totalPrice,
  settings,
  isLoading,
  className,
}: CartOrderThresholdsProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-xl border border-neutral-100 bg-neutral-50/80 p-3",
          className
        )}
      >
        <div className="h-3 w-2/3 rounded bg-neutral-200" />
        <div className="mt-2 h-2 w-full rounded bg-neutral-200" />
      </div>
    );
  }

  const min = settings.minimumCartTotal;
  const freeAt = settings.freeShippingMinimumCart;
  const hasMin = min > 0;
  const hasFree = freeAt > 0;

  if (!hasMin && !hasFree) return null;

  const minMet = !hasMin || totalPrice >= min;
  const freeMet = !hasFree || totalPrice >= freeAt;
  const needMin = hasMin ? Math.max(0, min - totalPrice) : 0;
  const needFree = hasFree ? Math.max(0, freeAt - totalPrice) : 0;

  const minProgressPct = hasMin
    ? Math.min(100, Math.round((totalPrice / min) * 100))
    : 100;
  const freeProgressPct = hasFree
    ? Math.min(100, Math.round((totalPrice / freeAt) * 100))
    : 100;

  return (
    <div className={cn("space-y-3", className)}>
      {hasMin && !minMet && (
        <div className="rounded-xl border border-amber-200/90 bg-gradient-to-br from-amber-50 to-orange-50/60 p-3.5 shadow-sm">
          <div className="flex gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Package className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-amber-950">
                Minimum sepet tutarı
              </p>
              <p className="mt-1 text-xs leading-relaxed text-amber-900/85">
                Sipariş verebilmek için sepet toplamınız en az{" "}
                <span className="font-semibold text-amber-950">
                  {formatTryWhole(min)}
                </span>{" "}
                olmalı.
              </p>
              <p className="mt-2 text-sm font-semibold text-amber-950">
                {formatTryWhole(needMin)} daha ekleyin
              </p>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-amber-200/70">
            <div
              className="h-full rounded-full bg-amber-500 transition-[width] duration-500 ease-out"
              style={{ width: `${minProgressPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-amber-800/70">
            Sepet: {formatTryWhole(totalPrice)} / {formatTryWhole(min)}
          </p>
        </div>
      )}

      {minMet && hasFree && !freeMet && (
        <div className="rounded-xl border border-violet-200/90 bg-gradient-to-br from-violet-50 to-indigo-50/50 p-3.5 shadow-sm">
          <div className="flex gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
              <Truck className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-violet-950">
                Ücretsiz kargo
              </p>
              <p className="mt-1 text-xs leading-relaxed text-violet-900/85">
                Sepetiniz{" "}
                <span className="font-semibold text-violet-950">
                  {formatTryWhole(freeAt)}
                </span>{" "}
                ve üzeri olduğunda kargo ücreti alınmaz.
              </p>
              <p className="mt-2 text-sm font-semibold text-violet-950">
                {formatTryWhole(needFree)} daha alışveriş yapın
              </p>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-violet-200/70">
            <div
              className="h-full rounded-full bg-violet-500 transition-[width] duration-500 ease-out"
              style={{ width: `${freeProgressPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-violet-800/70">
            {freeProgressPct}% — {formatTryWhole(totalPrice)} /{" "}
            {formatTryWhole(freeAt)}
          </p>
        </div>
      )}

      {minMet && hasFree && freeMet && (
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200/90 bg-emerald-50/90 px-3.5 py-3 text-sm text-emerald-950">
          <Truck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="leading-snug">
            <span className="font-semibold">Kargo ücretsiz.</span> Bu sepet
            tutarıyla gönderim ücreti yansıtılmaz.
          </p>
        </div>
      )}

      {minMet && !hasFree && hasMin && (
        <div className="flex items-start gap-2 rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-2.5 text-xs text-neutral-600">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-500" />
          <span>Minimum sepet şartını karşıladınız; siparişe devam edebilirsiniz.</span>
        </div>
      )}
    </div>
  );
}

export function cartMeetsMinimumOrder(
  totalPrice: number,
  minimumCartTotal: number
): boolean {
  return minimumCartTotal <= 0 || totalPrice >= minimumCartTotal;
}

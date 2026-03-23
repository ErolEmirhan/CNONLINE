import { doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { StoreSettings } from "@/types";

/**
 * Firestore okunamazsa veya koleksiyonda belge yoksa kullanılan varsayılanlar.
 * (İşletme eşikleri — Firestore senkron olunca güncellenir.)
 */
export const STORE_SETTINGS_FALLBACK: StoreSettings = {
  minimumCartTotal: 500,
  freeShippingMinimumCart: 1200,
};

/**
 * Belirli bir belgeyi dinlemek için `.env.local`:
 * NEXT_PUBLIC_FIRESTORE_SETTINGS_DOC_ID=belgeKimligi
 * Boş bırakılırsa `settings` koleksiyonundaki ilk belge kullanılır (limit 1).
 */
export function getExplicitSettingsDocumentId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_FIRESTORE_SETTINGS_DOC_ID?.trim();
  return id || undefined;
}

export function storeSettingsDocRef(documentId: string) {
  return doc(db, "settings", documentId);
}

function coerceNonNegativeNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }
  if (typeof value === "bigint") {
    const n = Number(value);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  if (value && typeof value === "object" && "toNumber" in value) {
    const toNum = (value as { toNumber?: () => number }).toNumber;
    if (typeof toNum === "function") {
      try {
        const n = toNum.call(value);
        if (typeof n === "number" && Number.isFinite(n) && n >= 0) return n;
      } catch {
        /* ignore */
      }
    }
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return 0;
}

export function parseStoreSettingsData(
  data: Record<string, unknown> | undefined
): StoreSettings {
  return {
    minimumCartTotal: coerceNonNegativeNumber(data?.minimumCartTotal),
    freeShippingMinimumCart: coerceNonNegativeNumber(
      data?.freeShippingMinimumCart
    ),
  };
}

export function formatTryWhole(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

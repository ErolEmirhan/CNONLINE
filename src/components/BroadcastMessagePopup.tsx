"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProductImage } from "@/components/ProductImage";

type BroadcastMessage = {
  id: string;
  seenKey: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAtMs: number;
};

const STORAGE_KEY = "broadcastmessages_seen_keys_v2";
const DEV_DISMISS_KEY = "broadcastmessages_dev_dismissed_keys_v1";

function readSeenIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function pushSeenId(id: string) {
  if (typeof window === "undefined") return;
  const prev = readSeenIds();
  if (prev.includes(id)) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...prev, id]));
}

function readDevDismissedKeys(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DEV_DISMISS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function pushDevDismissedKey(key: string) {
  if (typeof window === "undefined") return;
  const prev = readDevDismissedKeys();
  if (prev.includes(key)) return;
  window.localStorage.setItem(DEV_DISMISS_KEY, JSON.stringify([...prev, key]));
}

function parseCreatedAtMs(data: Record<string, unknown>): number {
  const v = data.createdAt as
    | { toMillis?: () => number; seconds?: number }
    | number
    | undefined;
  if (typeof v === "number") return v;
  if (v && typeof v === "object") {
    if (typeof v.toMillis === "function") return v.toMillis();
    if (typeof v.seconds === "number") return v.seconds * 1000;
  }
  return 0;
}

function parseDateMs(value: unknown): number {
  if (typeof value === "number") return value;
  if (value && typeof value === "object") {
    const v = value as { toMillis?: () => number; seconds?: number };
    if (typeof v.toMillis === "function") return v.toMillis();
    if (typeof v.seconds === "number") return v.seconds * 1000;
  }
  return 0;
}

function toBroadcastMessage(
  id: string,
  data: Record<string, unknown>
): BroadcastMessage | null {
  const enabled = data.enabled;
  const isActive = data.isActive;
  const isPublic = data.isPublic;
  const status = typeof data.status === "string" ? data.status.trim().toLowerCase() : "";
  if (
    enabled === false ||
    isActive === false ||
    isPublic === false ||
    (status && status !== "published" && status !== "active")
  ) {
    return null;
  }

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const content =
    typeof data.content === "string"
      ? data.content.trim()
      : typeof data.body === "string"
        ? data.body.trim()
        : "";
  if (!title && !content) return null;

  const imageUrl =
    typeof data.imageUrl === "string"
      ? data.imageUrl
      : typeof data.image === "string"
        ? data.image
        : typeof data.imageBase64 === "string"
          ? data.imageBase64
        : undefined;
  const createdAtMs = parseCreatedAtMs(data);
  const updatedAtMs = parseDateMs(data.updatedAt);
  const versionMs = updatedAtMs || createdAtMs;

  return {
    id,
    seenKey: `${id}:${versionMs || 0}`,
    title: title || "Duyuru",
    content,
    imageUrl: imageUrl?.trim() || undefined,
    createdAtMs,
  };
}

export function BroadcastMessagePopup() {
  const [message, setMessage] = useState<BroadcastMessage | null>(null);
  const isDevMode = process.env.NODE_ENV !== "production";

  useEffect(() => {
    const refs = [
      "broadcastmesasges",
      "broadcastmessages",
      "broadcastMesages",
      "broadcastMessages",
    ].map((name) => collection(db, name));
    const entries = new Map<string, BroadcastMessage>();
    let hasAnyError = false;

    const publish = () => {
      const seen = new Set(readSeenIds());
      const devDismissed = new Set(readDevDismissedKeys());
      const candidates = Array.from(entries.values()).filter((x) =>
        isDevMode ? !devDismissed.has(x.seenKey) : !seen.has(x.seenKey)
      );
      candidates.sort((a, b) => b.createdAtMs - a.createdAtMs);
      const next = candidates[0] ?? null;
      if (!next) {
        if (hasAnyError && entries.size === 0) setMessage(null);
        if (!hasAnyError) setMessage(null);
        return;
      }
      if (!isDevMode) {
        pushSeenId(next.seenKey);
      }
      setMessage(next);
    };

    const unsubscribers = refs.map((ref) =>
      onSnapshot(
        ref,
        (snap) => {
          hasAnyError = false;
          for (const doc of snap.docs) {
            const parsed = toBroadcastMessage(doc.id, doc.data() as Record<string, unknown>);
            if (!parsed) continue;
            entries.set(parsed.id, parsed);
          }
          publish();
        },
        () => {
          hasAnyError = true;
          publish();
        }
      )
    );

    return () => {
      for (const unsub of unsubscribers) unsub();
    };
  }, []);

  const imageNode = useMemo(() => {
    if (!message?.imageUrl) return null;
    return (
      <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200/90 bg-gradient-to-br from-neutral-50 to-white p-2.5 shadow-inner">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-neutral-200/80 bg-white">
        <ProductImage
          src={message.imageUrl}
          alt={message.title || "Yayın mesajı görseli"}
          fill
          className="object-contain p-2"
          sizes="(max-width: 640px) 100vw, 560px"
        />
        </div>
      </div>
    );
  }, [message?.imageUrl]);

  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Yayın mesajı"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/60 bg-[linear-gradient(160deg,#ffffff_0%,#fcfcfd_52%,#f6f7f9_100%)] p-5 shadow-[0_34px_90px_-26px_rgba(0,0,0,0.5)] sm:p-6"
          >
            <button
              type="button"
              onClick={() => setMessage(null)}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-neutral-500 transition-colors hover:text-neutral-900"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="mb-2 inline-flex items-center rounded-full border border-indigo-200/70 bg-indigo-50/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-700">
              Duyuru
            </p>
            <h3 className="pr-8 text-[1.35rem] font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              {message.title}
            </h3>
            {message.content ? (
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
                {message.content}
              </p>
            ) : null}

            {imageNode ? <div className="mt-4">{imageNode}</div> : null}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setMessage(null)}
                className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
              >
                Tamam
              </button>
              {isDevMode ? (
                <button
                  type="button"
                  onClick={() => {
                    pushDevDismissedKey(message.seenKey);
                    setMessage(null);
                  }}
                  className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  Bir daha gösterme
                </button>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

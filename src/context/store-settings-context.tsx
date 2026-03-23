"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
} from "firebase/firestore";
import type { StoreSettings } from "@/types";
import { db } from "@/lib/firebase";
import {
  getExplicitSettingsDocumentId,
  parseStoreSettingsData,
  storeSettingsDocRef,
  STORE_SETTINGS_FALLBACK,
} from "@/lib/store-settings-doc";

interface StoreSettingsContextValue {
  settings: StoreSettings;
  isLoading: boolean;
  error: Error | null;
}

const StoreSettingsContext = createContext<StoreSettingsContextValue | null>(
  null
);

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(
    STORE_SETTINGS_FALLBACK
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const explicitId = getExplicitSettingsDocumentId();

    const finish = (data: Record<string, unknown> | undefined) => {
      setSettings(parseStoreSettingsData(data));
      setError(null);
    };

    const onError = (err: Error) => {
      setError(err);
      setSettings(STORE_SETTINGS_FALLBACK);
    };

    if (explicitId) {
      const ref = storeSettingsDocRef(explicitId);
      return onSnapshot(
        ref,
        (snap) => {
          if (!snap.exists()) {
            setSettings(STORE_SETTINGS_FALLBACK);
          } else {
            finish(snap.data() as Record<string, unknown>);
          }
        },
        onError
      );
    }

    const q = query(collection(db, "settings"), limit(1));
    return onSnapshot(
      q,
      (snap) => {
        if (snap.empty) {
          setSettings(STORE_SETTINGS_FALLBACK);
          setError(null);
        } else {
          finish(snap.docs[0].data() as Record<string, unknown>);
        }
      },
      onError
    );
  }, []);

  const value = useMemo(
    () => ({ settings, isLoading, error }),
    [settings, isLoading, error]
  );

  return (
    <StoreSettingsContext.Provider value={value}>
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  const ctx = useContext(StoreSettingsContext);
  if (!ctx) {
    throw new Error("useStoreSettings must be used within StoreSettingsProvider");
  }
  return ctx;
}

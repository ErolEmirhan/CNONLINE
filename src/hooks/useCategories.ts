"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, type QuerySnapshot, type DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Category } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot: QuerySnapshot<DocumentData> = await getDocs(
          collection(db, "categories")
        );
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        // order varsa sırala, yoksa ekleme sırasına göre
        data.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setCategories(data);
        setError(null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Kategoriler yüklenemedi";
        setError(msg);
        setCategories([]);
        console.error("Firebase categories error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading, error };
}

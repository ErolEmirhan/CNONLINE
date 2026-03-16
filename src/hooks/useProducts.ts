"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  type QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/types";

export function useProducts(categoryId: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const col = collection(db, "products");
        const q = categoryId
          ? query(
              col,
              where("categoryId", "==", categoryId)
            )
          : col;
        const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            // Firestore'da imageBase64 kullanılıyorsa image'e map et
            image: d.image ?? d.imageBase64 ?? "",
          } as Product;
        });
        setProducts(data);
        setError(null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Ürünler yüklenemedi";
        setError(msg);
        setProducts([]);
        console.error("Firebase products error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  return { products, loading, error };
}

"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, type DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/types";

export function useProduct(productId: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", productId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const d = snapshot.data() as DocumentData;
          setProduct({
            id: snapshot.id,
            ...d,
            image: d.image ?? d.imageBase64 ?? "",
          } as Product);
        } else {
          setProduct(null);
        }
        setError(null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Ürün yüklenemedi";
        setError(msg);
        setProduct(null);
        console.error("Firebase product error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  return { product, loading, error };
}

/** Ana sayfa ürün görünümü: keşifte yatay kaydırma; tümü/kategori seçilince grid */
export type HomeFilter =
  | { mode: "explore" }
  | { mode: "all" }
  | { mode: "category"; id: string }
  | { mode: "category-grid"; id: string };

"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Base64 data URL'leri (Firestore'dan) ve normal URL'leri destekler.
 * Next.js Image bileşeni base64 ile sorun çıkarabildiği için,
 * data: ile başlayan veya ham base64 string'ler için native img kullanılır.
 */
function getImageSrc(src: string): { isBase64: boolean; url: string } {
  if (!src || typeof src !== "string") return { isBase64: false, url: src };
  if (src.startsWith("data:")) return { isBase64: true, url: src };
  // Ham base64 (data: prefix olmadan) - Firebase bazen böyle saklar
  if (/^[A-Za-z0-9+/=]+$/.test(src) && src.length > 100) {
    const mime = src.startsWith("iVBOR") ? "image/png" : "image/jpeg";
    return { isBase64: true, url: `data:${mime};base64,${src}` };
  }
  return { isBase64: false, url: src };
}

interface ProductImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

export function ProductImage({
  src,
  alt,
  fill = false,
  className,
  sizes,
  priority,
  width,
  height,
}: ProductImageProps) {
  const { isBase64: useBase64, url } = getImageSrc(src);
  if (!url) return null;

  if (useBase64) {
    return (
      <img
        src={url}
        alt={alt}
        className={cn(
          "object-cover",
          fill && "absolute inset-0 h-full w-full",
          className
        )}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 200}
      height={height ?? 200}
      className={cn("object-cover", className)}
      sizes={sizes}
      priority={priority}
    />
  );
}

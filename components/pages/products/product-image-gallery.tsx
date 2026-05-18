"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const total = images.length;
  const hasMultiple = total > 1;

  const goPrev = useCallback(() => {
    setSelectedIndex((i) => (i <= 0 ? total - 1 : i - 1));
  }, [total]);

  const goNext = useCallback(() => {
    setSelectedIndex((i) => (i >= total - 1 ? 0 : i + 1));
  }, [total]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl border border-border/60 bg-muted/30 text-muted-foreground">
        No image
      </div>
    );
  }

  const currentUrl = images[selectedIndex];
  const unoptimized = currentUrl.startsWith("http://");

  return (
    <div className="space-y-4">
      {/* Main image with arrows */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted/30">
        <Image
          src={currentUrl}
          alt={productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-4"
          priority={selectedIndex === 0}
          unoptimized={unoptimized}
        />
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6 text-foreground" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
              aria-label="Next image"
            >
              <ChevronRight className="size-6 text-foreground" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40",
                i === selectedIndex
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border/60 bg-muted/30 hover:border-primary/50"
              )}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === selectedIndex}
            >
              <Image
                src={url}
                alt={`${productName} - ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                unoptimized={url.startsWith("http://")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import "@/styles/product-gallery.css";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ProductImageGallery({
  images,
  productName,
  className,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageLayerRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(0);
  const total = images.length;
  const hasMultiple = total > 1;

  const goPrev = useCallback(() => {
    setSlideDirection(-1);
    setSelectedIndex((i) => (i <= 0 ? total - 1 : i - 1));
  }, [total]);

  const goNext = useCallback(() => {
    setSlideDirection(1);
    setSelectedIndex((i) => (i >= total - 1 ? 0 : i + 1));
  }, [total]);

  const selectIndex = useCallback(
    (i: number) => {
      setSlideDirection(i >= selectedIndex ? 1 : -1);
      setSelectedIndex(i);
    },
    [selectedIndex],
  );

  useEffect(() => {
    if (!stageRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(stageRef.current, {
        opacity: 0,
        scale: 0.94,
        duration: 1.15,
        ease: "power3.out",
      });

      if (imageLayerRef.current) {
        gsap.from(imageLayerRef.current, {
          opacity: 0,
          scale: 1.05,
          duration: 1.25,
          delay: 0.2,
          ease: "power3.out",
        });
      }
    }, stageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!imageLayerRef.current || prevIndexRef.current === selectedIndex) {
      prevIndexRef.current = selectedIndex;
      return;
    }

    prevIndexRef.current = selectedIndex;

    if (prefersReducedMotion()) return;

    const dir = slideDirection;
    const el = imageLayerRef.current;

    gsap.fromTo(
      el,
      { x: dir * 56, opacity: 0, scale: 1.03, filter: "blur(10px)" },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.85,
        ease: "power3.out",
      },
    );
  }, [selectedIndex, slideDirection]);

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[2rem] border border-[var(--nirvana-sage)]/25 bg-white sm:rounded-[2.25rem] lg:rounded-[2.5rem]",
          className,
        )}
      >
        <span className="absolute inset-0 flex items-center justify-center font-body-strong text-xs uppercase tracking-[0.35em] text-[var(--nirvana-sage)]">
          No image
        </span>
      </div>
    );
  }

  const currentUrl = images[selectedIndex];
  const unoptimized = currentUrl.startsWith("http://");

  return (
    <div className={cn("product-gallery w-full max-w-none", className)}>
      <div
        ref={stageRef}
        className="product-gallery__stage relative w-full shrink-0 overflow-hidden rounded-[2rem] border border-[var(--nirvana-sage)]/20 bg-white shadow-[0_20px_48px_-16px_rgba(42,69,56,0.1)] sm:rounded-[2.25rem] lg:rounded-[2.5rem]"
      >
        <div
          ref={imageLayerRef}
          className="product-gallery__image-wrap relative w-full"
        >
          <Image
            key={currentUrl}
            src={currentUrl}
            alt={productName}
            width={1200}
            height={1500}
            sizes="(max-width: 1024px) 100vw, 44vw"
            className="block h-auto w-full rounded-[2rem] sm:rounded-[2.25rem] lg:rounded-[2.5rem]"
            priority={selectedIndex === 0}
            unoptimized={unoptimized}
          />
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--nirvana-sage)]/40 bg-white/85 text-[var(--nirvana-deep)] shadow-sm backdrop-blur-md transition-all hover:border-[var(--nirvana-gold)]/50 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nirvana-gold)]/50 md:left-6 md:size-14"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6" strokeWidth={1.25} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--nirvana-sage)]/40 bg-white/85 text-[var(--nirvana-deep)] shadow-sm backdrop-blur-md transition-all hover:border-[var(--nirvana-gold)]/50 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nirvana-gold)]/50 md:right-6 md:size-14"
              aria-label="Next image"
            >
              <ChevronRight className="size-6" strokeWidth={1.25} />
            </button>
            <p className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-[var(--nirvana-sage)]/35 bg-white/85 px-5 py-2 font-body-strong text-[10px] uppercase tracking-[0.4em] text-[var(--nirvana-deep)] shadow-sm backdrop-blur-md">
              {String(selectedIndex + 1).padStart(2, "0")}
              <span className="mx-2.5 text-[var(--nirvana-gold)]/70">◆</span>
              {String(total).padStart(2, "0")}
            </p>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="product-gallery__thumbs mt-5 mb-6 w-full max-w-full sm:mt-6 sm:mb-8">
          <div className="scrollbar-hide flex touch-pan-x gap-3 overflow-x-auto px-2 pt-3 pb-4 sm:gap-4 sm:px-3 sm:pt-4 sm:pb-5">
            {images.map((url, i) => (
              <button
                key={`${url}-${i}`}
                type="button"
                onClick={() => selectIndex(i)}
                className={cn(
                  "relative aspect-square size-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nirvana-gold)]/50 sm:size-[5.5rem] md:size-28",
                  i === selectedIndex
                    ? "product-gallery__thumb--active scale-105 border-[var(--nirvana-gold)]/50 opacity-100"
                    : "border-[var(--nirvana-sage)]/30 opacity-55 hover:opacity-90",
                )}
                aria-label={`View image ${i + 1}`}
                aria-pressed={i === selectedIndex}
              >
                <Image
                  src={url}
                  alt={`${productName} - ${i + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                  unoptimized={url.startsWith("http://")}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

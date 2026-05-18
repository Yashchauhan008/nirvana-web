"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { ProductCategory } from "@/services/api/product-category.api";

interface CategoryCarouselProps {
  categories: ProductCategory[];
}

const CARD_GAP = 24;
const CARD_WIDTH = 280;
const VISIBLE_CARDS = 4;

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  const maxIndex = Math.max(0, categories.length - VISIBLE_CARDS);
  const scrollToIndex = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(index, maxIndex));
      const offset = clamped * (CARD_WIDTH + CARD_GAP);
      el.scrollTo({ left: offset, behavior: "smooth" });
      setScrollIndex(clamped);
    },
    [maxIndex],
  );

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const index = Math.round(scrollLeft / (CARD_WIDTH + CARD_GAP));
    setScrollIndex(Math.min(index, maxIndex));
    setCanScrollNext(scrollLeft < el.scrollWidth - el.clientWidth - 10);
    setCanScrollPrev(scrollLeft > 10);
  }, [maxIndex]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    handleScroll();
    el.addEventListener("scroll", handleScroll);
    const ro = new ResizeObserver(handleScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      ro.disconnect();
    };
  }, [categories.length, handleScroll]);

  if (!categories.length) return null;

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto py-4 scroll-smooth snap-x snap-mandatory scrollbar-hide"
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category_id=${category.id}`}
            className="block space-y-3 min-w-[220px] snap-center rounded-lg hover:scale-105 transition-all duration-300 "
          >
            <div className="flex w-full p-2 items-center justify-center">
              {category.image?.url ? (
                <Image
                  src={category.image.url}
                  alt={category.name}
                  width={200}
                  height={200}
                  className="object-contain rounded-xl"
                  unoptimized={category.image.url.startsWith("http://")}
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <span className="text-2xl font-semibold">?</span>
                </div>
              )}
            </div>
            <div className="h-1 bg-slate-200 mx-auto w-10 rounded-full"></div>
            <div className=" flex flex-col items-center">
              <p className="line-clamp-2 text-sm font-extrabold">
                {category.name}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {categories.length > VISIBLE_CARDS && (
        <div className="pointer-events-none absolute -top-14 right-0 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="pointer-events-auto h-9 w-9 rounded-full border-slate-200 bg-white text-slate-700 shadow-sm hover:border-[#0046B7] hover:text-[#0046B7]"
            onClick={() => scrollToIndex(scrollIndex - 1)}
            disabled={!canScrollPrev}
            aria-label="Previous categories"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="pointer-events-auto h-9 w-9 rounded-full border-slate-200 bg-white text-slate-700 shadow-sm hover:border-[#0046B7] hover:text-[#0046B7]"
            onClick={() => scrollToIndex(scrollIndex + 1)}
            disabled={!canScrollNext}
            aria-label="Next categories"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      )}

      {categories.length > 1 && (
        <div className="mt-6 flex justify-center gap-1.5">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              className="h-1.5 rounded-full transition-all aria-[current]:w-6"
              style={{
                width: scrollIndex === i ? 24 : 6,
                backgroundColor:
                  scrollIndex === i
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                opacity: scrollIndex === i ? 1 : 0.4,
              }}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={scrollIndex === i ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

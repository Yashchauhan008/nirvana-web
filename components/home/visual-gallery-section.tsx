"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { visualGalleryItems } from "@/config/visual-gallery-items";
import { VisualGallery } from "@/lib/visual-gallery/canvas";

const FOOTER_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/account", label: "Account" },
];

export function VisualGallerySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let gallery: VisualGallery | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || gallery) return;
        gallery = new VisualGallery({
          canvas,
          container,
          items: visualGalleryItems,
        });
        observer.disconnect();
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      gallery?.destroy();
    };
  }, []);

  return (
    <footer id="footer-gallery" data-visual-gallery className="nirvana-footer">
      <div
        ref={containerRef}
        className="footer-gallery-canvas relative h-[min(52vh,500px)] w-full overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none"
          aria-hidden
        />

        <div className="footer-gallery-vignette pointer-events-none absolute inset-0 z-10" />

        <div className="pointer-events-none relative z-20 flex h-full flex-col justify-between px-6 py-10 md:px-10 md:py-14">
          <div className="text-center">
            <p className="font-body-strong text-[10px] uppercase tracking-[0.45em] text-[var(--nirvana-sage)]">
              The collection
            </p>
            <p className="font-body mt-3 text-xs tracking-[0.2em] text-[var(--nirvana-mint)]/70">
              Drag to wander · Scroll to explore depth
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bar border-t border-[var(--nirvana-forest)]/40 bg-[var(--nirvana-deep)] px-6 py-12 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-display text-2xl tracking-[0.35em] text-[var(--nirvana-cream)] md:text-3xl">
                NIRVANA
              </p>
              <p className="font-body mt-4 max-w-sm text-sm leading-relaxed text-[var(--nirvana-mint)]/75">
                Luxury eyewear crafted in muted greens and soft metallics —
                frames for those who wear intention.
              </p>
            </div>

            <nav className="flex flex-wrap gap-x-10 gap-y-4">
              {FOOTER_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-body-strong text-[11px] uppercase tracking-[0.22em] text-[var(--nirvana-sage)] transition-colors hover:text-[var(--nirvana-cream)]"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-4 md:items-end">
              <Link
                href="/products"
                className="font-body-strong w-fit rounded-full border border-[var(--nirvana-sage)]/60 px-7 py-3 text-[11px] uppercase tracking-[0.2em] text-[var(--nirvana-cream)] transition-colors hover:bg-[var(--nirvana-forest)]"
              >
                View all frames
              </Link>
              <p className="font-body text-[10px] uppercase tracking-[0.18em] text-[var(--nirvana-mint)]/50">
                © {new Date().getFullYear()} Nirvana Eyewear
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type Lenis from "lenis";

const CinematicCylinderHero = dynamic(
  () =>
    import("@/components/home/cinematic-cylinder-hero").then((m) => ({
      default: m.CinematicCylinderHero,
    })),
  { ssr: false },
);
import { LuxuryHero } from "@/components/home/luxury-hero";
import { useHomeAnimations } from "@/components/home/use-home-animations";
import { NirvanaFooter } from "@/components/home/nirvana-footer";
import { homeImages } from "@/config/home-images";
import { zaslia } from "@/lib/fonts/zaslia";
import type { Product } from "@/services/api/product.api";
import { resolvePublicFileUrl } from "@/utils/resolvePublicFileUrl";
import "@/styles/home.css";

const MARQUEE = [
  "Hand-polished acetate",
  "Japanese titanium",
  "UV400 protection",
  "Bespoke fitting",
  "Pastel clarity",
  "Nirvana eyewear",
];

const NAV = [
  { href: "#main-hero", label: "Home" },
  { href: "#cinematic-hero", label: "Experience" },
  { href: "#philosophy", label: "Philosophy" },
  { href: "#collection", label: "Collection" },
  { href: "/products", label: "Shop" },
];

export function NirvanaHome({ products = [] }: { products?: Product[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  useHomeAnimations(rootRef, lenisRef);

  return (
    <div
      ref={rootRef}
      className="relative overflow-x-hidden"
    >

      <LuxuryHero />

      <CinematicCylinderHero />

      <section
        data-marquee
        className="border-y border-[var(--nirvana-mint)] bg-[var(--nirvana-mist)] py-6"
      >
        <div className="overflow-hidden">
          <div data-marquee-inner className="marquee-track px-6">
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="font-display text-[clamp(1.5rem,4vw,2.75rem)] tracking-[0.12em] text-[var(--nirvana-forest)]"
              >
                {item}
                <span className="mx-4 text-[var(--nirvana-leaf)]">◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section
        id="philosophy"
        data-philosophy
        className="relative isolate overflow-hidden bg-[var(--nirvana-cream)] py-24 md:py-32"
      >
        <div
          data-philosophy-enter-veil
          className="pointer-events-none absolute inset-0 z-[5] bg-[var(--nirvana-cream)] opacity-0"
          aria-hidden
        />

        <div
          data-philosophy-content
          className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-10"
        >
          <div>
            <p
              data-reveal
              className="font-body-strong mb-4 text-[11px] uppercase tracking-[0.35em] text-[var(--nirvana-leaf)]"
            >
              Philosophy
            </p>
            <h2 className="font-display max-w-xl text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.08]">
              <span data-reveal className="block">
                Lightness is not absence —
              </span>
              <span data-reveal className="block text-gradient italic">
                it is refinement.
              </span>
            </h2>
            <p
              data-reveal
              className="font-body mt-10 max-w-xl text-base leading-relaxed text-[var(--nirvana-forest)]/85"
            >
              Every Nirvana frame is sculpted in muted greens and soft
              metallics, balancing weightless comfort with a silhouette that
              commands quiet attention.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div
              data-reveal-img
              className="frame-card relative mt-10 aspect-[3/4] overflow-hidden rounded-3xl"
            >
              <Image
                src={homeImages.philosophyPrimary}
                alt="Nirvana optical frame"
                fill
                className="image-cover"
                sizes="(max-width: 768px) 45vw, 320px"
              />
            </div>
            <div
              data-reveal-img
              className="frame-card relative aspect-[3/4] overflow-hidden rounded-3xl"
            >
              <Image
                src={homeImages.philosophySecondary}
                alt="Nirvana sunglasses"
                fill
                className="image-cover"
                sizes="(max-width: 768px) 45vw, 320px"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        data-banner
        className="relative mx-6 overflow-hidden rounded-[2rem] md:mx-10"
      >
        <div className="relative aspect-[21/9] min-h-[220px] md:min-h-[320px]">
          <Image
            src={homeImages.banner}
            alt="Nirvana lifestyle"
            fill
            className="image-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[var(--nirvana-deep)]/40" />
          <div
            data-banner-inner
            className="absolute inset-0 flex items-center justify-center px-6 text-center"
          >
            <p className="font-display max-w-2xl text-3xl text-[var(--nirvana-cream)] md:text-5xl">
              Frames that feel like a second skin
            </p>
          </div>
        </div>
      </section>

      <section data-editorial className="px-6 py-16 md:px-10">
        <div data-section-head className="mx-auto mb-10 max-w-7xl px-0 md:px-0">
          <p className="font-body-strong text-[11px] uppercase tracking-[0.35em] text-[var(--nirvana-leaf)]">
            Editorial
          </p>
          <h2 className="font-display mt-2 text-4xl md:text-5xl">
            The Nirvana gaze
          </h2>
        </div>
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {homeImages.editorial.map((src, i) => (
            <div
              key={src}
              data-editorial-card
              className="frame-card relative aspect-[4/5] overflow-hidden rounded-3xl"
            >
              <Image
                src={src}
                alt={`Nirvana editorial ${i + 1}`}
                fill
                className="image-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      </section>

      <section
        id="collection"
        data-collection
        className="bg-[var(--nirvana-mist)] px-6 py-24 md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div
            data-collection-header
            className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          >
            <div data-section-head>
              <p className="font-body-strong text-[11px] uppercase tracking-[0.35em] text-[var(--nirvana-leaf)]">
                Collection
              </p>
              <h2 className="font-display mt-3 text-5xl md:text-6xl">
                Curated frames
              </h2>
            </div>
            <Link
              href="/products"
              className="font-body-strong text-sm uppercase tracking-[0.2em] text-[var(--nirvana-forest)] underline-offset-4 hover:underline"
            >
              View all pieces →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products && products.length > 0 ? (
              products.map((product) => {
                const imageUrl =
                  resolvePublicFileUrl(
                    product.primary_image?.url ??
                      product.images?.find((i) => i.is_primary)?.image?.url ??
                      product.images?.[0]?.image?.url,
                  ) || "/images/models/model3.png";

                const displayPrice = new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(product.sale_price_in_rupee);

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    data-collection-card
                    className="frame-card group block overflow-hidden rounded-3xl bg-white/40"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="image-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        unoptimized={imageUrl.startsWith("http://")}
                      />
                    </div>
                    <div className="p-5">
                      <p className="font-body-strong text-[10px] uppercase tracking-[0.25em] text-[var(--nirvana-leaf)]">
                        {product.category?.name || product.product_label || "Eyewear"}
                      </p>
                      <div className="mt-1 flex items-baseline justify-between gap-2">
                        <h3 className="font-display text-2xl">{product.name}</h3>
                        <span className="font-body-strong text-sm text-[var(--nirvana-forest)]">
                          {displayPrice}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              homeImages.collection.map((item) => (
                <article
                  key={item.name}
                  data-collection-card
                  className="frame-card group overflow-hidden rounded-3xl bg-white/40"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="image-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-body-strong text-[10px] uppercase tracking-[0.25em] text-[var(--nirvana-leaf)]">
                      {item.tag}
                    </p>
                    <h3 className="font-display mt-1 text-2xl">{item.name}</h3>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section id="craft" data-craft className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div
            data-craft-image-wrap
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl"
          >
            <Image
              src={homeImages.craft}
              alt="Nirvana craftsmanship"
              fill
              className="image-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div data-craft-copy>
            <p className="font-body-strong text-[11px] uppercase tracking-[0.35em] text-[var(--nirvana-leaf)]">
              Craftsmanship
            </p>
            <h2 className="font-display mt-4 text-5xl leading-tight md:text-6xl">
              Engineered for the gaze
            </h2>
            <p className="font-body mt-6 text-base leading-relaxed text-[var(--nirvana-forest)]/85">
              Beta-titanium temples, hand-beveled acetate, and lenses tuned for
              clarity in every light. Nirvana frames are measured, adjusted, and
              finished in small batches — never mass-produced.
            </p>
            <ul className="font-body mt-8 space-y-3 text-sm text-[var(--nirvana-forest)]">
              <li>— Anti-reflective coating</li>
              <li>— Adjustable nose architecture</li>
              <li>— Lifetime alignment service</li>
            </ul>
          </div>
        </div>
      </section>

      <section
        data-stats
        className="bg-[var(--nirvana-mist)] px-6 py-20 md:px-10"
      >
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">
          {[
            { value: "12K+", label: "Frames fitted" },
            { value: "48hr", label: "Custom turnaround" },
            { value: "100%", label: "Sustainable acetate" },
          ].map((stat) => (
            <div
              key={stat.label}
              data-stat
              className="rounded-3xl border border-[var(--nirvana-mint)] bg-white/70 px-8 py-10 text-center"
            >
              <p className="font-display text-4xl text-gradient md:text-5xl">
                {stat.value}
              </p>
              <p className="font-body-strong mt-2 text-xs uppercase tracking-[0.25em] text-[var(--nirvana-forest)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section data-cta className="px-6 pb-24 md:px-10 md:pb-32">
        <div
          data-cta-block
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[var(--nirvana-forest)] px-8 py-20 text-center md:px-16"
        >
          <Image
            src={homeImages.cta}
            alt=""
            fill
            className="cta-image-bg"
            sizes="100vw"
          />
          <div className="relative z-10">
            <p className="font-body-strong text-[11px] uppercase tracking-[0.35em] text-[var(--nirvana-mint)]">
              Begin your fitting
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--nirvana-cream)] md:text-6xl">
              Find your Nirvana
            </h2>
            <p className="font-body mx-auto mt-4 max-w-lg text-sm text-[var(--nirvana-mint)]/95">
              Visit our studio or explore the collection online. Every pair
              includes a bespoke adjustment session.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="font-body-strong rounded-full bg-[var(--nirvana-cream)] px-8 py-3.5 text-sm tracking-[0.12em] text-[var(--nirvana-deep)]"
              >
                Shop eyewear
              </Link>
              <Link
                href="/contact"
                className="font-body-strong rounded-full border border-[var(--nirvana-mint)]/50 px-8 py-3.5 text-sm uppercase tracking-[0.18em] text-[var(--nirvana-cream)]"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <NirvanaFooter />
    </div>
  );
}

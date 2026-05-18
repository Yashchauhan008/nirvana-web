"use client";

import Image from "next/image";
import Link from "next/link";

import { homeImages } from "@/config/home-images";

export function LandingCollection() {
  return (
    <section id="collection" data-landing-collection className="landing-collection">
      <div className="landing-collection__header">
        <p data-section-head className="landing-eyebrow font-body-strong">
          Collection
        </p>
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 data-section-head className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-[var(--ln-champagne)]">
            Curated for the discerning
          </h2>
          <Link
            href="/products"
            className="font-body-strong text-[10px] uppercase tracking-[0.28em] text-[var(--ln-gold)] transition-opacity hover:opacity-60"
          >
            View all pieces →
          </Link>
        </div>
      </div>

      <div data-collection-spacer className="landing-collection__pin-spacer">
        <div data-collection-pin className="landing-collection__pin">
          <div className="landing-collection__track-wrap">
            <div data-collection-track className="landing-collection__track">
              {homeImages.collection.map((item) => (
                <article key={item.name} data-collection-card className="landing-collection__card">
                  <Link href="/products" className="block">
                    <div className="landing-collection__card-media">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="image-cover"
                        sizes="340px"
                      />
                      <div className="landing-collection__card-overlay">
                        <span className="font-body-strong text-[9px] uppercase tracking-[0.3em] text-[var(--ln-champagne)]">
                          View piece →
                        </span>
                      </div>
                    </div>
                    <div className="landing-collection__card-body">
                      <p className="landing-collection__card-tag font-body-strong">{item.tag}</p>
                      <h3 className="landing-collection__card-name font-display">{item.name}</h3>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

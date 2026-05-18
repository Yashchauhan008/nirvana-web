"use client";

import Image from "next/image";
import Link from "next/link";
import { MoveRight, Sparkles, Droplet, Star } from "lucide-react";

import { homeImages } from "@/config/home-images";

export function LuxuryHero() {
  return (
    <section
      id="main-hero"
      data-main-hero
      data-hero
      className="luxury-hero relative z-20 isolate flex min-h-[100svh] items-center overflow-hidden bg-[var(--nirvana-cream)] pt-24 pb-16 md:pt-32 md:pb-24"
    >
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--nirvana-sage)]/40 blur-[120px] mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[var(--nirvana-mint)]/50 blur-[150px] mix-blend-multiply" />
        <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-[#fdf3e7]/60 blur-[100px] mix-blend-multiply" />
      </div>

      <div
        data-hero-bg
        className="pointer-events-none absolute inset-0 z-0 mix-blend-overlay opacity-60"
        aria-hidden
      >
        <Image
          src={homeImages.hero}
          alt=""
          fill
          priority
          className="hero-bg-image image-cover scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--nirvana-cream)]/40 via-[var(--nirvana-cream)]/60 to-[var(--nirvana-cream)]" />
      </div>

      <div
        data-hero-exit-veil
        className="pointer-events-none absolute inset-0 z-[12] bg-[var(--nirvana-cream)] opacity-0"
        aria-hidden
      />

      <div data-hero-content className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative">
            <div className="absolute -left-12 -top-12 hidden lg:block">
              <Star className="h-12 w-12 text-[var(--nirvana-gold)]/40 animate-[spin_10s_linear_infinite]" strokeWidth={1} />
            </div>

            <div
              data-hero-fade
              className="inline-flex items-center gap-3 rounded-full border border-[var(--nirvana-sage)]/30 bg-white/40 px-5 py-2.5 backdrop-blur-md mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <span className="flex h-2 w-2 rounded-full bg-[var(--nirvana-leaf)] animate-ping" />
              <p className="font-body-strong text-[10px] uppercase tracking-[0.3em] text-[var(--nirvana-forest)]">
                The New Signature Series
              </p>
            </div>

            <h1 className="font-display text-[clamp(3.5rem,8vw,8.5rem)] leading-[0.88] tracking-tighter text-[var(--nirvana-deep)] drop-shadow-sm">
              <span className="line-reveal block" data-hero-line>
                <span className="line-reveal__text">Redefine</span>
              </span>
              <span className="line-reveal block" data-hero-line>
                <span className="line-reveal__text text-transparent bg-clip-text bg-gradient-to-r from-[var(--nirvana-forest)] via-[var(--nirvana-leaf)] to-[var(--nirvana-gold)] italic pr-4">
                  Vision
                </span>
              </span>
            </h1>

            <p
              data-hero-fade
              className="font-body mt-8 max-w-lg text-lg leading-relaxed text-[var(--nirvana-forest)]/80"
            >
              Experience eyewear reimagined. Where cutting-edge architectural
              precision meets effortless, weightless comfort.
            </p>

            <div
              data-hero-fade
              className="mt-12 flex flex-col sm:flex-row items-center gap-6"
            >
              <Link
                href="/products"
                className="group relative flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-[var(--nirvana-forest)] px-10 font-body-strong text-sm uppercase tracking-[0.15em] text-[var(--nirvana-cream)] transition-all hover:scale-105 hover:bg-[var(--nirvana-deep)] hover:shadow-[0_20px_40px_rgba(42,69,56,0.3)]"
              >
                <span>Explore Collection</span>
                <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="group flex h-14 items-center justify-center rounded-full border border-[var(--nirvana-sage)] bg-white/30 px-10 font-body-strong text-sm uppercase tracking-[0.18em] text-[var(--nirvana-forest)] backdrop-blur-sm transition-all hover:bg-white/60 hover:shadow-lg"
              >
                Book Fitting
              </Link>
            </div>

            {/* Micro details */}
            <div
              data-hero-fade
              className="mt-16 flex items-center gap-8 border-t border-[var(--nirvana-sage)]/30 pt-8"
            >
              <div className="flex flex-col gap-1">
                <span className="font-display text-2xl text-[var(--nirvana-deep)]">4g</span>
                <span className="font-body text-[10px] uppercase tracking-wider text-[var(--nirvana-forest)]/60">Titanium frame</span>
              </div>
              <div className="h-8 w-px bg-[var(--nirvana-sage)]/50" />
              <div className="flex flex-col gap-1">
                <span className="font-display text-2xl text-[var(--nirvana-deep)]">UV400</span>
                <span className="font-body text-[10px] uppercase tracking-wider text-[var(--nirvana-forest)]/60">Max protection</span>
              </div>
              <div className="h-8 w-px bg-[var(--nirvana-sage)]/50" />
              <div className="flex flex-col gap-1">
                <span className="font-display text-2xl text-[var(--nirvana-deep)]">100%</span>
                <span className="font-body text-[10px] uppercase tracking-wider text-[var(--nirvana-forest)]/60">Bespoke fit</span>
              </div>
            </div>
          </div>

          {/* Right Visual Area */}
          <div data-hero-visual className="relative flex items-center justify-center lg:justify-end w-full pt-10 lg:pt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--nirvana-sage)]/40 to-transparent blur-3xl rounded-full" />
            
            <div className="relative w-full max-w-[550px] aspect-square lg:aspect-[4/5] mt-10 lg:mt-0">
              
              <div
                data-hero-visual-inner
                data-hero-visual-media
                className="relative z-10 w-full h-full flex items-center justify-center"
              >
                {/* Image 2 (Background Left) */}
                <div className="group absolute left-[-5%] top-[10%] w-[55%] aspect-[3/4] z-10 rounded-[2rem] overflow-hidden border-4 border-white/80 shadow-[0_20px_40px_rgba(42,69,56,0.15)] -rotate-6 transition-all duration-700 hover:rotate-0 hover:scale-110 hover:z-30 hover:shadow-[0_30px_60px_rgba(42,69,56,0.3)]">
                  <Image
                    src={homeImages.heroImages[1]}
                    alt="Nirvana lifestyle at the beach"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 1024px) 40vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-[var(--nirvana-forest)]/10 mix-blend-overlay transition-colors duration-500 group-hover:bg-transparent" />
                </div>

                {/* Image 3 (Background Right) */}
                <div className="group absolute right-[-5%] top-[25%] w-[55%] aspect-[3/4] z-10 rounded-[2rem] overflow-hidden border-4 border-white/80 shadow-[0_20px_40px_rgba(42,69,56,0.15)] rotate-6 transition-all duration-700 hover:rotate-0 hover:scale-110 hover:z-30 hover:shadow-[0_30px_60px_rgba(42,69,56,0.3)]">
                  <Image
                    src={homeImages.heroImages[2]}
                    alt="Nirvana lifestyle urban"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 1024px) 40vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-[var(--nirvana-forest)]/10 mix-blend-overlay transition-colors duration-500 group-hover:bg-transparent" />
                </div>

                {/* Image 1 (Center Front) */}
                <div className="group absolute w-[65%] aspect-[3/4] z-20 rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-[0_30px_60px_rgba(42,69,56,0.25)] transition-all duration-700 hover:scale-105 hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(42,69,56,0.35)]">
                  <Image
                    src={homeImages.heroImages[0]}
                    alt="Nirvana elegant evening look"
                    fill
                    priority
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 1024px) 60vw, 35vw"
                  />
                </div>
              </div>

              {/* Floating Glassmorphic Badge */}
              <div className="absolute -bottom-4 -left-4 md:-left-8 z-40 rounded-2xl border border-white/50 bg-white/70 p-4 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] animate-[bounce_4s_ease-in-out_infinite]">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--nirvana-mint)] text-[var(--nirvana-forest)]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-body-strong text-[9px] uppercase tracking-widest text-[var(--nirvana-leaf)]">
                      Signature Series
                    </p>
                    <p className="font-display mt-0.5 text-lg text-[var(--nirvana-deep)]">
                      Everyday Luxury
                    </p>
                  </div>
                </div>
              </div>

              {/* Second decorative floating badge */}
              <div className="absolute top-10 -right-4 z-40 rounded-xl border border-white/50 bg-white/60 p-3 backdrop-blur-xl shadow-lg animate-[bounce_5s_ease-in-out_infinite_reverse]">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--nirvana-cream)] text-[var(--nirvana-gold)]">
                    <Droplet className="h-4 w-4" />
                  </div>
                  <div className="pr-2">
                    <p className="font-display text-sm text-[var(--nirvana-deep)]">
                      Hand-polished
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <a
        href="#cinematic-hero"
        data-hero-scroll-hint
        className="group absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-4 text-[var(--nirvana-forest)]/50 transition-colors hover:text-[var(--nirvana-forest)]"
      >
        <span className="font-body-strong text-[10px] uppercase tracking-[0.3em]">
          Scroll to explore
        </span>
        <div className="h-16 w-[1px] overflow-hidden bg-[var(--nirvana-sage)]/30">
          <div className="h-full w-full -translate-y-full bg-[var(--nirvana-forest)] animate-[scroll_2s_ease-in-out_infinite]" />
        </div>
      </a>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
      `}} />
    </section>
  );
}

"use client";

import Link from "next/link";
import { useRef } from "react";

import { useFooterTrail } from "@/lib/footer-trail/use-footer-trail";
import "@/styles/footer-trail.css";

const FOOTER_NAV = [
  { href: "/#main-hero", label: "Home" },
  { href: "/#cinematic-hero", label: "Experience" },
  { href: "/#philosophy", label: "Philosophy" },
  { href: "/#collection", label: "Collection" },
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const FOOTER_SOCIAL = [
  { href: "https://instagram.com", label: "Instagram", external: true },
  { href: "https://x.com", label: "X", external: true },
  { href: "https://linkedin.com", label: "LinkedIn", external: true },
];

const WORDMARK = "NIRVANA".split("");

export function NirvanaFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const trailLayerRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLDivElement>(null);

  useFooterTrail(shellRef, trailLayerRef, footerRef, speedRef);

  return (
    <footer
      ref={footerRef}
      id="site-footer"
      data-site-footer
      className="nirvana-trail-footer"
    >
      <div ref={shellRef} className="nirvana-trail-footer__shell">
        <div
          ref={trailLayerRef}
          className="nirvana-trail-footer__trail-layer"
          aria-hidden
        />

        <div className="nirvana-trail-footer__bottom">
          <div className="nirvana-trail-footer__bottom-grid">
            <div className="nirvana-trail-footer__brand">
              <Link href="/" className="nirvana-trail-footer__brand-name">
                NIRVANA
              </Link>
              <p className="nirvana-trail-footer__brand-tagline">
                Luxury eyewear crafted in muted greens and soft metallics.
              </p>
            </div>

            <nav
              className="nirvana-trail-footer__nav"
              aria-label="Footer navigation"
            >
              <p className="nirvana-trail-footer__nav-label">Explore</p>
              <ul>
                {FOOTER_NAV.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav
              className="nirvana-trail-footer__social"
              aria-label="Social media"
            >
              <p className="nirvana-trail-footer__nav-label">Connect</p>
              <ul>
                {FOOTER_SOCIAL.map(({ href, label, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="nirvana-trail-footer__bottom-meta">
            <p className="nirvana-trail-footer__copyright">
              © {new Date().getFullYear()} Nirvana Eyewear. All rights reserved.
            </p>
          </div>
        </div>

        <div className="nirvana-trail-footer__stage">
          <div
            className="nirvana-trail-footer__letters nirvana-trail-footer__letters--below"
            aria-hidden
          >
            {WORDMARK.map((char, index) =>
              index % 2 === 1 ? (
                <span
                  key={`below-${char}-${index}`}
                  className="nirvana-trail-footer__letter"
                >
                  {char}
                </span>
              ) : (
                <span
                  key={`below-gap-${index}`}
                  className="nirvana-trail-footer__letter-gap"
                />
              ),
            )}
          </div>

          <div
            className="nirvana-trail-footer__letters nirvana-trail-footer__letters--above"
            aria-hidden
          >
            {WORDMARK.map((char, index) =>
              index % 2 === 0 ? (
                <span
                  key={`above-${char}-${index}`}
                  className="nirvana-trail-footer__letter"
                >
                  {char}
                </span>
              ) : (
                <span
                  key={`above-gap-${index}`}
                  className="nirvana-trail-footer__letter-gap"
                />
              ),
            )}
          </div>

          <p className="nirvana-trail-footer__hint">
            Move your cursor to explore the collection
          </p>
          <p className="nirvana-trail-footer__touch-hint">
            Swipe to discover the frames
          </p>
        </div>

        <div
          ref={speedRef}
          className="nirvana-trail-footer__speed"
          aria-live="polite"
        />
      </div>
    </footer>
  );
}

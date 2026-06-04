"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { useRef } from "react";

import { useFooterTrail } from "@/lib/footer-trail/use-footer-trail";
import "@/styles/footer-trail.css";

const FOOTER_NAV = [
  { href: "/#main-hero", label: "Home" },
  { href: "/#cinematic-hero", label: "Experience" },
  { href: "/#philosophy", label: "Philosophy" },
  { href: "/products", label: "Collection" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
];

const INSTAGRAM_URL = "https://www.instagram.com/nirvana.shades";

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
              <div className="nirvana-trail-footer__brand-row">
                <Link href="/" className="nirvana-trail-footer__brand-name">
                  NIRVANA
                </Link>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Nirvana on Instagram"
                  className="nirvana-trail-footer__instagram"
                >
                  <Instagram strokeWidth={1.5} aria-hidden />
                </a>
              </div>
              <p className="nirvana-trail-footer__brand-tagline">
                Armless chain-mounted pieces — ear-supported, nose-balanced, with
                crystal and jewelry drops at every finial.
              </p>
            </div>

            <nav
              className="nirvana-trail-footer__nav"
              aria-label="Footer navigation"
            >
              <p className="nirvana-trail-footer__nav-label">Explore</p>
              <ul className="nirvana-trail-footer__nav-list">
                {FOOTER_NAV.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="nirvana-trail-footer__bottom-meta">
            <p className="nirvana-trail-footer__copyright">
              © {new Date().getFullYear()} Nirvana. All rights reserved.
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
            Move your cursor to explore the chain collection
          </p>
          <p className="nirvana-trail-footer__touch-hint">
            Swipe to discover the pieces
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

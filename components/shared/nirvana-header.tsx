"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTransitionContext } from "@/contexts/TransitionContext";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home", isHash: false },
  { href: "/#cinematic-hero", label: "Experience", isHash: true, id: "#cinematic-hero" },
  { href: "/#philosophy", label: "Philosophy", isHash: true, id: "#philosophy" },
  { href: "/products", label: "Collection", isHash: false },
  { href: "/contact", label: "Contact", isHash: false },
];

export function NirvanaHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { navigateWithTransition } = useTransitionContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string, isHash: boolean, id?: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHash && id && pathname === "/") {
      void navigateWithTransition(id);
    } else {
      void navigateWithTransition(href);
    }
  };

  return (
    <header
      data-site-header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        isScrolled
          ? "bg-[var(--nirvana-cream)]/92 backdrop-blur-md py-4 shadow-[0_4px_30px_rgba(42,69,56,0.06)] border-b border-[var(--nirvana-mint)]/30"
          : "bg-transparent py-6"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (pathname === "/") {
              void navigateWithTransition("#main-hero");
            } else {
              void navigateWithTransition("/");
            }
          }}
          className="font-display text-xl tracking-[0.35em] text-[var(--nirvana-deep)] md:text-2xl transition-opacity hover:opacity-80"
        >
          NIRVANA
        </a>
        
        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map(({ href, label, isHash, id }) => (
            <a
              key={href}
              href={href}
              onClick={handleNavClick(href, isHash, id)}
              className="font-body-strong cursor-pointer text-[11px] uppercase tracking-[0.22em] text-[var(--nirvana-forest)] transition-opacity hover:opacity-60"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              void navigateWithTransition("/products");
            }}
            className="font-body-strong cursor-pointer rounded-full border border-[var(--nirvana-sage)] bg-transparent px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-[var(--nirvana-forest)] transition-colors hover:bg-[var(--nirvana-mint)]"
          >
            Explore
          </button>
        </div>
      </div>
    </header>
  );
}

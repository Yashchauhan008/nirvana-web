"use client";

import React, { createContext, useContext, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { svgTransitionPaths as paths } from "@/lib/svg-path-transition/paths";

gsap.registerPlugin(ScrollTrigger);

interface TransitionContextType {
  navigateWithTransition: (target: string) => Promise<void>;
  pathRef: React.RefObject<SVGPathElement | null>;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function useTransitionContext() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransitionContext must be used within a TransitionProvider");
  }
  return context;
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pathRef = useRef<SVGPathElement>(null);
  const isAnimatingRef = useRef(false);

  const cover = useCallback(() => {
    const overlayPath = pathRef.current;
    if (!overlayPath) return Promise.resolve();

    return new Promise<void>((resolve) => {
      gsap
        .timeline({ onComplete: () => resolve() })
        .set(overlayPath, { attr: { d: paths.step1.unfilled } })
        .to(
          overlayPath,
          {
            duration: 0.8,
            ease: "power4.in",
            attr: { d: paths.step1.inBetween.curve1 },
          },
          0
        )
        .to(overlayPath, {
          duration: 0.2,
          ease: "power1",
          attr: { d: paths.step1.filled },
        });
    });
  }, []);

  const uncover = useCallback(() => {
    const overlayPath = pathRef.current;
    if (!overlayPath) return Promise.resolve();

    return new Promise<void>((resolve) => {
      gsap
        .timeline({ onComplete: () => resolve() })
        .set(overlayPath, { attr: { d: paths.step2.filled } })
        .to(overlayPath, {
          duration: 0.2,
          ease: "sine.in",
          attr: { d: paths.step2.inBetween.curve1 },
        })
        .to(overlayPath, {
          duration: 1,
          ease: "power4",
          attr: { d: paths.step2.unfilled },
        });
    });
  }, []);

  const navigateWithTransition = useCallback(
    async (target: string) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      try {
        await cover();

        const targetPathname = target.split("#")[0] || "/";
        if (targetPathname === pathname) {
          const hashIndex = target.indexOf("#");
          if (hashIndex !== -1) {
            const hash = target.substring(hashIndex);
            const el = document.querySelector<HTMLElement>(hash);
            if (el) {
              const headerOffset = 88;
              const lenis = (window as any).lenis;
              if (lenis) {
                lenis.scrollTo(el, { offset: -headerOffset, immediate: true });
              } else {
                const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
                window.scrollTo({ top, left: 0 });
              }
            }
          } else {
            const lenis = (window as any).lenis;
            if (lenis) {
              lenis.scrollTo(0, { immediate: true });
            } else {
              window.scrollTo({ top: 0, left: 0 });
            }
          }
          ScrollTrigger.refresh();
          await uncover();
          return;
        }

        if (target.startsWith("/")) {
          router.push(target);
          return;
        }

        // Internal hash navigation on current page
        if (target.startsWith("#")) {
          const el = document.querySelector<HTMLElement>(target);
          if (el) {
            const headerOffset = 88;
            const lenis = (window as any).lenis;
            if (lenis) {
              lenis.scrollTo(el, { offset: -headerOffset, immediate: true });
            } else {
              const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
              window.scrollTo({ top, left: 0 });
            }
          }
          ScrollTrigger.refresh();
          await uncover();
        }
      } catch (err) {
        console.error("Transition error", err);
      } finally {
        isAnimatingRef.current = false;
      }
    },
    [cover, uncover, router, pathname]
  );

  // Trigger uncover on pathname changes or initial mount
  useEffect(() => {
    uncover();

    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector<HTMLElement>(hash);
        if (el) {
          const headerOffset = 88;
          const lenis = (window as any).lenis;
          if (lenis) {
            lenis.scrollTo(el, { offset: -headerOffset, immediate: true });
          } else {
            const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top, left: 0 });
          }
        }
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [pathname, uncover]);

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, pathRef }}>
      {children}
      <svg
        className="svg-path-overlay"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          ref={pathRef}
          className="svg-path-overlay__path"
          vectorEffect="non-scaling-stroke"
          d={paths.step1.unfilled}
        />
      </svg>
    </TransitionContext.Provider>
  );
}

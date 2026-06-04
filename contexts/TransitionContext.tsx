"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { svgTransitionPaths as paths } from "@/lib/svg-path-transition/paths";

gsap.registerPlugin(ScrollTrigger);

const HEADER_OFFSET = 88;

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

function scrollToHash(hash: string) {
  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return;

  const lenis = (window as Window & { lenis?: { scrollTo: (t: HTMLElement, o: { offset: number; immediate: boolean }) => void } }).lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -HEADER_OFFSET, immediate: true });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, left: 0 });
}

function scrollToTop() {
  const lenis = (window as Window & { lenis?: { scrollTo: (n: number, o: { immediate: boolean }) => void } }).lenis;
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo({ top: 0, left: 0 });
  }
}

function resetOverlay(pathEl: SVGPathElement | null) {
  if (!pathEl) return;
  gsap.killTweensOf(pathEl);
  gsap.set(pathEl, { attr: { d: paths.step1.unfilled } });
}

/** Let Next.js paint the new route before uncovering the overlay. */
function waitForRoutePaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pathRef = useRef<SVGPathElement>(null);
  const isAnimatingRef = useRef(false);
  const pendingRouteNavRef = useRef(false);
  const isFirstPathnameEffectRef = useRef(true);

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
          0,
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

      let startedRouteChange = false;

      try {
        await cover();

        const targetPathname = target.split("#")[0] || "/";

        if (targetPathname === pathname) {
          const hashIndex = target.indexOf("#");
          if (hashIndex !== -1) {
            scrollToHash(target.substring(hashIndex));
          } else {
            scrollToTop();
          }
          ScrollTrigger.refresh();
          await uncover();
          return;
        }

        if (target.startsWith("/")) {
          pendingRouteNavRef.current = true;
          startedRouteChange = true;
          router.push(target);
          return;
        }

        if (target.startsWith("#")) {
          scrollToHash(target);
          ScrollTrigger.refresh();
          await uncover();
        }
      } catch (err) {
        console.error("Transition error", err);
        pendingRouteNavRef.current = false;
        await uncover();
      } finally {
        if (!startedRouteChange) {
          isAnimatingRef.current = false;
        }
      }
    },
    [cover, uncover, router, pathname],
  );

  useEffect(() => {
    if (isFirstPathnameEffectRef.current) {
      isFirstPathnameEffectRef.current = false;
      resetOverlay(pathRef.current);

      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          scrollToHash(hash);
          ScrollTrigger.refresh();
        }, 100);
      }
      return;
    }

    if (pendingRouteNavRef.current || isAnimatingRef.current) {
      pendingRouteNavRef.current = false;
      scrollToTop();

      void (async () => {
        try {
          await waitForRoutePaint();
          await uncover();
        } finally {
          isAnimatingRef.current = false;
          ScrollTrigger.refresh();
        }
      })();
      return;
    }

    resetOverlay(pathRef.current);
    ScrollTrigger.refresh();
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

"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

import { svgTransitionPaths as paths } from "@/lib/svg-path-transition/paths";

gsap.registerPlugin(ScrollTrigger);

const HEADER_OFFSET = 88;

type ScrollTarget = string | HTMLElement;

function resolveScrollTarget(target: ScrollTarget): HTMLElement | null {
  if (typeof target === "string") {
    if (!target.startsWith("#")) return null;
    return document.querySelector<HTMLElement>(target);
  }
  return target;
}

function scrollToTarget(target: ScrollTarget, lenis: Lenis | null) {
  const el = resolveScrollTarget(target);
  if (!el) return;

  if (lenis) {
    lenis.scrollTo(el, { offset: -HEADER_OFFSET, immediate: true });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, left: 0 });
}

export function useSvgPathTransition(lenisRef: React.RefObject<Lenis | null>) {
  const router = useRouter();
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
    async (target: ScrollTarget | string) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      try {
        await cover();

        if (typeof target === "string" && target.startsWith("/")) {
          router.push(target);
          return;
        }

        scrollToTarget(target, lenisRef.current);
        ScrollTrigger.refresh();
        await uncover();
      } finally {
        isAnimatingRef.current = false;
      }
    },
    [cover, uncover, lenisRef, router],
  );

  const navigateToTop = useCallback(async () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    try {
      await cover();
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, left: 0 });
      }
      ScrollTrigger.refresh();
      await uncover();
    } finally {
      isAnimatingRef.current = false;
    }
  }, [cover, uncover, lenisRef]);

  return {
    pathRef,
    navigateWithTransition,
    navigateToTop,
  };
}

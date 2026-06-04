"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import {
  attachLenisToGsapTicker,
  connectLenisScrollTrigger,
  getWindowLenis,
  setWindowLenis,
  scheduleScrollTriggerRefresh,
} from "@/lib/scroll/lenis-scroll";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useLenisScroll() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (getWindowLenis()) return;

    document.documentElement.classList.add("lenis", "lenis-smooth");

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.6 : 1.05,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: !prefersReducedMotion,
      syncTouch: false,
      touchMultiplier: 1.1,
      autoRaf: false,
    });

    connectLenisScrollTrigger(lenis);
    const detachLenisTicker = attachLenisToGsapTicker(lenis);
    setWindowLenis(lenis);
    gsap.ticker.lagSmoothing(500, 33);

    const onLoad = () => scheduleScrollTriggerRefresh();
    window.addEventListener("load", onLoad);
    scheduleScrollTriggerRefresh();

    return () => {
      window.removeEventListener("load", onLoad);
      detachLenisTicker();
      lenis.destroy();
      setWindowLenis(null);
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  useEffect(() => {
    const lenis = getWindowLenis();
    if (!lenis) return;
    lenis.resize();
    scheduleScrollTriggerRefresh();
  }, [pathname]);
}

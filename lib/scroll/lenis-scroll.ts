import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

type WindowWithNirvanaLenis = Window & { __nirvanaLenis?: Lenis | null };

/** Lenis instance exposed for cross-component scroll (e.g. route transitions). */
export function setWindowLenis(lenis: Lenis | null) {
  (window as WindowWithNirvanaLenis).__nirvanaLenis = lenis;
}

export function getWindowLenis(): Lenis | null {
  return (window as WindowWithNirvanaLenis).__nirvanaLenis ?? null;
}

export function scrollWindowToHash(hash: string, headerOffset: number) {
  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return;

  const lenis = getWindowLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -headerOffset, immediate: true });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top, left: 0 });
}

export function scrollWindowToTop() {
  const lenis = getWindowLenis();
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo({ top: 0, left: 0 });
  }
}

/** Wire Lenis smooth scroll to GSAP ScrollTrigger (document scroller). */
export function connectLenisScrollTrigger(lenis: Lenis) {
  lenis.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value?: number) {
      if (value !== undefined) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  ScrollTrigger.addEventListener("refresh", () => lenis.resize());
}

/** Drive Lenis from GSAP's unified ticker (use performance.now(), not GSAP time). */
export function attachLenisToGsapTicker(lenis: Lenis) {
  const update = () => {
    lenis.raf(performance.now());
  };
  gsap.ticker.add(update);
  return () => gsap.ticker.remove(update);
}

let refreshRaf = 0;
let refreshPending = false;

/** Debounced ScrollTrigger.refresh — avoids layout thrash on resize. */
export function scheduleScrollTriggerRefresh() {
  if (refreshPending) return;
  refreshPending = true;
  cancelAnimationFrame(refreshRaf);
  refreshRaf = requestAnimationFrame(() => {
    refreshPending = false;
    ScrollTrigger.refresh();
  });
}

"use client";

import { useLayoutEffect, type MutableRefObject, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import {
  attachLenisToGsapTicker,
  connectLenisScrollTrigger,
  scheduleScrollTriggerRefresh,
} from "@/lib/scroll/lenis-scroll";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_SELECTOR = [
  "[data-reveal]",
  "[data-reveal-img]",
  "[data-collection-header]",
  "[data-craft-copy] > *",
].join(", ");

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useHomeAnimations(
  rootRef: RefObject<HTMLElement | null>,
  lenisRef?: MutableRefObject<Lenis | null>,
) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    ScrollTrigger.config({ limitCallbacks: true });

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
    if (lenisRef) lenisRef.current = lenis;

    gsap.ticker.lagSmoothing(500, 33);

    const ctx = gsap.context(() => {
      const revealEls = gsap.utils.toArray<HTMLElement>(REVEAL_SELECTOR);
      const hasMainHero = root.querySelector("[data-main-hero]");

      if (hasMainHero) {
        if (!prefersReducedMotion) {
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from("[data-main-hero] .line-reveal__text", {
              yPercent: 110,
              duration: 1.1,
              stagger: 0.1,
              clearProps: "transform",
            })
            .from(
              "[data-main-hero] [data-hero-fade]",
              { opacity: 0, y: 28, duration: 0.85, stagger: 0.08, clearProps: "all" },
              "-=0.65",
            )
            .from(
              "[data-main-hero] [data-hero-visual]",
              { opacity: 0, y: 48, scale: 0.94, duration: 1.05, clearProps: "all" },
              "-=0.75",
            );
        }

        gsap.to("[data-main-hero] [data-hero-glow]", {
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-main-hero]",
            start: "top top",
            end: "bottom center",
            scrub: 0.6,
          },
        });

        const heroCrossfade = {
          trigger: "[data-main-hero]",
          start: "bottom bottom",
          end: "bottom top",
          scrub: 0.9,
        };

        // Removed aggressive fade-outs to prevent "white blank" on scroll
        // The hero will naturally scroll up out of the viewport.

        gsap.to("[data-main-hero] [data-hero-visual-inner]", {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-main-hero]",
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });

        gsap.to("[data-main-hero] [data-hero-visual-media] .hero-cutout-image", {
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-main-hero]",
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });

        gsap.to("[data-main-hero] [data-hero-bg] .hero-bg-image", {
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-main-hero]",
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }

      gsap.to("[data-marquee-inner]", {
        xPercent: -50,
        ease: "none",
        duration: 30,
        repeat: -1,
      });

      gsap.set(revealEls, { opacity: 0, y: 64 });
      gsap.set("[data-editorial-card], [data-collection-card]", {
        opacity: 0,
        y: 70,
      });

      gsap.from("[data-craft-image-wrap]", {
        opacity: 0,
        x: -80,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-craft-image-wrap]",
          start: "top 88%",
          once: true,
        },
      });

      revealEls.forEach((el) => {
        if (el.closest("[data-philosophy]")) return;

        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        });
      });

      const philosophyCrossfade = {
        trigger: "[data-philosophy]",
        start: "top bottom",
        end: "top top",
        scrub: 0.9,
      };

      gsap.set("[data-philosophy] [data-philosophy-content]", { opacity: 0, y: 40 });
      gsap.set(
        "[data-philosophy] [data-reveal], [data-philosophy] [data-reveal-img]",
        { opacity: 0, y: 48 },
      );

      gsap.to("[data-philosophy] [data-philosophy-enter-veil]", {
        opacity: 1,
        ease: "none",
        scrollTrigger: philosophyCrossfade,
      });

      gsap.to("[data-philosophy] [data-philosophy-content]", {
        opacity: 1,
        y: 0,
        ease: "none",
        scrollTrigger: philosophyCrossfade,
      });

      gsap.to("[data-philosophy] [data-reveal]", {
        opacity: 1,
        y: 0,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: philosophyCrossfade,
      });

      gsap.to("[data-philosophy] [data-reveal-img]", {
        opacity: 1,
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-philosophy]",
          start: "top bottom",
          end: "top center",
          scrub: 0.9,
        },
      });

      ScrollTrigger.batch("[data-editorial-card]", {
        start: "top 90%",
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 70, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.95,
              stagger: 0.14,
              ease: "power3.out",
              overwrite: true,
            },
          );
        },
      });

      ScrollTrigger.batch("[data-collection-card]", {
        start: "top 90%",
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 80, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              overwrite: true,
            },
          );
        },
      });

      gsap.from("[data-banner-inner]", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-banner]",
          start: "top 85%",
          once: true,
        },
      });

      gsap.to("[data-banner] .image-cover", {
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-banner]",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-editorial-card]").forEach((card, i) => {
        gsap.to(card.querySelector(".image-cover"), {
          yPercent: i % 2 === 0 ? 12 : 8,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-section-head]").forEach((head) => {
        gsap.from(head, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: head,
            start: "top 88%",
            once: true,
          },
        });
      });

      gsap.from("[data-stat]", {
        opacity: 0,
        y: 50,
        scale: 0.92,
        duration: 0.85,
        stagger: 0.12,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: "[data-stats]",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from("[data-cta-block]", {
        opacity: 0,
        y: 60,
        scale: 0.97,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-cta]",
          start: "top 85%",
          once: true,
        },
      });

      gsap.to("[data-site-header]", {
        backgroundColor: "rgba(248, 251, 249, 0.92)",
        boxShadow: "0 4px 30px rgba(42, 69, 56, 0.08)",
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "bottom top",
          end: "bottom top",
          toggleActions: "play none reverse none",
        },
      });
    }, root);

    root.classList.add("home-animated");

    scheduleScrollTriggerRefresh();
    window.addEventListener("load", scheduleScrollTriggerRefresh);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(scheduleScrollTriggerRefresh, 150);
    });
    resizeObserver.observe(root);

    const onCinematicReady = () => scheduleScrollTriggerRefresh();
    window.addEventListener("nirvana:cinematic-ready", onCinematicReady);

    return () => {
      window.removeEventListener("nirvana:cinematic-ready", onCinematicReady);
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      window.removeEventListener("load", scheduleScrollTriggerRefresh);
      ctx.revert();
      detachLenisTicker();
      lenis.destroy();
      if (lenisRef) lenisRef.current = null;
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      ScrollTrigger.clearScrollMemory();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      root.classList.remove("home-animated");
    };
  }, [rootRef, lenisRef]);
}

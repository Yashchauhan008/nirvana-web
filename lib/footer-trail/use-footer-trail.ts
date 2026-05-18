"use client";

import { useEffect, type RefObject } from "react";

import { footerTrailImages } from "@/config/footer-trail";
import { createTrailPatterns } from "@/lib/footer-trail/patterns";
import type { TrailConfig, TrailImageEntry } from "@/lib/footer-trail/types";

function getDefaultConfig(isMobile: boolean): TrailConfig {
  return {
    imageLifespan: 600,
    removalDelay: 16,
    mouseThreshold: isMobile ? 14 : 22,
    scrollThreshold: 50,
    inDuration: 600,
    outDuration: 800,
    inEasing: "cubic-bezier(.07,.5,.5,1)",
    outEasing: "cubic-bezier(.87, 0, .13, 1)",
    touchImageInterval: 40,
    minMovementForImage: isMobile ? 3 : 5,
    baseImageSize: isMobile ? 180 : 240,
    minImageSize: isMobile ? 120 : 160,
    maxImageSize: isMobile ? 260 : 340,
    baseRotation: 30,
    maxRotationFactor: 3,
    speedSmoothingFactor: 0.25,
    staggerRange: 50,
    easing: {
      scale: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      reveal: "cubic-bezier(0.87, 0, 0.13, 1)",
    },
  };
}

export function useFooterTrail(
  boundsRef: RefObject<HTMLElement | null>,
  trailLayerRef: RefObject<HTMLElement | null>,
  footerRef: RefObject<HTMLElement | null>,
  speedIndicatorRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const container = boundsRef.current;
    const trailLayer = trailLayerRef.current;
    const footer = footerRef.current;
    if (!container || !trailLayer || !footer) return;

    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.innerWidth <= 768;

    const config = getDefaultConfig(isMobile);
    const patterns = createTrailPatterns(config);
    const images = footerTrailImages;

    let currentEffect = "flame";
    let imageIndex = 0;
    const trail: TrailImageEntry[] = [];
    const imagePool: HTMLDivElement[] = [];

    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let isMoving = false;
    let isCursorInContainer = false;
    let isTouching = false;
    let lastRemovalTime = 0;
    let lastTouchImageTime = 0;
    let lastScrollTime = 0;
    let lastMoveTime = Date.now();
    let isScrolling = false;
    let scrollTicking = false;
    let smoothedSpeed = 0;
    let maxSpeed = 0;
    let rafId = 0;
    let moveIdleTimer = 0;
    let lastActiveMove = 0;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const speedIndicator = speedIndicatorRef.current;

    const isInContainer = (x: number, y: number) => {
      const rect = container.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    };

    const hasMovedEnough = () =>
      Math.hypot(mouseX - lastMouseX, mouseY - lastMouseY) > config.mouseThreshold;

    const hasMovedAtAll = () =>
      Math.hypot(mouseX - prevMouseX, mouseY - prevMouseY) > config.minMovementForImage;

    const calculateSpeed = () => {
      const now = Date.now();
      const dt = now - lastMoveTime;
      if (dt <= 0) return 0;
      const dist = Math.hypot(mouseX - prevMouseX, mouseY - prevMouseY);
      const raw = dist / dt;
      if (raw > maxSpeed) maxSpeed = raw;
      const norm = Math.min(raw / (maxSpeed || 0.5), 1);
      smoothedSpeed =
        smoothedSpeed * (1 - config.speedSmoothingFactor) +
        norm * config.speedSmoothingFactor;
      lastMoveTime = now;

      if (speedIndicator) {
        const effectName = patterns[currentEffect]?.name ?? "Trail";
        speedIndicator.textContent = `${effectName} · ${(smoothedSpeed * 100).toFixed(0)}%`;
        speedIndicator.style.opacity = "1";
        const t = setTimeout(() => {
          speedIndicator.style.opacity = "0";
        }, 1500);
        timeouts.push(t);
      }
      return smoothedSpeed;
    };

    const createImageElement = () => {
      if (imagePool.length > 0) {
        const el = imagePool.pop()!;
        el.innerHTML = "";
        el.style.cssText = "";
        el.className = "trail-image";
        return el;
      }
      const element = document.createElement("div");
      element.className = "trail-image";
      return element;
    };

    const returnToPool = (element: HTMLElement) => {
      element.remove();
      element.innerHTML = "";
      element.style.cssText = "";
      element.className = "trail-image";
      if (imagePool.length < 20 && element instanceof HTMLDivElement) {
        imagePool.push(element);
      }
    };

    const getTrailFadeOpacity = (y: number, rect: DOMRect) => {
      const yNorm = Math.min(1, Math.max(0, y / rect.height));
      if (yNorm < 0.3) return 0.12 + (yNorm / 0.3) * 0.38;
      if (yNorm < 0.46) return 0.5 + ((yNorm - 0.3) / 0.16) * 0.35;
      return 0.92;
    };

    const applyTrailFade = (element: HTMLElement, y: number, rect: DOMRect) => {
      const opacity = getTrailFadeOpacity(y, rect);
      element.style.opacity = String(opacity);
    };

    const createImage = (speed = 0.5) => {
      const imageSrc = images[imageIndex % images.length];
      imageIndex += 1;
      const size =
        config.minImageSize + (config.maxImageSize - config.minImageSize) * speed;
      const pattern = patterns[currentEffect];
      if (!pattern) return;

      if (currentEffect === "flame") {
        const img = document.createElement("img");
        img.className = "trail-img";
        const rotFactor = 1 + speed * (config.maxRotationFactor - 1);
        const rot = (Math.random() - 0.5) * config.baseRotation * rotFactor;
        img.src = imageSrc;
        img.width = size;
        img.height = size;
        const rect = container.getBoundingClientRect();
        const x = mouseX - rect.left;
        const y = mouseY - rect.top;
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
        applyTrailFade(img, y, rect);
        img.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0)`;
        img.style.transition = `transform ${config.inDuration}ms ${config.inEasing}, opacity 400ms ease`;
        trailLayer.appendChild(img);
        const t = setTimeout(() => {
          img.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(1)`;
        }, 10);
        timeouts.push(t);
        trail.push({
          element: img,
          rotation: rot,
          removeTime: Date.now() + config.imageLifespan,
          isFlame: true,
        });
        return;
      }

      const imageContainer = createImageElement();
      const rect = container.getBoundingClientRect();
      const x = mouseX - rect.left;
      const y = mouseY - rect.top;
      imageContainer.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        transform: translate3d(-50%, -50%, 0) scale(0);
        transition: transform ${config.inDuration}ms ${config.easing.scale}, opacity 400ms ease;
      `;
      applyTrailFade(imageContainer, y, rect);
      const fragments = pattern.create(imageContainer, imageSrc, size);
      fragments.forEach((fragment) => {
        imageContainer.appendChild(fragment.element);
      });
      trailLayer.appendChild(imageContainer);
      requestAnimationFrame(() => {
        imageContainer.style.transform = "translate3d(-50%, -50%, 0) scale(1)";
        fragments.forEach((fragment) => {
          const delay = pattern.revealTiming(fragment.index, fragments.length) * config.staggerRange;
          const t = setTimeout(() => fragment.reveal(), delay);
          timeouts.push(t);
        });
      });
      trail.push({
        element: imageContainer,
        fragments,
        pattern: currentEffect,
        removeTime: Date.now() + config.imageLifespan,
      });
    };

    const createTrailImage = () => {
      if (!isCursorInContainer) return;
      if ((isMoving || isTouching) && hasMovedEnough() && hasMovedAtAll()) {
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        const speed = calculateSpeed();
        createImage(speed);
        prevMouseX = mouseX;
        prevMouseY = mouseY;
      }
    };

    const createTouchTrailImage = () => {
      if (!isCursorInContainer || !isTouching || !hasMovedAtAll()) return;
      const now = Date.now();
      if (now - lastTouchImageTime < config.touchImageInterval) return;
      lastTouchImageTime = now;
      createImage(calculateSpeed());
      prevMouseX = mouseX;
      prevMouseY = mouseY;
    };

    const createScrollTrailImage = () => {
      if (!isCursorInContainer || !isScrolling) return;
      lastMouseX += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
      lastMouseY += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
      createImage(0.5);
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };

    const removeOldImages = () => {
      const now = Date.now();
      if (now - lastRemovalTime < config.removalDelay || !trail.length) return;
      if (now < trail[0].removeTime) return;

      const imgObj = trail.shift()!;
      const fadeOut = `opacity ${config.outDuration}ms ease, transform ${config.outDuration}ms ${config.outEasing}`;

      if (imgObj.isFlame) {
        imgObj.element.style.transition = fadeOut;
        imgObj.element.style.opacity = "0";
        imgObj.element.style.transform = `translate(-50%, -50%) rotate(${
          (imgObj.rotation ?? 0) + 360
        }deg) scale(0.85)`;
        const t = setTimeout(() => imgObj.element.remove(), config.outDuration);
        timeouts.push(t);
      } else {
        const { element, fragments, pattern: imagePattern } = imgObj;
        const pattern = patterns[imagePattern ?? "flame"];
        fragments?.forEach((fragment) => {
          const delay = pattern.collapseTiming(fragment.index, fragments.length) * config.staggerRange;
          const t = setTimeout(() => fragment.collapse(), delay);
          timeouts.push(t);
        });
        element.style.transition = fadeOut;
        element.style.opacity = "0";
        element.style.transform = "translate3d(-50%, -50%, 0) scale(0.85)";
        const t = setTimeout(() => returnToPool(element), config.outDuration);
        timeouts.push(t);
      }
      lastRemovalTime = now;
    };

    const onPointerEnter = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      isCursorInContainer = true;
    };

    const onPointerLeave = () => {
      isCursorInContainer = false;
      isMoving = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      isCursorInContainer = true;
      if (hasMovedAtAll()) {
        isMoving = true;
        lastActiveMove = Date.now();
        if (moveIdleTimer) window.clearTimeout(moveIdleTimer);
        moveIdleTimer = window.setTimeout(() => {
          isMoving = false;
        }, 120);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      isCursorInContainer = true;
      isTouching = true;
      lastMoveTime = Date.now();
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const dx = Math.abs(touch.clientX - prevMouseX);
      const dy = Math.abs(touch.clientY - prevMouseY);
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      isCursorInContainer = true;
      if (dy > dx) return;
      createTouchTrailImage();
    };

    const onTouchEnd = () => {
      isTouching = false;
    };

    const onDocTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t || isInContainer(t.clientX, t.clientY)) return;
      isCursorInContainer = false;
      isTouching = false;
    };

    const onScroll = () => {
      isCursorInContainer = isInContainer(mouseX, mouseY);
      if (!isCursorInContainer) return;
      isScrolling = true;
      const t = setTimeout(() => {
        isScrolling = false;
      }, 100);
      timeouts.push(t);
    };

    const onScrollTrail = () => {
      const now = Date.now();
      if (now - lastScrollTime < config.scrollThreshold) return;
      lastScrollTime = now;
      if (scrollTicking || !isCursorInContainer) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        if (isScrolling) createScrollTrailImage();
        scrollTicking = false;
      });
    };

    const onEffectClick = (e: Event) => {
      const target = (e.target as HTMLElement).closest<HTMLAnchorElement>("[data-effect]");
      if (!target) return;
      e.preventDefault();
      footer.querySelectorAll("[data-effect]").forEach((link) => {
        link.classList.remove("active");
      });
      target.classList.add("active");
      currentEffect = target.dataset.effect ?? "flame";
    };

    const animate = () => {
      const recentlyMoved = Date.now() - lastActiveMove < 140;
      if (isCursorInContainer && (isMoving || isTouching || isScrolling || recentlyMoved)) {
        createTrailImage();
      }
      removeOldImages();
      rafId = requestAnimationFrame(animate);
    };

    container.addEventListener("pointerenter", onPointerEnter);
    container.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchstart", onDocTouchStart, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScrollTrail, { passive: true });
    footer.addEventListener("click", onEffectClick);
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      if (moveIdleTimer) window.clearTimeout(moveIdleTimer);
      timeouts.forEach(clearTimeout);
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchstart", onDocTouchStart);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScrollTrail);
      footer.removeEventListener("click", onEffectClick);
      trail.forEach((entry) => entry.element.remove());
    };
  }, [boundsRef, trailLayerRef, footerRef, speedIndicatorRef]);
}

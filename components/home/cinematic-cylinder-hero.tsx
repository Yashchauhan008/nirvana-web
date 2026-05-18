"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Mesh, Program, Renderer, Texture, Transform } from "ogl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  cinematicCylinderConfig,
  cinematicCylinderImages,
  cinematicParticleConfig,
  cinematicPerspectives,
  getCinematicImageConfig,
} from "@/config/cinematic-cylinder";
import {
  cylinderFragment,
  cylinderVertex,
  particleFragment,
  particleVertex,
} from "@/lib/cinematic-cylinder/shaders";
import type { CameraAnimation, ParticleMesh } from "@/lib/cinematic-cylinder/types";
import {
  createCylinderGeometry,
  createParticleGeometry,
  drawImageCover,
  getPositionClasses,
} from "@/lib/cinematic-cylinder/utils";
import { scheduleScrollTriggerRefresh } from "@/lib/scroll/lenis-scroll";
import "@/styles/cinematic-cylinder.css";

gsap.registerPlugin(ScrollTrigger);

function getResponsiveDimensions() {
  const width = window.innerWidth;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const maxRadius = isMobile ? 2.5 : isTablet ? 3 : 3.5;
  const cameraZ = isMobile ? 7 : isTablet ? 8 : 9;
  const fov = isMobile ? 50 : 45;
  const dpr = isMobile ? 1.25 : Math.min(window.devicePixelRatio, 1.75);

  return {
    cylinderScale: maxRadius / cinematicCylinderConfig.radius,
    cameraZ,
    fov,
    dpr,
    isMobile,
    radialSegments: isMobile ? 32 : 48,
    particleCount: isMobile ? 0 : cinematicParticleConfig.numParticles,
  };
}

export function CinematicCylinderHero() {
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<Transform | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const cylinderRef = useRef<Mesh | null>(null);
  const cameraAnimRef = useRef<CameraAnimation>({ x: 0, y: 0, z: 9, rotY: 0 });
  const particlesRef = useRef<ParticleMesh[]>([]);
  const lastRotationRef = useRef(0);
  const velocityRef = useRef(0);
  const momentumRef = useRef(0);
  const isActiveRef = useRef(false);
  const isReadyRef = useRef(false);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);
  const renderTickRef = useRef<(() => void) | null>(null);
  const resizeHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let disposed = false;
    let initStarted = false;

    const mainHero = document.querySelector("[data-main-hero]");
    const philosophySection = document.querySelector("[data-philosophy]");
    const enterProgressRef = { current: 0 };
    const exitProgressRef = { current: 0 };

    const updateCylinderVisibility = () => {
      const enterP = Math.min(1, Math.max(0, enterProgressRef.current));
      const exitP = Math.min(1, Math.max(0, exitProgressRef.current));
      const visibility = enterP * (1 - exitP);

      const canvasWrap = canvasWrapRef.current;
      const overlay = overlayRef.current;
      const scrollHint = section.querySelector<HTMLElement>(
        ".cinematic-cylinder__scroll-hint",
      );

      if (canvasWrap) {
        canvasWrap.style.opacity = String(visibility);
        canvasWrap.style.visibility = visibility > 0.001 ? "visible" : "hidden";
      }
      if (overlay) {
        const overlayOpacity = Math.min(1, Math.max(0, (visibility - 0.22) / 0.78));
        overlay.style.opacity = String(overlayOpacity);
        overlay.style.visibility = overlayOpacity > 0.01 ? "visible" : "hidden";
      }
      if (scrollHint) {
        const hintOpacity = Math.min(1, Math.max(0, (visibility - 0.5) / 0.5));
        scrollHint.style.opacity = String(hintOpacity);
        scrollHint.style.visibility = hintOpacity > 0.01 ? "visible" : "hidden";
      }

      isActiveRef.current = visibility > 0.04;
      section.classList.toggle("cinematic-cylinder--active", visibility > 0.04);
    };

    if (mainHero) {
      const enterCrossfadeSt = ScrollTrigger.create({
        trigger: mainHero,
        start: "bottom bottom",
        end: "bottom top",
        scrub: 0.9,
        id: "hero-cylinder-crossfade",
        onUpdate: (self) => {
          enterProgressRef.current = self.progress;
          updateCylinderVisibility();
        },
      });
      scrollTriggersRef.current.push(enterCrossfadeSt);
    }

    if (philosophySection) {
      const exitCrossfadeSt = ScrollTrigger.create({
        trigger: philosophySection,
        start: "top bottom",
        end: "top top",
        scrub: 0.9,
        id: "cylinder-philosophy-crossfade",
        onUpdate: (self) => {
          exitProgressRef.current = self.progress;
          updateCylinderVisibility();
        },
      });
      scrollTriggersRef.current.push(exitCrossfadeSt);
    }

    const startInit = () => {
      if (initStarted || disposed) return;
      initStarted = true;
      initWebGL();
    };

    const lazyObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          lazyObserver.disconnect();
          startInit();
        }
      },
      { rootMargin: "80% 0px" },
    );
    lazyObserver.observe(section);

    const idleId =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(() => startInit(), { timeout: 2500 })
        : window.setTimeout(startInit, 1200);

    function initWebGL() {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const sectionEl = sectionRef.current;
      if (!canvas || !container || !sectionEl || disposed) return;

      const dimensions = getResponsiveDimensions();
      const imageConfig = getCinematicImageConfig(dimensions.isMobile);
      const cylinderConfig = {
        ...cinematicCylinderConfig,
        radius: dimensions.isMobile ? 3 : cinematicCylinderConfig.radius,
        height: dimensions.isMobile ? 1.2 : cinematicCylinderConfig.height,
        radialSegments: dimensions.radialSegments,
      };

      const renderer = new Renderer({
        canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: dimensions.dpr,
        alpha: false,
        antialias: !dimensions.isMobile,
      });
      const gl = renderer.gl;
      gl.clearColor(0.086, 0.157, 0.125, 1);
      gl.disable(gl.CULL_FACE);
      rendererRef.current = renderer;

      const camera = new Camera(gl, {
        fov: dimensions.fov,
        aspect: window.innerWidth / window.innerHeight,
      });
      camera.position.set(0, 0, dimensions.cameraZ);
      cameraRef.current = camera;

      const scene = new Transform();
      sceneRef.current = scene;

      const geometry = createCylinderGeometry(gl, cylinderConfig);
      const images = cinematicCylinderImages;
      const numImages = images.length;

      const hardwareLimit = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
      const safeLimit = dimensions.isMobile ? 2048 : Math.min(hardwareLimit, 6144);
      const atlasCanvas = document.createElement("canvas");
      const ctx = atlasCanvas.getContext("2d")!;
      const totalWidthOriginal = imageConfig.width * numImages;
      const scale = Math.min(1, safeLimit / totalWidthOriginal);
      atlasCanvas.width = Math.floor(totalWidthOriginal * scale);
      atlasCanvas.height = Math.floor(imageConfig.height * scale);

      let loadedImages = 0;
      const imageElements: HTMLImageElement[] = [];
      let lastWidth = window.innerWidth;

      const circumference = 2 * Math.PI * cylinderConfig.radius;
      const textureAspectRatio =
        imageConfig.height / (imageConfig.width * numImages);
      const idealHeight = circumference * textureAspectRatio;
      const heightCorrection = idealHeight / cylinderConfig.height;

      const handleResize = () => {
        if (!rendererRef.current || !cameraRef.current || !cylinderRef.current) return;

        const currentWidth = window.innerWidth;
        const newDimensions = getResponsiveDimensions();
        if (newDimensions.isMobile && currentWidth === lastWidth) return;
        lastWidth = currentWidth;

        rendererRef.current.dpr = newDimensions.dpr;
        rendererRef.current.setSize(currentWidth, window.innerHeight);
        cameraRef.current.perspective({
          fov: newDimensions.fov,
          aspect: currentWidth / window.innerHeight,
        });

        if (newDimensions.isMobile) {
          cylinderRef.current.scale.set(
            newDimensions.cylinderScale,
            newDimensions.cylinderScale * heightCorrection,
            newDimensions.cylinderScale,
          );
        } else {
          cylinderRef.current.scale.set(
            newDimensions.cylinderScale,
            newDimensions.cylinderScale * heightCorrection,
            newDimensions.cylinderScale,
          );
        }

        if ([7, 8, 9].includes(cameraAnimRef.current.z)) {
          cameraAnimRef.current.z = newDimensions.cameraZ;
        }
      };

      const setupScene = () => {
        if (disposed) return;

        const texture = new Texture(gl, {
          wrapS: gl.CLAMP_TO_EDGE,
          wrapT: gl.CLAMP_TO_EDGE,
          minFilter: gl.LINEAR,
          magFilter: gl.LINEAR,
          generateMipmaps: false,
        });
        texture.image = atlasCanvas;
        texture.needsUpdate = true;

        const program = new Program(gl, {
          vertex: cylinderVertex,
          fragment: cylinderFragment,
          uniforms: {
            tMap: { value: texture },
            uDarkness: { value: 0.15 },
          },
          cullFace: null,
        });

        const cylinder = new Mesh(gl, { geometry, program });
        cylinder.setParent(scene);
        cylinder.rotation.y = 0.5;
        cylinder.scale.set(
          dimensions.cylinderScale,
          dimensions.cylinderScale * heightCorrection,
          dimensions.cylinderScale,
        );
        cylinderRef.current = cylinder;
        isReadyRef.current = true;
        setIsLoading(false);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            id: "cinematic-cylinder-main",
          },
        });
        const mainSt = ScrollTrigger.getById("cinematic-cylinder-main");
        if (mainSt) scrollTriggersRef.current.push(mainSt);

        tl.to(cameraAnimRef.current, {
          x: 0,
          y: 0,
          z: dimensions.cameraZ,
          duration: 1,
          ease: "power2.inOut",
        })
          .to(cameraAnimRef.current, {
            x: 0,
            y: 5,
            z: 5,
            duration: 1,
            ease: "power3.inOut",
          })
          .to(cameraAnimRef.current, {
            x: 1.5,
            y: 2,
            z: 2,
            duration: 2,
            ease: "none",
          })
          .to(cameraAnimRef.current, {
            x: 0.5,
            y: 0,
            z: 0.8,
            duration: 3.5,
            ease: "power1.inOut",
          })
          .to(cameraAnimRef.current, {
            x: -6,
            y: -1,
            z: dimensions.cameraZ,
            duration: 1,
            ease: "power2.out",
          });

        tl.to(
          cylinder.rotation,
          { y: "+=28.27", duration: 8.5, ease: "none" },
          0,
        );

        const sectionCount = cinematicPerspectives.length;
        textRefs.current.forEach((textEl, index) => {
          if (!textEl) return;
          const sectionDuration = 100 / sectionCount;
          const start = index * sectionDuration;
          const end = (index + 1) * sectionDuration;

          const textTl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: `${start}% top`,
              end: `${end}% top`,
              scrub: 0.5,
              id: `cinematic-cylinder-text-${index}`,
            },
          });
          const textSt = ScrollTrigger.getById(`cinematic-cylinder-text-${index}`);
          if (textSt) scrollTriggersRef.current.push(textSt);
          textTl
            .fromTo(textEl, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" })
            .to(textEl, { opacity: 1, duration: 0.6, ease: "none" })
            .to(textEl, { opacity: 0, duration: 0.2, ease: "power2.in" });
        });

        for (let i = 0; i < dimensions.particleCount; i++) {
          const { geometry: lineGeometry, userData } = createParticleGeometry(
            gl,
            cinematicParticleConfig,
            i,
            cylinderConfig.height,
          );

          const lineProgram = new Program(gl, {
            vertex: particleVertex,
            fragment: particleFragment,
            uniforms: {
              uColor: { value: [0.71, 0.88, 0.76] },
              uOpacity: { value: 0 },
            },
            transparent: true,
            depthTest: true,
          });

          const particle = new Mesh(gl, {
            geometry: lineGeometry,
            program: lineProgram,
            mode: gl.LINE_STRIP,
          }) as ParticleMesh;

          particle.userData = userData;
          particle.setParent(scene);
          particlesRef.current.push(particle);
        }

        resizeHandlerRef.current = handleResize;
        window.addEventListener("resize", handleResize);

        const renderFrame = () => {
          if (disposed || !isReadyRef.current || !isActiveRef.current) return;

          camera.position.set(
            cameraAnimRef.current.x,
            cameraAnimRef.current.y,
            cameraAnimRef.current.z,
          );
          camera.lookAt([0, 0, 0]);

          if (cylinderRef.current) {
            const currentRotation = cylinderRef.current.rotation.y;
            velocityRef.current = currentRotation - lastRotationRef.current;
            lastRotationRef.current = currentRotation;
            momentumRef.current =
              momentumRef.current * 0.92 + velocityRef.current * 0.15;
            const speed = Math.abs(velocityRef.current) * 100;
            const isRotating = Math.abs(velocityRef.current) > 0.0001;

            particlesRef.current.forEach((particle) => {
              const userData = particle.userData;
              const targetOpacity = isRotating ? Math.min(speed * 3, 0.85) : 0;
              const currentOpacity = particle.program.uniforms.uOpacity.value as number;
              particle.program.uniforms.uOpacity.value =
                currentOpacity + (targetOpacity - currentOpacity) * 0.15;

              if (isRotating) {
                const rotationOffset = velocityRef.current * userData.speed * 1.5;
                userData.baseAngle += rotationOffset;
                const positions = particle.geometry.attributes.position.data as Float32Array;
                const { segments } = cinematicParticleConfig;

                for (let j = 0; j <= segments; j++) {
                  const t = j / segments;
                  const angle = userData.baseAngle + userData.angleSpan * t;
                  positions[j * 3] = Math.cos(angle) * userData.radius;
                  positions[j * 3 + 1] = userData.baseY;
                  positions[j * 3 + 2] = Math.sin(angle) * userData.radius;
                }
                particle.geometry.attributes.position.needsUpdate = true;
              }
            });
          }

          renderer.render({ scene, camera });
        };

        renderTickRef.current = renderFrame;
        gsap.ticker.add(renderFrame);

        scheduleScrollTriggerRefresh();
        window.dispatchEvent(new CustomEvent("nirvana:cinematic-ready"));
      };

      images.forEach((imageSrc, index) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (disposed) return;
          imageElements[index] = img;
          loadedImages += 1;

          if (loadedImages !== numImages) return;

          const totalCanvasWidth = atlasCanvas.width;
          const canvasHeight = atlasCanvas.height;

          imageElements.forEach((image, i) => {
            const xStart = Math.floor((i / numImages) * totalCanvasWidth);
            const xEnd = Math.floor(((i + 1) / numImages) * totalCanvasWidth);
            drawImageCover(ctx, image, xStart, 0, xEnd - xStart, canvasHeight);
          });

          setupScene();
        };
        img.onerror = () => {
          loadedImages += 1;
          if (loadedImages === numImages && !disposed) {
            setIsLoading(false);
          }
        };
        img.src = imageSrc;
      });
    }

    return () => {
      disposed = true;
      if (typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(idleId as number);
      } else {
        clearTimeout(idleId);
      }
      lazyObserver.disconnect();
      if (renderTickRef.current) {
        gsap.ticker.remove(renderTickRef.current);
        renderTickRef.current = null;
      }
      if (resizeHandlerRef.current) {
        window.removeEventListener("resize", resizeHandlerRef.current);
        resizeHandlerRef.current = null;
      }
      scrollTriggersRef.current.forEach((trigger) => trigger.kill());
      scrollTriggersRef.current = [];
      rendererRef.current?.gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <section ref={sectionRef} id="cinematic-hero" data-cinematic-hero className="cinematic-cylinder">
      {isLoading && <CinematicLoader />}

      <div ref={canvasWrapRef} className="cinematic-cylinder__canvas-wrap">
        <canvas ref={canvasRef} className="cinematic-cylinder__canvas" />
      </div>

      <div ref={overlayRef} className="cinematic-cylinder__overlay pointer-events-none">
        {cinematicPerspectives.map((perspective, index) => (
          <div
            key={perspective.title}
            ref={(el) => {
              textRefs.current[index] = el;
            }}
            className={`cinematic-cylinder__caption absolute opacity-0 ${getPositionClasses(perspective.position)}`}
          >
            <h2 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] text-[var(--nirvana-cream)]">
              {perspective.title}
            </h2>
            {perspective.description && (
              <p className="font-body mt-3 text-base text-[var(--nirvana-sage)] md:text-lg">
                {perspective.description}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="cinematic-cylinder__scroll-hint pointer-events-none">
        <span className="block h-10 w-px animate-pulse bg-[var(--nirvana-sage)]" />
        <span className="font-body-strong mt-2 text-[10px] uppercase tracking-[0.3em] text-[var(--nirvana-sage)]">
          Scroll
        </span>
      </div>

      <div ref={containerRef} className="cinematic-cylinder__scroll-track" aria-hidden />
    </section>
  );
}

function CinematicLoader() {
  return (
    <div className="cinematic-cylinder__loader" aria-live="polite">
      <span className="font-display text-2xl tracking-[0.3em] text-[var(--nirvana-cream)]">
        NIRVANA
      </span>
      <span className="font-body mt-3 text-xs uppercase tracking-[0.35em] text-[var(--nirvana-sage)]">
        Loading experience
      </span>
    </div>
  );
}

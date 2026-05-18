import gsap from "gsap";
import * as THREE from "three";

import { Planes } from "./planes";
import type { Dimensions, GalleryItem, Size } from "./types";

export interface VisualGalleryOptions {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  items: GalleryItem[];
}

export class VisualGallery {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  sizes!: Size;
  dimensions: Dimensions;
  time = 0;
  clock: THREE.Clock;
  planes: Planes;
  container: HTMLElement;
  private isVisible = false;
  private observer: IntersectionObserver | null = null;
  private onResizeBound = () => this.onResize();
  private renderBound = () => this.render();

  constructor({ canvas, container, items }: VisualGalleryOptions) {
    this.container = container;
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x162820);

    const { width, height } = container.getBoundingClientRect();
    this.dimensions = {
      width: Math.max(width, 1),
      height: Math.max(height, 1),
      pixelRatio: Math.min(1.5, window.devicePixelRatio),
    };

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.dimensions.width / this.dimensions.height,
      0.1,
      100,
    );
    this.scene.add(this.camera);
    this.camera.position.z = 10;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: window.innerWidth >= 768,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(this.dimensions.width, this.dimensions.height);
    this.renderer.setPixelRatio(this.dimensions.pixelRatio);

    this.setSizes();
    this.planes = new Planes({
      scene: this.scene,
      sizes: this.sizes,
      items,
    });
    this.planes.bindDrag(canvas);
    this.planes.bindWheel(container);

    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.isVisible = entry.isIntersecting;
      },
      { rootMargin: "120px 0px" },
    );
    this.observer.observe(container);

    window.addEventListener("resize", this.onResizeBound);
    gsap.ticker.add(this.renderBound);
  }

  setSizes() {
    const fov = this.camera.fov * (Math.PI / 180);
    const height = this.camera.position.z * Math.tan(fov / 2) * 2;
    const width = height * this.camera.aspect;
    this.sizes = { width, height };
    if (this.planes) {
      this.planes.shaderParameters.maxX = width * 2;
      this.planes.shaderParameters.maxY = height * 2;
      this.planes.material.uniforms.uMaxXdisplacement.value.set(width * 2, height * 2);
    }
  }

  onResize() {
    const { width, height } = this.container.getBoundingClientRect();
    this.dimensions = {
      width: Math.max(width, 1),
      height: Math.max(height, 1),
      pixelRatio: Math.min(1.5, window.devicePixelRatio),
    };
    this.camera.aspect = this.dimensions.width / this.dimensions.height;
    this.camera.updateProjectionMatrix();
    this.setSizes();
    this.renderer.setPixelRatio(this.dimensions.pixelRatio);
    this.renderer.setSize(this.dimensions.width, this.dimensions.height);
  }

  render = () => {
    if (!this.isVisible) return;

    const now = this.clock.getElapsedTime();
    const delta = now - this.time;
    this.time = now;
    const normalizedDelta = delta / (1 / 60);
    this.planes?.render(normalizedDelta);
    this.renderer.render(this.scene, this.camera);
  };

  destroy() {
    gsap.ticker.remove(this.renderBound);
    this.observer?.disconnect();
    window.removeEventListener("resize", this.onResizeBound);
    this.planes.dispose();
    this.renderer.dispose();
  }
}

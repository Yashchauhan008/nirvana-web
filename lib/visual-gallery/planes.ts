import * as THREE from "three";
import normalizeWheel from "normalize-wheel";

import { fragmentShader, vertexShader } from "./shaders";
import type { GalleryItem, Size } from "./types";

interface PlanesProps {
  scene: THREE.Scene;
  sizes: Size;
  items: GalleryItem[];
}

interface ImageInfo {
  width: number;
  height: number;
  aspectRatio: number;
  uvs: {
    xStart: number;
    xEnd: number;
    yStart: number;
    yEnd: number;
  };
}

const CARD_WIDTH = 512;
const IMAGE_HEIGHT = 620;
const NAME_BAR_HEIGHT = 88;

const interpolate = (current: number, target: number, ease: number) =>
  current + (target - current) * ease;

async function loadImageSource(path: string): Promise<CanvasImageSource> {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to fetch: ${path}`);
    const blob = await res.blob();
    return (await createImageBitmap(blob)) as CanvasImageSource;
  } catch {
    return new Promise<CanvasImageSource>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = path;
    });
  }
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sw: number,
  sh: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  const scale = Math.max(dw / sw, dh / sh);
  const w = sw * scale;
  const h = sh * scale;
  const x = dx + (dw - w) / 2;
  const y = dy + (dh - h) / 2;
  ctx.drawImage(source, x, y, w, h);
}

function buildCardCanvas(source: CanvasImageSource, sw: number, sh: number, name: string) {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = IMAGE_HEIGHT + NAME_BAR_HEIGHT;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#f8fbf9";
  ctx.fillRect(0, 0, CARD_WIDTH, canvas.height);

  drawCover(ctx, source, sw, sh, 0, 0, CARD_WIDTH, IMAGE_HEIGHT);

  ctx.fillStyle = "#2a4538";
  ctx.fillRect(0, IMAGE_HEIGHT, CARD_WIDTH, NAME_BAR_HEIGHT);

  ctx.fillStyle = "#eef6f1";
  ctx.font = "600 26px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(name, CARD_WIDTH / 2, IMAGE_HEIGHT + NAME_BAR_HEIGHT / 2);

  return canvas;
}

export class Planes {
  scene: THREE.Scene;
  geometry!: THREE.PlaneGeometry;
  material!: THREE.ShaderMaterial;
  mesh!: THREE.InstancedMesh;
  meshCount = 400;
  sizes: Size;
  items: GalleryItem[];
  wheelTarget?: HTMLElement;

  drag = {
    xCurrent: 0,
    xTarget: 0,
    yCurrent: 0,
    yTarget: 0,
    isDown: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  };

  shaderParameters = { maxX: 0, maxY: 0 };

  scrollY = { target: 0, current: 0, direction: 0 };

  dragSensitivity = 1;
  dragDamping = 0.1;
  imageInfos: ImageInfo[] = [];
  atlasTexture: THREE.Texture | null = null;

  private onWheelBound = (event: WheelEvent) => this.onWheel(event);

  constructor({ scene, sizes, items }: PlanesProps) {
    this.scene = scene;
    this.sizes = sizes;
    this.items = items;

    this.shaderParameters = {
      maxX: this.sizes.width * 2,
      maxY: this.sizes.height * 2,
    };

    this.createGeometry();
    this.createMaterial();
    this.createInstancedMesh();
    void this.loadItems();
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1.69, 1, 1);
    this.geometry.scale(2, 2, 2);
  }

  async loadItems() {
    await this.loadTextureAtlas(this.items);
    this.fillMeshData();
  }

  async loadTextureAtlas(items: GalleryItem[]) {
    const cards = await Promise.all(
      items.map(async (item) => {
        const source = await loadImageSource(item.image);
        const sw = (source as HTMLImageElement).width || CARD_WIDTH;
        const sh = (source as HTMLImageElement).height || IMAGE_HEIGHT;
        return buildCardCanvas(source, sw, sh, item.name);
      }),
    );

    const atlasWidth = CARD_WIDTH;
    const totalHeight = cards.reduce((sum, card) => sum + card.height, 0);

    const canvas = document.createElement("canvas");
    canvas.width = atlasWidth;
    canvas.height = totalHeight;
    const ctx = canvas.getContext("2d")!;

    let currentY = 0;
    this.imageInfos = cards.map((card) => {
      ctx.drawImage(card, 0, currentY);
      const h = card.height;
      const info = {
        width: card.width,
        height: h,
        aspectRatio: card.width / h,
        uvs: {
          xStart: 0,
          xEnd: card.width / atlasWidth,
          yStart: 1 - currentY / totalHeight,
          yEnd: 1 - (currentY + h) / totalHeight,
        },
      };
      currentY += h;
      return info;
    });

    this.atlasTexture = new THREE.Texture(canvas);
    this.atlasTexture.wrapS = THREE.ClampToEdgeWrapping;
    this.atlasTexture.wrapT = THREE.ClampToEdgeWrapping;
    this.atlasTexture.minFilter = THREE.LinearFilter;
    this.atlasTexture.magFilter = THREE.LinearFilter;
    this.atlasTexture.needsUpdate = true;
    this.material.uniforms.uAtlas.value = this.atlasTexture;
  }

  createMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uMaxXdisplacement: {
          value: new THREE.Vector2(this.shaderParameters.maxX, this.shaderParameters.maxY),
        },
        uAtlas: { value: this.atlasTexture },
        uScrollY: { value: 0 },
        uSpeedY: { value: 0 },
        uDrag: { value: new THREE.Vector2(0, 0) },
      },
    });
  }

  createInstancedMesh() {
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.meshCount);
    this.scene.add(this.mesh);
  }

  fillMeshData() {
    if (!this.imageInfos.length) return;

    const initialPosition = new Float32Array(this.meshCount * 3);
    const meshSpeed = new Float32Array(this.meshCount);
    const aTextureCoords = new Float32Array(this.meshCount * 4);

    for (let i = 0; i < this.meshCount; i++) {
      initialPosition[i * 3] = (Math.random() - 0.5) * this.shaderParameters.maxX * 2;
      initialPosition[i * 3 + 1] = (Math.random() - 0.5) * this.shaderParameters.maxY * 2;
      initialPosition[i * 3 + 2] = Math.random() * 37 - 30;
      meshSpeed[i] = Math.random() * 0.5 + 0.5;

      const imageIndex = i % this.imageInfos.length;
      aTextureCoords[i * 4] = this.imageInfos[imageIndex].uvs.xStart;
      aTextureCoords[i * 4 + 1] = this.imageInfos[imageIndex].uvs.xEnd;
      aTextureCoords[i * 4 + 2] = this.imageInfos[imageIndex].uvs.yStart;
      aTextureCoords[i * 4 + 3] = this.imageInfos[imageIndex].uvs.yEnd;
    }

    this.geometry.setAttribute(
      "aInitialPosition",
      new THREE.InstancedBufferAttribute(initialPosition, 3),
    );
    this.geometry.setAttribute(
      "aMeshSpeed",
      new THREE.InstancedBufferAttribute(meshSpeed, 1),
    );
    this.mesh.geometry.setAttribute(
      "aTextureCoords",
      new THREE.InstancedBufferAttribute(aTextureCoords, 4),
    );
  }

  bindDrag(element: HTMLElement) {
    const onPointerDown = (e: PointerEvent) => {
      this.drag.isDown = true;
      this.drag.startX = e.clientX;
      this.drag.startY = e.clientY;
      this.drag.lastX = e.clientX;
      this.drag.lastY = e.clientY;
      element.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!this.drag.isDown) return;
      const dx = e.clientX - this.drag.lastX;
      const dy = e.clientY - this.drag.lastY;
      this.drag.lastX = e.clientX;
      this.drag.lastY = e.clientY;

      const worldPerPixelX = (this.sizes.width / window.innerWidth) * this.dragSensitivity;
      const worldPerPixelY = (this.sizes.height / window.innerHeight) * this.dragSensitivity;

      this.drag.xTarget += -dx * worldPerPixelX;
      this.drag.yTarget += dy * worldPerPixelY;
    };

    const onPointerUp = (e: PointerEvent) => {
      this.drag.isDown = false;
      try {
        element.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };

    element.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  bindWheel(element: HTMLElement) {
    this.wheelTarget = element;
    element.addEventListener("wheel", this.onWheelBound, { passive: false });
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    event.stopPropagation();
    const normalizedWheel = normalizeWheel(event);
    const scrollY = (normalizedWheel.pixelY * this.sizes.height) / window.innerHeight;
    this.scrollY.target += scrollY;
    this.material.uniforms.uSpeedY.value += scrollY;
  }

  render(delta: number) {
    this.material.uniforms.uTime.value += delta * 0.015;

    this.drag.xCurrent += (this.drag.xTarget - this.drag.xCurrent) * this.dragDamping;
    this.drag.yCurrent += (this.drag.yTarget - this.drag.yCurrent) * this.dragDamping;
    this.material.uniforms.uDrag.value.set(this.drag.xCurrent, this.drag.yCurrent);

    this.scrollY.current = interpolate(this.scrollY.current, this.scrollY.target, 0.12);
    this.material.uniforms.uScrollY.value = this.scrollY.current;
    this.material.uniforms.uSpeedY.value *= 0.835;
  }

  dispose() {
    this.wheelTarget?.removeEventListener("wheel", this.onWheelBound);
    this.scene.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();
    this.atlasTexture?.dispose();
  }
}

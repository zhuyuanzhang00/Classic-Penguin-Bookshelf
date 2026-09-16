import * as THREE from "three";
import type { Book } from "@/types/book";

const SPINE_INK = "#FFFFFF";

function canvasTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

function luminance(hex: string) {
  const raw = hex.replace("#", "");
  const n = Number.parseInt(raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw, 16);
  if (!Number.isFinite(n)) return 0;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function darken(hex: string, amount = 0.35) {
  const raw = hex.replace("#", "");
  const full = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
  const n = Number.parseInt(full, 16);
  if (!Number.isFinite(n)) return "#1c1917";
  const r = Math.round(((n >> 16) & 255) * (1 - amount));
  const g = Math.round(((n >> 8) & 255) * (1 - amount));
  const b = Math.round((n & 255) * (1 - amount));
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** Dark cloth/band so white spine lettering stays readable. */
export function spineCloth(book: Book) {
  const band = book.palette.band;
  const cloth = book.palette.cloth;
  if (luminance(band) < 0.52) return band;
  if (luminance(cloth) < 0.52) return cloth;
  return darken(band, 0.45);
}

export function makeSpineTexture(book: Book) {
  const canvas = document.createElement("canvas");
  canvas.width = 160;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create spine canvas.");

  const cloth = spineCloth(book);
  ctx.fillStyle = cloth;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.fillRect(0, 0, canvas.width, 56);
  ctx.fillRect(0, canvas.height - 56, canvas.width, 56);
  ctx.fillStyle = SPINE_INK;
  ctx.fillRect(18, 64, canvas.width - 36, 5);
  ctx.fillRect(18, canvas.height - 69, canvas.width - 36, 5);

  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, 108, 22, 28, 0, 0, Math.PI * 2);
  ctx.fillStyle = SPINE_INK;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, 114, 12, 16, 0, 0, Math.PI * 2);
  ctx.fillStyle = cloth;
  ctx.fill();

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2 + 24);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = SPINE_INK;
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowBlur = 10;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 78px Georgia, 'Times New Roman', serif";
  ctx.fillText(book.title.toUpperCase(), -40, 0, 720);
  ctx.shadowBlur = 8;
  ctx.font = "600 42px Georgia, 'Times New Roman', serif";
  ctx.fillText(book.author, 360, 0, 420);
  ctx.restore();

  return canvasTexture(canvas);
}

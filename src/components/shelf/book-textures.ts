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

function parseRgb(hex: string): [number, number, number] {
  const raw = hex.replace("#", "");
  const full = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
  const n = Number.parseInt(full, 16);
  if (!Number.isFinite(n)) return [28, 25, 23];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

function luminance(hex: string) {
  const [r, g, b] = parseRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function mix(hex: string, other: string, amount: number) {
  const a = parseRgb(hex);
  const b = parseRgb(other);
  return toHex(
    a[0] + (b[0] - a[0]) * amount,
    a[1] + (b[1] - a[1]) * amount,
    a[2] + (b[2] - a[2]) * amount,
  );
}

function darken(hex: string, amount = 0.35) {
  const [r, g, b] = parseRgb(hex);
  return toHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

/**
 * Lift cloth a few steps toward white so spines read in a brighter room,
 * but cap luminance so white lettering stays contrasty.
 */
export function spineCloth(book: Book) {
  const band = book.palette.band;
  const cloth = book.palette.cloth;
  const base = luminance(band) < luminance(cloth) ? band : cloth;
  const lifted = mix(base, "#ffffff", 0.2);
  if (luminance(lifted) <= 0.56) return lifted;
  const gentle = mix(base, "#ffffff", 0.08);
  if (luminance(gentle) <= 0.56) return gentle;
  return darken(base, 0.28);
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

  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.fillRect(0, 0, canvas.width, 48);
  ctx.fillRect(0, canvas.height - 48, canvas.width, 48);
  ctx.fillStyle = SPINE_INK;
  ctx.fillRect(18, 58, canvas.width - 36, 4);
  ctx.fillRect(18, canvas.height - 62, canvas.width - 36, 4);

  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, 102, 22, 22, 0, 0, Math.PI * 2);
  ctx.fillStyle = SPINE_INK;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(canvas.width / 2 - 7, 98, 3.2, 0, Math.PI * 2);
  ctx.arc(canvas.width / 2 + 7, 98, 3.2, 0, Math.PI * 2);
  ctx.fillStyle = cloth;
  ctx.fill();

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2 + 24);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = SPINE_INK;
  ctx.shadowColor = "rgba(0,0,0,0.78)";
  ctx.shadowBlur = 8;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 78px Georgia, 'Times New Roman', serif";
  ctx.fillText(book.title.toUpperCase(), -40, 0, 720);
  ctx.shadowBlur = 6;
  ctx.font = "600 42px Georgia, 'Times New Roman', serif";
  ctx.fillText(book.author, 360, 0, 420);
  ctx.restore();

  return canvasTexture(canvas);
}

/** Cream ruled sheet used on the open spread (verso + recto). */
export function makePageTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create page canvas.");

  ctx.fillStyle = "#fbf6e8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(196, 168, 120, 0.18)";
  ctx.fillRect(36, 0, 2, canvas.height);
  ctx.strokeStyle = "rgba(120, 96, 64, 0.14)";
  ctx.lineWidth = 1;
  for (let y = 56; y < canvas.height - 36; y += 28) {
    ctx.beginPath();
    ctx.moveTo(52, y);
    ctx.lineTo(canvas.width - 36, y);
    ctx.stroke();
  }

  return canvasTexture(canvas);
}

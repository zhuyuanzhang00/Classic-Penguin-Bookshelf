import * as THREE from "three";
import type { Book } from "@/types/book";

function canvasTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

export function makeSpineTexture(book: Book) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create spine canvas.");

  ctx.fillStyle = book.palette.band;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = book.palette.ink;
  ctx.fillRect(0, 0, canvas.width, 18);
  ctx.fillRect(0, canvas.height - 18, canvas.width, 18);
  ctx.fillStyle = book.palette.paper;
  ctx.fillRect(0, 18, canvas.width, 3);
  ctx.fillRect(0, canvas.height - 21, canvas.width, 3);

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = book.palette.spineInk;
  ctx.font = "700 16px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(book.title, 0, 0, 210);
  ctx.restore();

  return canvasTexture(canvas);
}

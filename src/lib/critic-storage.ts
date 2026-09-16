import type { Book, CriticPatch } from "@/types/book";

export const CRITIC_STORAGE_KEY = "orange-band-critic-v1";

type CriticMap = Record<string, CriticPatch>;

function isPatch(value: unknown): value is CriticPatch {
  if (!value || typeof value !== "object") return false;
  const patch = value as Record<string, unknown>;
  return (
    typeof patch.criticRating === "number" &&
    Number.isInteger(patch.criticRating) &&
    patch.criticRating >= 1 &&
    patch.criticRating <= 5 &&
    typeof patch.criticReview === "string"
  );
}

export function readCriticMap(): CriticMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CRITIC_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const next: CriticMap = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (isPatch(value)) next[id] = value;
    }
    return next;
  } catch {
    return {};
  }
}

export function mergeCriticFields(seed: Book[], stored: CriticMap = readCriticMap()): Book[] {
  return seed.map((book) => {
    const live = stored[String(book.id)];
    if (!live) return book;
    return {
      ...book,
      criticRating: live.criticRating,
      criticReview: live.criticReview,
    };
  });
}

export function writeCriticPatch(id: number, patch: CriticPatch) {
  const stored = readCriticMap();
  stored[String(id)] = {
    criticRating: patch.criticRating,
    criticReview: patch.criticReview,
  };
  window.localStorage.setItem(CRITIC_STORAGE_KEY, JSON.stringify(stored));
}

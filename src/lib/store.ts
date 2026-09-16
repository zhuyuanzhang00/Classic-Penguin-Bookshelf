import { SEED_BOOKS } from "@/data/seed";
import type { Book, CriticPatch } from "@/types/book";
import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_PATH = path.join(process.cwd(), "data", "books.json");

let memoryStore: Book[] | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function mergeLiveFields(stored: Book[]): Book[] {
  const byId = new Map(stored.map((book) => [book.id, book]));
  return SEED_BOOKS.map((seed) => {
    const live = byId.get(seed.id);
    if (!live) return { ...seed };
    return {
      ...seed,
      criticRating: live.criticRating,
      criticReview: live.criticReview,
    };
  });
}

async function persist(books: Book[]) {
  memoryStore = books;
  const task = async () => {
    try {
      await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
      await fs.writeFile(DATA_PATH, JSON.stringify(books, null, 2), "utf8");
    } catch {
      // Serverless / read-only filesystems keep the in-memory copy for this process.
    }
  };
  writeQueue = writeQueue.then(task, task);
  await writeQueue;
}

export async function getBooks(): Promise<Book[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    memoryStore = mergeLiveFields(JSON.parse(raw) as Book[]);
    return memoryStore;
  } catch {
    if (memoryStore) return memoryStore;
    const seeded = mergeLiveFields(SEED_BOOKS);
    await persist(seeded);
    return seeded;
  }
}

export async function getBook(id: number): Promise<Book | null> {
  const books = await getBooks();
  return books.find((book) => book.id === id) ?? null;
}

export async function updateCriticFields(
  id: number,
  patch: CriticPatch,
): Promise<Book | null> {
  const books = await getBooks();
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) return null;

  const next = books.map((book, i) =>
    i === index
      ? {
          ...book,
          criticRating: patch.criticRating,
          criticReview: patch.criticReview,
        }
      : book,
  );

  await persist(next);
  return next[index] ?? null;
}

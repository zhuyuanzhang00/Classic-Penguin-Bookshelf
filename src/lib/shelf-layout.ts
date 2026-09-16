import {
  BACK_GAP,
  BACK_Z,
  BOOK_GAP,
  INNER_X_MAX,
  INNER_X_MIN,
  SHELF_CEILINGS,
  SHELF_TOPS,
  SIDE_INSET,
  SIT_EPSILON,
} from "@/lib/shelf-case";
import type { Book } from "@/types/book";

export const SHELF_GROUPS: number[][] = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
];

export type PlacedBook = {
  book: Book;
  position: [number, number, number];
  shelfIndex: number;
};

export function layoutBooks(books: Book[]): PlacedBook[] {
  const byId = new Map(books.map((book) => [book.id, book]));
  const placed: PlacedBook[] = [];
  const usableLeft = INNER_X_MIN + SIDE_INSET;
  const usableRight = INNER_X_MAX - SIDE_INSET;

  SHELF_GROUPS.forEach((ids, shelfIndex) => {
    const row = ids
      .map((id) => byId.get(id))
      .filter((book): book is Book => Boolean(book));
    const plankTop = SHELF_TOPS[shelfIndex] ?? 0;
    const total =
      row.reduce((sum, book) => sum + book.thickness, 0) +
      BOOK_GAP * Math.max(row.length - 1, 0);
    const span = usableRight - usableLeft;
    let x = usableLeft + Math.max(0, (span - total) / 2);

    for (const book of row) {
      const restZ = BACK_Z + BACK_GAP + book.depth / 2;
      placed.push({
        book,
        shelfIndex,
        position: [
          x + book.thickness / 2,
          plankTop + SIT_EPSILON + book.height / 2,
          restZ,
        ],
      });
      x += book.thickness + BOOK_GAP;
    }
  });

  return placed;
}

export function assertBooksClearPlanks(books: Book[]) {
  const issues: string[] = [];
  for (const placed of layoutBooks(books)) {
    const { book, position, shelfIndex } = placed;
    const [x, y, z] = position;
    const left = x - book.thickness / 2;
    const right = x + book.thickness / 2;
    const bottom = y - book.height / 2;
    const top = y + book.height / 2;
    const back = z - book.depth / 2;
    const plankTop = SHELF_TOPS[shelfIndex];
    const ceiling = SHELF_CEILINGS[shelfIndex];

    if (bottom < plankTop - 0.0001) {
      issues.push(`${book.title} clips into plank ${shelfIndex} by ${plankTop - bottom}`);
    }
    if (top > ceiling) {
      issues.push(`${book.title} clips ceiling on row ${shelfIndex} by ${top - ceiling}`);
    }
    if (left < INNER_X_MIN || right > INNER_X_MAX) {
      issues.push(`${book.title} intersects side wall`);
    }
    if (back < BACK_Z) {
      issues.push(`${book.title} intersects back panel`);
    }
  }
  return issues;
}

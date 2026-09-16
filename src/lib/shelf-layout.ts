import type { Book } from "@/types/book";

export const SHELF_PLANKS = [2.18, -0.02, -2.22] as const;

export const SHELF_GROUPS: number[][] = [
  [1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17],
];

export type PlacedBook = {
  book: Book;
  position: [number, number, number];
  shelfIndex: number;
};

export function layoutBooks(books: Book[]): PlacedBook[] {
  const byId = new Map(books.map((book) => [book.id, book]));
  const placed: PlacedBook[] = [];
  const gap = 0.038;

  SHELF_GROUPS.forEach((ids, shelfIndex) => {
    const row = ids
      .map((id) => byId.get(id))
      .filter((book): book is Book => Boolean(book));
    const plankY = SHELF_PLANKS[shelfIndex] ?? 0;
    const total =
      row.reduce((sum, book) => sum + book.thickness, 0) +
      gap * Math.max(row.length - 1, 0);
    let x = -total / 2;

    for (const book of row) {
      placed.push({
        book,
        shelfIndex,
        position: [x + book.thickness / 2, plankY + 0.03 + book.height / 2, 0.12],
      });
      x += book.thickness + gap;
    }
  });

  return placed;
}

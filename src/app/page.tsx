import { BookDetailPanel } from "@/components/book-detail-panel";
import { ShelfStage } from "@/components/shelf-stage";
import { SpineRail } from "@/components/spine-rail";
import { getBooks } from "@/lib/store";

export const dynamic = "force-dynamic";

function parseBookId(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const id = Number.parseInt(raw, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ book?: string | string[]; saved?: string | string[] }>;
}) {
  const books = await getBooks();
  const params = await searchParams;
  const selectedId = parseBookId(params.book);
  const selected = books.find((book) => book.id === selectedId) ?? null;
  const saved = params.saved === "1" || params.saved?.[0] === "1";

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ShelfStage books={books} selectedId={selectedId} />
      <SpineRail books={books} selectedId={selectedId} />
      {selected ? <BookDetailPanel book={selected} saved={saved} /> : null}
    </main>
  );
}

"use client";

import { BookDetailPanel } from "@/components/book-detail-panel";
import { ShelfStage } from "@/components/shelf-stage";
import { SpineRail } from "@/components/spine-rail";
import { mergeCriticFields, writeCriticPatch } from "@/lib/critic-storage";
import { PULL_DURATION_MS } from "@/lib/shelf-case";
import type { Book, CriticPatch } from "@/types/book";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function parseBookId(value: string | null) {
  if (!value) return null;
  const id = Number.parseInt(value, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function ShelfApp({ books: seed }: { books: Book[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = parseBookId(searchParams.get("book"));
  const saved = searchParams.get("saved") === "1";
  const [books, setBooks] = useState(seed);
  const [hydrated, setHydrated] = useState(false);
  const [panelId, setPanelId] = useState<number | null>(null);

  useEffect(() => {
    setBooks(mergeCriticFields(seed));
    setHydrated(true);
  }, [seed]);

  useEffect(() => {
    if (selectedId == null) {
      setPanelId(null);
      return;
    }
    setPanelId(null);
    const timer = window.setTimeout(() => setPanelId(selectedId), PULL_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [selectedId]);

  const selected = useMemo(
    () => books.find((book) => book.id === selectedId) ?? null,
    [books, selectedId],
  );

  function handleSave(id: number, patch: CriticPatch) {
    writeCriticPatch(id, patch);
    setBooks(mergeCriticFields(seed));
    router.replace(`/?book=${id}&saved=1`);
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ShelfStage books={books} selectedId={selectedId} />
      <SpineRail books={books} selectedId={selectedId} />
      {selected && hydrated && panelId === selected.id ? (
        <BookDetailPanel
          key={selected.id}
          book={selected}
          saved={saved}
          onSave={handleSave}
        />
      ) : null}
    </main>
  );
}

export function ShelfAppFallback({ books }: { books: Book[] }) {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ShelfStage books={books} selectedId={null} />
      <SpineRail books={books} selectedId={null} />
    </main>
  );
}

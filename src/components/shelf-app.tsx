"use client";

import { BookDetailPanel } from "@/components/book-detail-panel";
import { ShelfStage } from "@/components/shelf-stage";
import { mergeCriticFields, writeCriticPatch } from "@/lib/critic-storage";
import { OPEN_SEQUENCE_MS } from "@/lib/shelf-case";
import type { Book, CriticPatch } from "@/types/book";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function parseBookId(value: string | null) {
  if (!value) return null;
  const id = Number.parseInt(String(value).replace(/\/$/, ""), 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function bookIdFromLocation() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return parseBookId(params.get("book"));
}

function savedFromLocation() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("saved") === "1";
}

function ShelfShell({
  seed,
  selectedId,
  saved,
}: {
  seed: Book[];
  selectedId: number | null;
  saved: boolean;
}) {
  const router = useRouter();
  const [books, setBooks] = useState(seed);
  const [panelRevealed, setPanelRevealed] = useState(false);
  const selected = useMemo(
    () => books.find((book) => book.id === selectedId) ?? null,
    [books, selectedId],
  );

  useEffect(() => {
    setBooks(mergeCriticFields(seed));
  }, [seed]);

  useEffect(() => {
    if (selectedId == null) {
      setPanelRevealed(false);
      return;
    }
    setPanelRevealed(false);
    const timer = window.setTimeout(() => setPanelRevealed(true), OPEN_SEQUENCE_MS);
    return () => window.clearTimeout(timer);
  }, [selectedId]);

  function handleSave(id: number, patch: CriticPatch) {
    writeCriticPatch(id, patch);
    setBooks(mergeCriticFields(seed));
    router.replace(`/?book=${id}&saved=1`);
  }

  return (
    <>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ShelfStage books={books} selectedId={selectedId} />
      </main>
      {selected ? (
        <BookDetailPanel
          key={selected.id}
          book={selected}
          saved={saved}
          revealed={panelRevealed}
          onSave={handleSave}
        />
      ) : null}
    </>
  );
}

export function ShelfApp({ books: seed }: { books: Book[] }) {
  const searchParams = useSearchParams();
  const fromRouter = parseBookId(searchParams.get("book"));
  const [fromWindow, setFromWindow] = useState<number | null>(null);
  const selectedId = fromWindow ?? fromRouter;
  const saved = searchParams.get("saved") === "1";

  useEffect(() => {
    setFromWindow(bookIdFromLocation());
  }, [fromRouter, searchParams]);

  return <ShelfShell seed={seed} selectedId={selectedId} saved={saved} />;
}

/** Shown while useSearchParams suspends — still opens ?book= from the address bar. */
export function ShelfAppFallback({ books: seed }: { books: Book[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => {
      setSelectedId(bookIdFromLocation());
      setSaved(savedFromLocation());
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  return <ShelfShell seed={seed} selectedId={selectedId} saved={saved} />;
}

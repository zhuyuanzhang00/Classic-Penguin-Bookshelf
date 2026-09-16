"use client";

import { ShelfErrorBoundary } from "@/components/shelf/shelf-error-boundary";
import { ShelfFallback } from "@/components/shelf/shelf-fallback";
import { canCreateWebGLContext } from "@/components/shelf/webgl";
import type { Book } from "@/types/book";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ShelfCanvasProps = {
  books: Book[];
  selectedId: number | null;
  onSelect: (book: Book) => void;
  onDeselect: () => void;
  onCreated?: () => void;
};

export function ShelfStage({
  books,
  selectedId,
}: {
  books: Book[];
  selectedId: number | null;
}) {
  const router = useRouter();
  const [Canvas, setCanvas] = useState<ComponentType<ShelfCanvasProps> | null>(
    null,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canCreateWebGLContext()) return;
    let cancelled = false;
    import("@/components/shelf/shelf-canvas")
      .then((mod) => {
        if (!cancelled) setCanvas(() => mod.default);
      })
      .catch(() => {
        if (!cancelled) setCanvas(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-0 flex-1 bg-[#140c09]">
      <div className={ready ? "invisible h-full" : "h-full"}>
        <ShelfFallback books={books} selectedId={selectedId} />
      </div>
      {Canvas ? (
        <div
          className={
            ready
              ? selectedId != null
                ? "pointer-events-none absolute inset-0 z-0"
                : "absolute inset-0 z-0"
              : "pointer-events-none invisible absolute inset-0 z-0"
          }
        >
          <ShelfErrorBoundary
            fallback={<ShelfFallback books={books} selectedId={selectedId} />}
          >
            <Canvas
              books={books}
              selectedId={selectedId}
              onSelect={(book) => router.push(`/?book=${book.id}`)}
              onDeselect={() => {
                if (document.querySelector("[data-book-detail-panel]")) return;
                router.push("/");
              }}
              onCreated={() => setReady(true)}
            />
          </ShelfErrorBoundary>
          <p className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-[11px] uppercase tracking-[0.28em] text-[#f4e6d0]/70 md:block">
            Drag to orbit · click a spine to pull it out and open it
          </p>
        </div>
      ) : null}
    </div>
  );
}
